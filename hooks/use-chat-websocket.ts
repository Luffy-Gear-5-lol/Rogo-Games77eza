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
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    }
    return false
  }, [])

  // Send a chat message
  const sendChatMessage = useCallback(
    (content: string, filterLevel: FilterLevel = FilterLevel.PG13) => {
      if (!currentUser || !activeChannel) {
        return false
      }

      return sendMessage({
        op: OpCode.MESSAGE_CREATE,
        d: {
          userId: currentUser.id,
          content,
          channel: activeChannel.id,
          filterLevel,
        },
      })
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
        if (e.key === `${STORAGE_KEYS.MESSAGES}-${activeChannel.id}` && e.newValue) {
          const messages = JSON.parse(e.newValue)
          dispatch(setMessages(messages))
        } else if (e.key === STORAGE_KEYS.USERS && e.newValue) {
          const allUsers = JSON.parse(e.newValue)
          const channelUsers = allUsers.filter((u: User) => u.channel === activeChannel.id && isUserActive(u))
          dispatch(setUsers(channelUsers))
        } else if (e.key === `${STORAGE_KEYS.TYPING}-${activeChannel.id}` && e.newValue) {
          const typingData = JSON.parse(e.newValue)
          const activeTyping = typingData.filter((t: any) => Date.now() - t.timestamp < 5000)
          // Update typing users in state
          activeTyping.forEach((t: any) => {
            if (t.userId !== currentUser?.id) {
              dispatch(addTypingUser(t))
            }
          })
        }
      } catch (err) {
        console.error("Storage event error:", err)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [activeChannel, currentUser, dispatch])

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
