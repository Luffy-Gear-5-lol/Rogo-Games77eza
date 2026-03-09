import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: string
  channel: string
}

export interface ChatUser {
  id: string
  username: string
  avatar: string
  lastSeen: number
  channel: string
  status: "online" | "away" | "busy" | "offline"
}

export interface Channel {
  id: string
  name: string
  type: "text" | "voice"
}

export interface User {
  id: string
  username: string
  avatar: string
  channel?: string
  lastSeen?: number
}

export interface Message {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: string
  channel: string
}

export interface TypingUser {
  userId: string
  username: string
  channel: string
  timestamp: number
}

interface ChatState {
  messages: ChatMessage[]
  users: ChatUser[]
  currentUser: ChatUser | null
  currentChannel: string
  activeChannel: Channel | null
  channels: Channel[]
  connectionStatus: "connected" | "connecting" | "disconnected"
  connected: boolean
  connecting: boolean
  typingUsers: string[]
  typingUsersData: TypingUser[]
  error: string | null
  reconnectAttempts: number
  maxReconnectAttempts: number
}

const initialState: ChatState = {
  messages: [],
  users: [],
  currentUser: null,
  currentChannel: "general",
  activeChannel: { id: "general", name: "General", type: "text" },
  channels: [
    { id: "general", name: "General", type: "text" },
    { id: "pg13", name: "PG-13", type: "text" },
    { id: "r-rated", name: "R-Rated", type: "text" },
  ],
  connectionStatus: "disconnected",
  connected: false,
  connecting: false,
  typingUsers: [],
  typingUsersData: [],
  error: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<ChatUser | null>) => {
      state.currentUser = action.payload
    },
    setCurrentChannel: (state, action: PayloadAction<string>) => {
      state.currentChannel = action.payload
    },
    setActiveChannel: (state, action: PayloadAction<Channel>) => {
      state.activeChannel = action.payload
      state.currentChannel = action.payload.id
    },
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload
    },
    setConnectionStatus: (state, action: PayloadAction<"connected" | "connecting" | "disconnected">) => {
      state.connectionStatus = action.payload
      state.connected = action.payload === "connected"
      state.connecting = action.payload === "connecting"
    },
    setConnecting: (state) => {
      state.connecting = true
      state.connected = false
      state.connectionStatus = "connecting"
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
      state.connecting = false
      state.connectionStatus = action.payload ? "connected" : "disconnected"
      if (action.payload) {
        state.reconnectAttempts = 0
      }
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
      // Keep only last 100 messages
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100)
      }
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload
    },
    addUser: (state, action: PayloadAction<ChatUser>) => {
      const existingUser = state.users.find((user) => user.id === action.payload.id)
      if (!existingUser) {
        state.users.push(action.payload)
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },
    setUsers: (state, action: PayloadAction<ChatUser[]>) => {
      state.users = action.payload
    },
    updateUserActivity: (state, action: PayloadAction<string>) => {
      const user = state.users.find((user) => user.id === action.payload)
      if (user) {
        user.lastSeen = Date.now()
        user.status = "online"
      }
    },
    setTypingUsers: (state, action: PayloadAction<string[]>) => {
      state.typingUsers = action.payload
    },
    addTypingUser: (state, action: PayloadAction<string | TypingUser>) => {
      if (typeof action.payload === "string") {
        if (!state.typingUsers.includes(action.payload)) {
          state.typingUsers.push(action.payload)
        }
      } else {
        const typingUser = action.payload
        if (!state.typingUsers.includes(typingUser.userId)) {
          state.typingUsers.push(typingUser.userId)
        }
        const existingIndex = state.typingUsersData.findIndex(t => t.userId === typingUser.userId)
        if (existingIndex >= 0) {
          state.typingUsersData[existingIndex] = typingUser
        } else {
          state.typingUsersData.push(typingUser)
        }
      }
    },
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter((userId) => userId !== action.payload)
      state.typingUsersData = state.typingUsersData.filter((t) => t.userId !== action.payload)
    },
    cleanupTypingUsers: (state) => {
      const now = Date.now()
      state.typingUsersData = state.typingUsersData.filter((t) => now - t.timestamp < 5000)
      state.typingUsers = state.typingUsersData.map((t) => t.userId)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0
    },
  },
})

export const {
  setCurrentUser,
  setCurrentChannel,
  setActiveChannel,
  setChannels,
  setConnectionStatus,
  setConnecting,
  setConnected,
  addMessage,
  setMessages,
  addUser,
  removeUser,
  setUsers,
  updateUserActivity,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  cleanupTypingUsers,
  setError,
  clearMessages,
  incrementReconnectAttempts,
  resetReconnectAttempts,
} = chatSlice.actions

export default chatSlice.reducer
