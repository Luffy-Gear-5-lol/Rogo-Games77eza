"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { filterProfanity, type FilterLevel } from "@/utils/profanity-filter"

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  text: string
  timestamp: string
  channel: string
  serverTimestamp: number
}

interface OnlineUser {
  id: string
  username: string
  avatar: string
  lastSeen: number
  channel: string
  connectionId: string
}

interface User {
  id: string
  username: string
  avatar: string
}

export function useChat(user: User | null, channel: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [isLoading, setIsLoading] = useState(false)

  const eventSourceRef = useRef<EventSource | null>(null)
  const connectionIdRef = useRef<string>("")
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Load messages
      const messagesResponse = await fetch(`/api/chat/messages?channel=${channel}`)
      if (messagesResponse.ok) {
        const { messages: initialMessages } = await messagesResponse.json()
        setMessages(initialMessages || [])
      }

      // Load users
      const usersResponse = await fetch(`/api/chat/users?channel=${channel}`)
      if (usersResponse.ok) {
        const { users: initialUsers } = await usersResponse.json()
        setOnlineUsers(initialUsers || [])
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user, channel])

  // Connect to SSE
  const connectToEvents = useCallback(() => {
    if (!user) return

    const connectionId = `conn_${Date.now()}_${user.id}_${Math.random().toString(36).substr(2, 9)}`
    connectionIdRef.current = connectionId

    console.log("Connecting to SSE with ID:", connectionId)
    setConnectionStatus("connecting")

    const eventSource = new EventSource(`/api/chat/events?connectionId=${connectionId}`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log("SSE connection opened")
      setConnectionStatus("connected")

      // Register user
      fetch("/api/chat/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          channel,
          connectionId,
        }),
      }).catch((error) => console.error("Error registering user:", error))
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("SSE message received:", data)

        switch (data.type) {
          case "connected":
            console.log("Connected with ID:", data.connectionId)
            break

          case "message":
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some((msg) => msg.id === data.data.id)) {
                return prev
              }
              return [...prev, data.data].sort((a, b) => a.serverTimestamp - b.serverTimestamp)
            })
            break

          case "users":
            setOnlineUsers(data.data || [])
            break

          case "heartbeat":
            // Connection is alive
            break

          default:
            console.log("Unknown SSE message type:", data.type)
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      setConnectionStatus("disconnected")

      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log("Attempting to reconnect...")
          connectToEvents()
        }
      }, 3000)
    }

    return eventSource
  }, [user, channel])

  // Send message
  const sendMessage = useCallback(
    async (text: string, filterLevel: FilterLevel) => {
      if (!user || !text.trim()) return false

      try {
        const filteredText = filterProfanity(text.trim(), filterLevel)

        const response = await fetch("/api/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            text: filteredText,
            channel,
          }),
        })

        if (response.ok) {
          console.log("Message sent successfully")
          return true
        } else {
          console.error("Failed to send message:", response.statusText)
          return false
        }
      } catch (error) {
        console.error("Error sending message:", error)
        return false
      }
    },
    [user, channel],
  )

  // Update user activity
  const updateActivity = useCallback(async () => {
    if (!user) return

    try {
      await fetch("/api/chat/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          channel,
          connectionId: connectionIdRef.current,
        }),
      })
    } catch (error) {
      console.error("Error updating activity:", error)
    }
  }, [user, channel])

  // Initialize connection
  useEffect(() => {
    if (!user) return

    loadInitialData()
    const eventSource = connectToEvents()

    // Set up activity updates every 30 seconds
    activityIntervalRef.current = setInterval(updateActivity, 30000)

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current)
      }

      // Remove user on cleanup
      if (user) {
        fetch("/api/chat/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }).catch((error) => console.error("Error removing user:", error))
      }
    }
  }, [user, channel, loadInitialData, connectToEvents, updateActivity])

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        updateActivity()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [user, updateActivity])

  return {
    messages,
    onlineUsers,
    connectionStatus,
    isLoading,
    sendMessage,
    updateActivity,
  }
}
