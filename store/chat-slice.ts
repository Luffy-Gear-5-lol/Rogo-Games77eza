import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  username: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  channel: string
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
  channels: [],
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
    setConnecting: (state) => {
      state.connecting = true
      state.error = null
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
      state.connecting = false
      if (action.payload) {
        state.reconnectAttempts = 0
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.connecting = false
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
      // Only add if not already in the list
      if (!state.messages.some((m) => m.id === action.payload.id)) {
        state.messages.push(action.payload)
      }
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
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
      state.typingUsers = state.typingUsers.filter((u) => now - u.timestamp < 3000)
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1
    },
    resetChat: (state) => {
      return {
        ...initialState,
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
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  cleanupTypingUsers,
  incrementReconnectAttempts,
  resetChat,
} = chatSlice.actions

export default chatSlice.reducer
