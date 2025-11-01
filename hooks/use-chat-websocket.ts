"use client"

import { useEffect, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FilterLevel } from "@/utils/profanity-filter"
import {
  setConnecting,
  setConnected,
  setError,
  setCurrentUser,
  setActiveChannel,
  setMessages,
  addMessage,
  setUsers,
  addTypingUser,
  cleanupTypingUsers,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  setChannels, // Declare setChannels here
  type User,
  type Message,
} from "@/store/chat-slice"
import type { RootState } from "@/store/store"
import {
  setMessages as setReduxMessages,
  setUsers as setReduxUsers,
  setConnectionStatus,
  addTypingUser as addReduxTypingUser,
  type ChatMessage,
  type ChatUser,
} from "@/store/chat-slice"
import { getCurrentUser } from "@/utils/user-utils"
import { filterProfanity } from "@/utils/profanity-filter"

// WebSocket message types (opcodes like Discord)
enum OpCode {
  DISPATCH = 0, // Server -> Client: Events
  IDENTIFY = 1, // Client -> Server: Authentication
  HEARTBEAT = 2, // Client -> Server: Connection alive
  PRESENCE_UPDATE = 3, // Client -> Server: Status update
  MESSAGE_CREATE = 4, // Client -> Server: Send message
  CHANNEL_JOIN = 5, // Client -> Server: Join channel
  TYPING_START = 6, // Client -> Server: User typing
  ERROR = 7, // Server -> Client: Error
  RECONNECT = 8, // Server -> Client: Reconnect request
  CHANNEL_LIST = 9, // Server -> Client: Available channels
  USER_LIST = 10, // Server -> Client: Online users
  MESSAGE_LIST = 11, // Server -> Client: Message history
}

// Use localStorage for persistence since WebSocket server isn't available
const STORAGE_KEYS = {
  MESSAGES: "rogo-chat-messages",
  USERS: "rogo-chat-users",
  TYPING: "rogo-chat-typing",
}

export function useChatWebSocket() {
  const dispatch = useDispatch()
  const wsRef = useRef<WebSocket | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const typingCleanupIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastUpdateRef = useRef<number>(0)

  const {
    connected,
    connecting,
    error,
    currentUser,
    activeChannel,
    channels,
    messages,
    users,
    typingUsers,
    reconnectAttempts,
    maxReconnectAttempts,
  } = useSelector((state: RootState) => state.chat)

  // Generate avatar color based on username
  const getAvatarColor = useCallback((username: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }, [])

  // Load data from localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const messagesData = localStorage.getItem(STORAGE_KEYS.MESSAGES)
      const usersData = localStorage.getItem(STORAGE_KEYS.USERS)
      const typingData = localStorage.getItem(STORAGE_KEYS.TYPING)

      const now = Date.now()

      if (messagesData) {
        const messages: ChatMessage[] = JSON.parse(messagesData)
        const channelMessages = messages.filter((msg) => msg.channel === activeChannel)
        dispatch(setMessages(channelMessages))
      }

      if (usersData) {
        const users: ChatUser[] = JSON.parse(usersData)
        const activeUsers = users.filter(
          (user) => user.channel === activeChannel && now - user.lastSeen < 45000, // 45 seconds timeout
        )
        dispatch(setUsers(activeUsers))
      }

      if (typingData) {
        const typing = JSON.parse(typingData)
        const channelTyping = typing[activeChannel] || []
        const activeTyping = channelTyping.filter(
          (item: any) => now - item.timestamp < 5000, // 5 seconds timeout
        )
        dispatch(addTypingUser(activeTyping.map((item: any) => item.userId)))
      }

      lastUpdateRef.current = now
      dispatch(setConnectionStatus("connected"))
    } catch (error) {
      console.error("Error loading from storage:", error)
      dispatch(setConnectionStatus("disconnected"))
    }
  }, [dispatch, activeChannel])

  // Save data to localStorage
  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))

      // Dispatch custom event for cross-tab communication
      window.dispatchEvent(
        new CustomEvent("chat-update", {
          detail: { key, data, timestamp: Date.now() },
        }),
      )
    } catch (error) {
      console.error("Error saving to storage:", error)
    }
  }, [])

  // Clean up typing indicators
  useEffect(() => {
    typingCleanupIntervalRef.current = setInterval(() => {
      dispatch(cleanupTypingUsers())
    }, 1000)

    return () => {
      if (typingCleanupIntervalRef.current) {
        clearInterval(typingCleanupIntervalRef.current)
      }
    }
  }, [dispatch])

  // Connect to WebSocket server
  const connect = useCallback(
    (user: User, channelId: string) => {
      if (connecting || wsRef.current?.readyState === WebSocket.CONNECTING) {
        return
      }

      dispatch(setConnecting())

      // Get WebSocket URL from environment or default
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://rogo-chat-server.vercel.app"

      try {
        wsRef.current = new WebSocket(wsUrl)

        wsRef.current.onopen = () => {
          console.log("WebSocket connected")
          dispatch(setConnected(true))

          // Identify with the server
          sendMessage({
            op: OpCode.IDENTIFY,
            d: {
              userId: user.id,
              username: user.username,
              avatar: user.avatar,
              channel: channelId,
            },
          })

          // Start heartbeat
          startHeartbeat(user.id)
        }

        wsRef.current.onmessage = (event) => {
          handleWebSocketMessage(event.data)
        }

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error)
          dispatch(setError("Connection error"))
          handleDisconnect()
        }

        wsRef.current.onclose = () => {
          console.log("WebSocket closed")
          handleDisconnect()
        }
      } catch (error) {
        console.error("Failed to connect:", error)
        dispatch(setError("Failed to connect"))
        handleDisconnect()
      }
    },
    [dispatch, connecting],
  )

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(
    (data: string) => {
      try {
        const message = JSON.parse(data)
        const { op, d } = message

        switch (op) {
          case OpCode.DISPATCH:
            handleDispatchEvent(d)
            break
          case OpCode.ERROR:
            dispatch(setError(d.message))
            break
          case OpCode.RECONNECT:
            handleReconnect()
            break
          case OpCode.CHANNEL_LIST:
            dispatch(setChannels(d.channels))
            break
          case OpCode.USER_LIST:
            dispatch(setUsers(d.users))
            break
          case OpCode.MESSAGE_LIST:
            dispatch(setMessages(d.messages))
            break
          default:
            console.warn("Unknown opcode:", op)
        }
      } catch (error) {
        console.error("Failed to parse message:", error)
      }
    },
    [dispatch],
  )

  // Handle dispatch events
  const handleDispatchEvent = useCallback(
    (data: any) => {
      const { event, data: eventData } = data

      switch (event) {
        case "READY":
          dispatch(setCurrentUser(eventData.user))
          dispatch(setChannels(eventData.channels))
          dispatch(
            setActiveChannel({
              id: eventData.user.channel,
              name: eventData.user.channel,
              type: "text",
            }),
          )
          break
        case "MESSAGE_CREATE":
          dispatch(addMessage(eventData))
          break
        case "TYPING_START":
          dispatch(
            addTypingUser({
              userId: eventData.userId,
              username: eventData.username,
              channel: eventData.channel,
              timestamp: Date.now(),
            }),
          )
          break
        default:
          console.warn("Unknown event:", event)
      }
    },
    [dispatch],
  )

  // Start heartbeat interval
  const startHeartbeat = useCallback((userId: string) => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({
          op: OpCode.HEARTBEAT,
          d: { userId },
        })
      }
    }, 15000) // 15 seconds
  }, [])

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    dispatch(setConnected(false))

    // Clean up
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    // Attempt to reconnect
    if (reconnectAttempts < maxReconnectAttempts) {
      dispatch(incrementReconnectAttempts())

      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
      console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`)

      reconnectTimeoutRef.current = setTimeout(() => {
        if (currentUser && activeChannel) {
          connect(currentUser, activeChannel.id)
        }
      }, delay)
    } else {
      dispatch(setError("Maximum reconnection attempts reached. Please refresh the page."))
    }
  }, [dispatch, reconnectAttempts, maxReconnectAttempts, currentUser, activeChannel, connect])

  // Handle reconnect request
  const handleReconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    if (currentUser && activeChannel) {
      connect(currentUser, activeChannel.id)
    }
  }, [connect, currentUser, activeChannel])

  // Send a message to the server
  const sendMessage = useCallback(
    (contentOrMessage: string | { op: number; d: any }) => {
      if (!currentUser || !activeChannel) return false

      try {
        let message: ChatMessage

        if (typeof contentOrMessage === "string") {
          const content = contentOrMessage.trim()
          if (!content) return false

          message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar,
            content: content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            channel: activeChannel,
          }
        } else {
          // Skip WebSocket message types (they're for server communication)
          return false
        }

        const storageKey = `${STORAGE_KEYS.MESSAGES}-${activeChannel}`
        const existingMessages = JSON.parse(localStorage.getItem(storageKey) || "[]")
        existingMessages.push(message)

        // Keep only last 100 messages per channel
        if (existingMessages.length > 100) {
          existingMessages.splice(0, existingMessages.length - 100)
        }

        localStorage.setItem(storageKey, JSON.stringify(existingMessages))

        dispatch(addMessage(message))

        // Update user activity
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]")
        const userIndex = users.findIndex((u: ChatUser) => u.id === currentUser.id)
        if (userIndex >= 0) {
          users[userIndex].lastSeen = Date.now()
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
        }

        return true
      } catch (error) {
        console.error("Send message error:", error)
        dispatch(setError("Failed to send message"))
        return false
      }
    },
    [currentUser, activeChannel, dispatch],
  )

  const sendChatMessage = useCallback(
    (content: string, filterLevel: FilterLevel = FilterLevel.PG13) => {
      if (!currentUser || !activeChannel) {
        return false
      }

      const filteredContent = filterProfanity(content, filterLevel)
      return sendMessage(filteredContent)
    },
    [currentUser, activeChannel, sendMessage],
  )

  // Change channel
  const changeChannel = useCallback(
    (channelId: string) => {
      if (!currentUser || !connected) {
        return false
      }

      const channel = channels.find((c) => c.id === channelId)
      if (!channel) {
        return false
      }

      dispatch(resetReconnectAttempts())

      // Simulate connection delay
      setTimeout(() => {
        try {
          // Set current user
          dispatch(setCurrentUser({ ...currentUser, channel: channelId, lastSeen: Date.now() }))

          // Set active channel
          dispatch(setActiveChannel(channel))

          // Load messages for channel
          const channelMessages = getStoredMessages(channelId)
          dispatch(setMessages(channelMessages))

          // Update users list
          const onlineUsers = getStoredUsers()
          const channelUsers = onlineUsers.filter((u) => u.channel === channelId && isUserActive(u))
          dispatch(setUsers(channelUsers))

          // Start polling for updates
          startPolling(channelId)

          // Start activity tracking
          startActivityTracking(currentUser.id, channelId)

          console.log(`Changed to channel: ${channelId}`)
        } catch (err) {
          console.error("Failed to change channel:", err)
          return false
        }
      }, 1000)

      return true
    },
    [currentUser, connected, channels, dispatch],
  )

  // Send typing indicator
  const handleTyping = useCallback(() => {
    if (!currentUser || !activeChannel) {
      return
    }

    sendMessage({
      op: OpCode.TYPING_START,
      d: {
        userId: currentUser.id,
        channel: activeChannel.id,
      },
    })
  }, [currentUser, activeChannel, sendMessage])

  // Start polling for real-time updates
  const startPolling = useCallback(
    (channelId: string) => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }

      pollIntervalRef.current = setInterval(() => {
        try {
          // Update messages
          const channelMessages = getStoredMessages(channelId)
          dispatch(setMessages(channelMessages))

          // Update users
          const onlineUsers = getStoredUsers()
          const channelUsers = onlineUsers.filter((u) => u.channel === channelId && isUserActive(u))
          dispatch(setUsers(channelUsers))

          // Update typing users
          const typingData = getStoredTyping(channelId)
          const activeTyping = typingData.filter((t) => Date.now() - t.timestamp < 5000)
          setStoredTyping(channelId, activeTyping)

          // Clean up typing indicators
          dispatch(cleanupTypingUsers())
        } catch (err) {
          console.error("Polling error:", err)
        }
      }, 2000) // Poll every 2 seconds
    },
    [dispatch],
  )

  // Start activity tracking
  const startActivityTracking = useCallback((userId: string, channelId: string) => {
    if (activityIntervalRef.current) {
      clearInterval(activityIntervalRef.current)
    }

    activityIntervalRef.current = setInterval(() => {
      updateUserActivity(userId, channelId)
    }, 10000) // Update every 10 seconds
  }, [])

  // Update user activity
  const updateUserActivity = useCallback((userId: string, channelId: string) => {
    try {
      const onlineUsers = getStoredUsers()
      const userIndex = onlineUsers.findIndex((u) => u.id === userId)
      if (userIndex >= 0) {
        onlineUsers[userIndex].lastSeen = Date.now()
        onlineUsers[userIndex].channel = channelId
        setStoredUsers(onlineUsers)

        // Trigger storage event for other tabs
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: STORAGE_KEYS.USERS,
            newValue: JSON.stringify(onlineUsers),
          }),
        )
      }
    } catch (err) {
      console.error("Failed to update user activity:", err)
    }
  }, [])

  // Listen for storage events (cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!activeChannel) return

      try {
        if (e.key === `${STORAGE_KEYS.MESSAGES}-${activeChannel}` && e.newValue) {
          const messages = JSON.parse(e.newValue)
          dispatch(setReduxMessages(messages))
        } else if (e.key === STORAGE_KEYS.USERS && e.newValue) {
          const allUsers = JSON.parse(e.newValue)
          const channelUsers = allUsers.filter((u: User) => u.channel === activeChannel && isUserActive(u))
          dispatch(setReduxUsers(channelUsers))
        } else if (e.key === `${STORAGE_KEYS.TYPING}-${activeChannel}` && e.newValue) {
          const typingData = JSON.parse(e.newValue)
          const activeTyping = typingData.filter((t: any) => Date.now() - t.timestamp < 5000)
          // Update typing users in state
          activeTyping.forEach((t: any) => {
            if (t.userId !== currentUser?.id) {
              dispatch(addReduxTypingUser(t.userId))
            }
          })
        }
      } catch (err) {
        console.error("Storage event error:", err)
      }
    }

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail.timestamp > lastUpdateRef.current) {
        loadFromStorage()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("chat-update", handleCustomEvent as EventListener)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("chat-update", handleCustomEvent as EventListener)
    }
  }, [activeChannel, currentUser, dispatch, loadFromStorage])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      if (typingCleanupIntervalRef.current) {
        clearInterval(typingCleanupIntervalRef.current)
      }

      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current)
      }

      // Remove user from online list
      if (currentUser) {
        const onlineUsers = getStoredUsers()
        const filteredUsers = onlineUsers.filter((u) => u.id !== currentUser.id)
        setStoredUsers(filteredUsers)
      }
    }
  }, [currentUser])

  // Initial load
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  // Initialize user and start polling
  useEffect(() => {
    const user = getCurrentUser()
    if (user && !currentUser) {
      const chatUser: ChatUser = {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        lastSeen: Date.now(),
        channel: activeChannel,
        status: "online",
      }
      dispatch(setCurrentUser(chatUser))
      dispatch(setConnectionStatus("connecting"))

      // Add user to localStorage
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]")
      const existingUserIndex = users.findIndex((u: ChatUser) => u.id === user.id)
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = chatUser
      } else {
        users.push(chatUser)
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

      dispatch(setConnectionStatus("connected"))
    }
  }, [currentUser, activeChannel, dispatch])

  // Polling for messages and users
  useEffect(() => {
    if (!currentUser) return

    const poll = () => {
      try {
        // Load messages
        const storedMessages = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.MESSAGES}-${activeChannel}`) || "[]")
        dispatch(setMessages(storedMessages))

        // Load and filter users
        const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]")
        const activeUsers = storedUsers.filter((user: ChatUser) => {
          const isActive = Date.now() - user.lastSeen < 30000 // 30 seconds
          return isActive && user.id !== currentUser.id
        })
        dispatch(setUsers(activeUsers))

        // Clean up inactive users
        const cleanedUsers = storedUsers.filter((user: ChatUser) => {
          return Date.now() - user.lastSeen < 30000 || user.id === currentUser.id
        })
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleanedUsers))
      } catch (error) {
        console.error("Polling error:", error)
        dispatch(setError("Failed to sync messages"))
      }
    }

    // Initial poll
    poll()

    // Set up polling interval
    pollIntervalRef.current = setInterval(poll, 2000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [currentUser, activeChannel, dispatch])

  // Activity tracking
  useEffect(() => {
    if (!currentUser) return

    const updateActivity = () => {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]")
      const userIndex = users.findIndex((u: ChatUser) => u.id === currentUser.id)
      if (userIndex >= 0) {
        users[userIndex].lastSeen = Date.now()
        users[userIndex].status = "online"
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      }
    }

    // Update activity every 10 seconds
    activityIntervalRef.current = setInterval(updateActivity, 10000)

    return () => {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current)
      }
    }
  }, [currentUser])

  // Storage event listener for cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${STORAGE_KEYS.MESSAGES}-${activeChannel}`) {
        const newMessages = JSON.parse(e.newValue || "[]")
        dispatch(setMessages(newMessages))
      } else if (e.key === STORAGE_KEYS.USERS) {
        const newUsers = JSON.parse(e.newValue || "[]")
        const activeUsers = newUsers.filter((user: ChatUser) => {
          const isActive = Date.now() - user.lastSeen < 30000
          return isActive && user.id !== currentUser?.id
        })
        dispatch(setUsers(activeUsers))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [activeChannel, currentUser, dispatch])

  return {
    connected,
    connecting,
    error,
    currentUser,
    activeChannel,
    channels,
    messages,
    users: users.filter((u) => u.id !== currentUser?.id), // Don't show current user in list
    typingUsers: typingUsers.filter((u) => u.userId !== currentUser?.id), // Don't show own typing
    reconnectAttempts,
    maxReconnectAttempts,
    connect,
    sendMessage: sendChatMessage,
    changeChannel,
    handleTyping,
    getAvatarColor,
  }
}

// Helper functions for localStorage
function getStoredMessages(channelId: string): Message[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.MESSAGES}-${channelId}`)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredMessages(channelId: string, messages: Message[]) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.MESSAGES}-${channelId}`, JSON.stringify(messages))
  } catch (err) {
    console.error("Failed to store messages:", err)
  }
}

function getStoredUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (err) {
    console.error("Failed to store users:", err)
  }
}

function getStoredTyping(channelId: string): any[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.TYPING}-${channelId}`)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredTyping(channelId: string, typing: any[]) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.TYPING}-${channelId}`, JSON.stringify(typing))
  } catch (err) {
    console.error("Failed to store typing data:", err)
  }
}

function isUserActive(user: User): boolean {
  const now = Date.now()
  const timeout = 60000 // 1 minute
  return now - user.lastSeen < timeout
}
