"use client"

// Custom hook for WebSocket chat functionality
import { useEffect, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
  connectToChat,
  sendMessage,
  joinChannel,
  startTyping,
  setActiveChannel,
  removeTypingUser,
  clearTypingUsers,
  selectChatState,
  selectCurrentUser,
  selectActiveChannel,
  selectActiveChannelMessages,
  selectChannelUsers,
  selectTypingUsersInActiveChannel,
} from "@/store/chat-slice"

interface User {
  id: string
  username: string
  avatar: string
}

export function useChatWebSocket() {
  const dispatch = useDispatch<AppDispatch>()
  const chatState = useSelector((state: RootState) => selectChatState(state))
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state))
  const activeChannel = useSelector((state: RootState) => selectActiveChannel(state))
  const messages = useSelector((state: RootState) => selectActiveChannelMessages(state))
  const users = useSelector((state: RootState) => selectChannelUsers(state))
  const typingUsers = useSelector((state: RootState) => selectTypingUsersInActiveChannel(state))

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  // Connect to chat
  const connect = useCallback(
    async (user: User, channelId: string) => {
      try {
        await dispatch(connectToChat({ user, channel: channelId })).unwrap()
        dispatch(setActiveChannel(channelId))
      } catch (error) {
        console.error("Failed to connect to chat:", error)
      }
    },
    [dispatch],
  )

  // Send a message
  const sendChatMessage = useCallback(
    async (content: string) => {
      if (!activeChannel || !content.trim()) return false

      try {
        await dispatch(sendMessage({ content, channelId: activeChannel.id })).unwrap()

        // Stop typing indicator
        if (isTypingRef.current && currentUser) {
          dispatch(removeTypingUser({ userId: currentUser.id, channelId: activeChannel.id }))
          isTypingRef.current = false
        }

        return true
      } catch (error) {
        console.error("Failed to send message:", error)
        return false
      }
    },
    [dispatch, activeChannel, currentUser],
  )

  // Change channel
  const changeChannel = useCallback(
    async (channelId: string) => {
      if (channelId === activeChannel?.id) return

      try {
        await dispatch(joinChannel(channelId)).unwrap()
        dispatch(setActiveChannel(channelId))
      } catch (error) {
        console.error("Failed to change channel:", error)
      }
    },
    [dispatch, activeChannel],
  )

  // Handle typing
  const handleTyping = useCallback(() => {
    if (!activeChannel || !currentUser) return

    if (!isTypingRef.current) {
      dispatch(startTyping(activeChannel.id))
      isTypingRef.current = true
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (currentUser) {
        dispatch(removeTypingUser({ userId: currentUser.id, channelId: activeChannel.id }))
        isTypingRef.current = false
      }
    }, 3000)
  }, [dispatch, activeChannel, currentUser])

  // Auto-reconnect logic
  useEffect(() => {
    if (!chatState.connected && !chatState.connecting && currentUser && activeChannel) {
      const shouldReconnect = chatState.reconnectAttempts < chatState.maxReconnectAttempts

      if (shouldReconnect) {
        const delay = Math.min(1000 * Math.pow(2, chatState.reconnectAttempts), 30000)

        setTimeout(() => {
          console.log(`Attempting to reconnect (attempt ${chatState.reconnectAttempts + 1})`)
          connect(currentUser, activeChannel.id)
        }, delay)
      }
    }
  }, [chatState.connected, chatState.connecting, chatState.reconnectAttempts, currentUser, activeChannel, connect])

  // Clean up typing indicators periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(clearTypingUsers())
    }, 5000)

    return () => clearInterval(interval)
  }, [dispatch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Close WebSocket connection
      const ws = (window as any).chatWebSocket
      if (ws) {
        ws.close()
      }

      // Clear heartbeat timer
      const timer = (window as any).heartbeatTimer
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [])

  return {
    // State
    connected: chatState.connected,
    connecting: chatState.connecting,
    error: chatState.error,
    currentUser,
    activeChannel,
    messages,
    users,
    typingUsers,
    channels: Object.values(chatState.channels),

    // Actions
    connect,
    sendMessage: sendChatMessage,
    changeChannel,
    handleTyping,

    // Stats
    reconnectAttempts: chatState.reconnectAttempts,
    maxReconnectAttempts: chatState.maxReconnectAttempts,
  }
}
