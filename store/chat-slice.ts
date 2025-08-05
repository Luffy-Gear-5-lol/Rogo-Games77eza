import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  username: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  channel: string
  lastSeen: number
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

export interface Channel {
  id: string
  name: string
  type: "text" | "voice"
}

export interface TypingUser {
  userId: string
  username: string
  channel: string
  timestamp: number
}

interface ChatState {
  connected: boolean
  connecting: boolean
  error: string | null
  currentUser: User | null
  activeChannel: Channel | null
  channels: Channel[]
  messages: Message[]
  users: User[]
  typingUsers: TypingUser[]
  reconnectAttempts: number
  maxReconnectAttempts: number
}

const initialState: ChatState = {
  connected: false,
  connecting: false,
  error: null,
  currentUser: null,
  activeChannel: null,
  channels: [
    { id: "general", name: "general", type: "text" },
    { id: "gaming", name: "gaming", type: "text" },
    { id: "memes", name: "memes", type: "text" },
    { id: "after-dark", name: "after-dark", type: "text" },
    { id: "nsfw-chat", name: "nsfw-chat", type: "text" },
  ],
  messages: [],
  users: [],
  typingUsers: [],
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.connecting = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
      state.connecting = false
      if (action.payload) {
        state.reconnectAttempts = 0
        state.error = null
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.connecting = false
      state.connected = false
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    setActiveChannel: (state, action: PayloadAction<Channel>) => {
      state.activeChannel = action.payload
    },
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // Only add if not already in the list and is for current channel
      const exists = state.messages.some((m) => m.id === action.payload.id)
      if (!exists && action.payload.channel === state.activeChannel?.id) {
        state.messages.push(action.payload)

        // Keep only last 100 messages
        if (state.messages.length > 100) {
          state.messages = state.messages.slice(-100)
        }
      }
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
    addUser: (state, action: PayloadAction<User>) => {
      const existingIndex = state.users.findIndex((u) => u.id === action.payload.id)
      if (existingIndex >= 0) {
        state.users[existingIndex] = action.payload
      } else {
        state.users.push(action.payload)
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
    addTypingUser: (state, action: PayloadAction<TypingUser>) => {
      // Remove existing typing indicator for this user
      state.typingUsers = state.typingUsers.filter((u) => u.userId !== action.payload.userId)

      // Add new typing indicator
      state.typingUsers.push(action.payload)
    },
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter((u) => u.userId !== action.payload)
    },
    clearTypingUsers: (state) => {
      state.typingUsers = []
    },
    cleanupTypingUsers: (state) => {
      const now = Date.now()
      state.typingUsers = state.typingUsers.filter((u) => now - u.timestamp < 5000)
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0
    },
    resetChat: (state) => {
      return {
        ...initialState,
        channels: state.channels,
        reconnectAttempts: state.reconnectAttempts,
      }
    },
  },
})

export const {
  setConnecting,
  setConnected,
  setError,
  setCurrentUser,
  setActiveChannel,
  setChannels,
  setMessages,
  addMessage,
  setUsers,
  addUser,
  removeUser,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  cleanupTypingUsers,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  resetChat,
} = chatSlice.actions

export default chatSlice.reducer
