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
  setChannels,
  setMessages,
  addMessage,
  setUsers,
  addTypingUser,
  cleanupTypingUsers,
  incrementReconnectAttempts,
  resetChat,
  type User,
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

export function useChatWebSocket() {
  const dispatch = useDispatch()
  const wsRef = useRef<WebSocket | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const typingCleanupIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

      dispatch(resetChat())

      sendMessage({
        op: OpCode.CHANNEL_JOIN,
        d: {
          userId: currentUser.id,
          channel: channelId,
        },
      })

      dispatch(
        setActiveChannel({
          id: channelId,
          name: channelId,
          type: "text",
        }),
      )

      return true
    },
    [currentUser, connected, channels, dispatch, sendMessage],
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

  // Clean up on unmount
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
    }
  }, [])

  return {
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
    connect,
    sendMessage: sendChatMessage,
    changeChannel,
    handleTyping,
  }
}
