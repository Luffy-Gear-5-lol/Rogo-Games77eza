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

interface ChatState {
  messages: ChatMessage[]
  users: ChatUser[]
  currentUser: ChatUser | null
  currentChannel: string
  connectionStatus: "connected" | "connecting" | "disconnected"
  typingUsers: string[]
  error: string | null
}

const initialState: ChatState = {
  messages: [],
  users: [],
  currentUser: null,
  currentChannel: "general",
  connectionStatus: "disconnected",
  typingUsers: [],
  error: null,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<ChatUser>) => {
      state.currentUser = action.payload
    },
    setCurrentChannel: (state, action: PayloadAction<string>) => {
      state.currentChannel = action.payload
    },
    setConnectionStatus: (state, action: PayloadAction<"connected" | "connecting" | "disconnected">) => {
      state.connectionStatus = action.payload
    },
    setConnecting: (state) => {
      state.connectionStatus = "connecting"
    },
    setConnected: (state) => {
      state.connectionStatus = "connected"
    },
    setActiveChannel: (state, action: PayloadAction<string>) => {
      state.currentChannel = action.payload
    },
    cleanupTypingUsers: (state) => {
      state.typingUsers = []
    },
    incrementReconnectAttempts: (state) => {
      // Placeholder for reconnect tracking
    },
    resetReconnectAttempts: (state) => {
      // Placeholder for reconnect tracking
    },
    setChannels: (state, action: PayloadAction<string[]>) => {
      // Placeholder for channel list management
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
    addTypingUser: (state, action: PayloadAction<string>) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload)
      }
    },
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter((userId) => userId !== action.payload)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
  },
})

export const {
  setCurrentUser,
  setCurrentChannel,
  setConnectionStatus,
  setConnecting,
  setConnected,
  setActiveChannel,
  cleanupTypingUsers,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  setChannels,
  addMessage,
  setMessages,
  addUser,
  removeUser,
  setUsers,
  updateUserActivity,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  setError,
  clearMessages,
} = chatSlice.actions

export default chatSlice.reducer
