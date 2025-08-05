// Redux slice for chat state management (Discord-inspired)
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: number
  channelId: string
  type: "message" | "system"
}

interface User {
  id: string
  username: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  lastSeen: number
}

interface Channel {
  id: string
  name: string
  type: "text" | "voice"
}

interface TypingUser {
  userId: string
  username: string
  channelId: string
  timestamp: number
}

interface ChatState {
  // Connection state
  connected: boolean
  connecting: boolean
  sessionId: string | null
  heartbeatInterval: number
  lastHeartbeat: number

  // User data
  currentUser: User | null
  users: Record<string, User>

  // Channel data
  channels: Record<string, Channel>
  activeChannelId: string | null

  // Messages
  messages: Record<string, ChatMessage[]>
  messageHistory: Record<string, boolean> // Track if history is loaded

  // Real-time features
  typingUsers: TypingUser[]

  // UI state
  error: string | null
  reconnectAttempts: number
  maxReconnectAttempts: number
}

const initialState: ChatState = {
  connected: false,
  connecting: false,
  sessionId: null,
  heartbeatInterval: 30000,
  lastHeartbeat: 0,

  currentUser: null,
  users: {},

  channels: {},
  activeChannelId: null,

  messages: {},
  messageHistory: {},

  typingUsers: [],

  error: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
}

// Async thunks for WebSocket operations
export const connectToChat = createAsyncThunk(
  "chat/connect",
  async ({ user, channel }: { user: User; channel: string }, { dispatch, getState }) => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080")

      ws.onopen = () => {
        console.log("WebSocket connected")
        dispatch(chatSlice.actions.setConnecting(false))
        dispatch(chatSlice.actions.setConnected(true))

        // Send identify
        ws.send(
          JSON.stringify({
            op: 2, // Identify
            d: { user, channel },
          }),
        )
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          dispatch(handleWebSocketMessage(message))
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onclose = () => {
        console.log("WebSocket disconnected")
        dispatch(chatSlice.actions.setConnected(false))
        dispatch(chatSlice.actions.handleDisconnection())
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        dispatch(chatSlice.actions.setError("Connection failed"))
        reject(error)
      }

      // Store WebSocket instance globally for sending messages
      ;(window as any).chatWebSocket = ws

      resolve(ws)
    })
  },
)

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ content, channelId }: { content: string; channelId: string }) => {
    const ws = (window as any).chatWebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          op: 0, // Dispatch
          t: "MESSAGE_CREATE",
          d: { content },
        }),
      )
    }
  },
)

export const joinChannel = createAsyncThunk("chat/joinChannel", async (channelId: string) => {
  const ws = (window as any).chatWebSocket
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        op: 0,
        t: "CHANNEL_JOIN",
        d: { channel_id: channelId },
      }),
    )
  }
})

export const startTyping = createAsyncThunk("chat/startTyping", async (channelId: string) => {
  const ws = (window as any).chatWebSocket
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        op: 0,
        t: "TYPING_START",
        d: { channel_id: channelId },
      }),
    )
  }
})

const handleWebSocketMessage = createAsyncThunk("chat/handleMessage", async (message: any, { dispatch }) => {
  const { op, t, d } = message

  switch (op) {
    case 10: // Hello
      dispatch(chatSlice.actions.setHeartbeatInterval(d.heartbeat_interval))
      dispatch(startHeartbeat())
      break

    case 11: // Heartbeat ACK
      dispatch(chatSlice.actions.updateLastHeartbeat(Date.now()))
      break

    case 0: // Dispatch
      switch (t) {
        case "READY":
          dispatch(chatSlice.actions.handleReady(d))
          break
        case "MESSAGE_CREATE":
          dispatch(chatSlice.actions.addMessage(d))
          break
        case "MESSAGE_HISTORY":
          dispatch(chatSlice.actions.setMessageHistory(d))
          break
        case "PRESENCE_UPDATE":
          dispatch(chatSlice.actions.updatePresence(d))
          break
        case "TYPING_START":
          dispatch(chatSlice.actions.addTypingUser(d))
          break
        case "ERROR":
          dispatch(chatSlice.actions.setError(d.message))
          break
      }
      break
  }
})

const startHeartbeat = createAsyncThunk("chat/startHeartbeat", async (_, { getState, dispatch }) => {
  const state = getState() as { chat: ChatState }
  const { heartbeatInterval } = state.chat

  const heartbeatTimer = setInterval(() => {
    const ws = (window as any).chatWebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ op: 1 })) // Heartbeat
    } else {
      clearInterval(heartbeatTimer)
    }
  }, heartbeatInterval)

  // Store timer for cleanup
  ;(window as any).heartbeatTimer = heartbeatTimer
})

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.connecting = action.payload
    },

    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
      if (action.payload) {
        state.reconnectAttempts = 0
        state.error = null
      }
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },

    setHeartbeatInterval: (state, action: PayloadAction<number>) => {
      state.heartbeatInterval = action.payload
    },

    updateLastHeartbeat: (state, action: PayloadAction<number>) => {
      state.lastHeartbeat = action.payload
    },

    handleReady: (state, action: PayloadAction<any>) => {
      const { user, channels, session_id } = action.payload

      state.currentUser = user
      state.sessionId = session_id

      // Set up channels
      channels.forEach((channel: Channel) => {
        state.channels[channel.id] = channel
        if (!state.messages[channel.id]) {
          state.messages[channel.id] = []
        }
      })

      // Set active channel if not set
      if (!state.activeChannelId && channels.length > 0) {
        state.activeChannelId = channels[0].id
      }
    },

    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload

      if (!state.messages[message.channelId]) {
        state.messages[message.channelId] = []
      }

      // Prevent duplicates
      const exists = state.messages[message.channelId].some((m) => m.id === message.id)
      if (!exists) {
        state.messages[message.channelId].push(message)

        // Keep only last 500 messages per channel
        if (state.messages[message.channelId].length > 500) {
          state.messages[message.channelId] = state.messages[message.channelId].slice(-500)
        }
      }

      // Remove typing indicator for this user
      state.typingUsers = state.typingUsers.filter(
        (tu) => tu.userId !== message.userId || tu.channelId !== message.channelId,
      )
    },

    setMessageHistory: (state, action: PayloadAction<{ channel_id: string; messages: ChatMessage[] }>) => {
      const { channel_id, messages } = action.payload

      state.messages[channel_id] = messages
      state.messageHistory[channel_id] = true
    },

    updatePresence: (state, action: PayloadAction<{ channel_id: string; users: User[] }>) => {
      const { users } = action.payload

      // Update users
      users.forEach((user) => {
        state.users[user.id] = user
      })
    },

    addTypingUser: (state, action: PayloadAction<TypingUser>) => {
      const typingUser = action.payload

      // Remove existing typing indicator for this user in this channel
      state.typingUsers = state.typingUsers.filter(
        (tu) => tu.userId !== typingUser.userId || tu.channelId !== typingUser.channelId,
      )

      // Add new typing indicator
      state.typingUsers.push(typingUser)
    },

    removeTypingUser: (state, action: PayloadAction<{ userId: string; channelId: string }>) => {
      const { userId, channelId } = action.payload
      state.typingUsers = state.typingUsers.filter((tu) => tu.userId !== userId || tu.channelId !== channelId)
    },

    setActiveChannel: (state, action: PayloadAction<string>) => {
      state.activeChannelId = action.payload
    },

    handleDisconnection: (state) => {
      state.connected = false
      state.sessionId = null

      if (state.reconnectAttempts < state.maxReconnectAttempts) {
        state.reconnectAttempts += 1
      }
    },

    clearTypingUsers: (state) => {
      const now = Date.now()
      // Remove typing indicators older than 10 seconds
      state.typingUsers = state.typingUsers.filter((tu) => now - tu.timestamp < 10000)
    },

    reset: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(connectToChat.pending, (state) => {
        state.connecting = true
        state.error = null
      })
      .addCase(connectToChat.fulfilled, (state) => {
        state.connecting = false
      })
      .addCase(connectToChat.rejected, (state, action) => {
        state.connecting = false
        state.connected = false
        state.error = action.error.message || "Connection failed"
      })
  },
})

export const { setConnecting, setConnected, setError, setActiveChannel, removeTypingUser, clearTypingUsers, reset } =
  chatSlice.actions

export default chatSlice.reducer

// Selectors
export const selectChatState = (state: { chat: ChatState }) => state.chat
export const selectCurrentUser = (state: { chat: ChatState }) => state.chat.currentUser
export const selectActiveChannel = (state: { chat: ChatState }) => {
  const { activeChannelId, channels } = state.chat
  return activeChannelId ? channels[activeChannelId] : null
}
export const selectActiveChannelMessages = (state: { chat: ChatState }) => {
  const { activeChannelId, messages } = state.chat
  return activeChannelId ? messages[activeChannelId] || [] : []
}
export const selectChannelUsers = (state: { chat: ChatState }) => {
  return Object.values(state.chat.users).filter((user) => user.status !== "offline")
}
export const selectTypingUsersInActiveChannel = (state: { chat: ChatState }) => {
  const { activeChannelId, typingUsers, currentUser } = state.chat
  return typingUsers.filter((tu) => tu.channelId === activeChannelId && tu.userId !== currentUser?.id)
}
