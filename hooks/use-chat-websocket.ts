"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  setCurrentUser,
  setConnectionStatus,
  setMessages,
  addMessage,
  setUsers,
  addTypingUser,
  removeTypingUser,
  cleanupTypingUsers,
  type ChatMessage,
  type ChatUser,
} from "@/store/chat-slice"
import { getCurrentUser } from "@/utils/user-utils"
import { filterProfanity, FilterLevel } from "@/utils/profanity-filter"

const STORAGE_KEYS = {
  MESSAGES: "rogo-chat-messages",
  USERS: "rogo-chat-users",
  TYPING: "rogo-chat-typing",
}

export function useChatWebSocket() {
  const dispatch = useDispatch()
  const { messages, users, currentUser, currentChannel, connectionStatus, typingUsers } = useSelector(
    (state: RootState) => state.chat,
  )

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typingCleanupIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const getAvatarColor = useCallback((username: string) => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }, [])

  const loadMessages = useCallback((channel: string) => {
    try {
      const key = `${STORAGE_KEYS.MESSAGES}-${channel}`
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading messages:", error)
      return []
    }
  }, [])

  const saveMessages = useCallback((channel: string, msgs: ChatMessage[]) => {
    try {
      const key = `${STORAGE_KEYS.MESSAGES}-${channel}`
      localStorage.setItem(key, JSON.stringify(msgs))
    } catch (error) {
      console.error("Error saving messages:", error)
    }
  }, [])

  const loadUsers = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS)
      if (!stored) return []
      const users = JSON.parse(stored)
      const now = Date.now()
      // Filter out inactive users (timeout after 60 seconds)
      return users.filter((u: ChatUser) => now - u.lastSeen < 60000)
    } catch (error) {
      console.error("Error loading users:", error)
      return []
    }
  }, [])

  const saveUsers = useCallback((users: ChatUser[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
    }
  }, [])

  const sendMessage = useCallback(
    (content: string, filterLevel: FilterLevel = FilterLevel.PG13) => {
      if (!currentUser || !content.trim()) return false

      try {
        const filteredContent = filterProfanity(content.trim(), filterLevel)

        const message: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          content: filteredContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          channel: currentChannel,
        }

        // Add to localStorage
        const msgs = loadMessages(currentChannel)
        msgs.push(message)
        saveMessages(currentChannel, msgs)

        // Update Redux state
        dispatch(addMessage(message))

        // Update user activity
        if (currentUser) {
          const allUsers = loadUsers()
          const userIdx = allUsers.findIndex((u) => u.id === currentUser.id)
          if (userIdx >= 0) {
            allUsers[userIdx].lastSeen = Date.now()
          }
          saveUsers(allUsers)
        }

        return true
      } catch (error) {
        console.error("Error sending message:", error)
        return false
      }
    },
    [currentUser, currentChannel, dispatch, loadMessages, saveMessages, loadUsers, saveUsers],
  )

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!currentUser) return

      if (isTyping) {
        dispatch(addTypingUser(currentUser.id))
      } else {
        dispatch(removeTypingUser(currentUser.id))
      }
    },
    [currentUser, dispatch],
  )

  useEffect(() => {
    const user = getCurrentUser()
    if (user && !currentUser) {
      const chatUser: ChatUser = {
        id: user.id,
        username: user.username,
        avatar: user.avatar || getAvatarColor(user.username),
        lastSeen: Date.now(),
        channel: currentChannel,
        status: "online",
      }

      // Add to users list
      const allUsers = loadUsers()
      const existingIdx = allUsers.findIndex((u) => u.id === user.id)
      if (existingIdx >= 0) {
        allUsers[existingIdx] = chatUser
      } else {
        allUsers.push(chatUser)
      }
      saveUsers(allUsers)

      dispatch(setCurrentUser(chatUser))
      dispatch(setConnectionStatus("connected"))
    }

    setIsMounted(true)
  }, [currentUser, currentChannel, dispatch, getAvatarColor, loadUsers, saveUsers])

  useEffect(() => {
    if (!currentUser || !isMounted) return

    const poll = () => {
      try {
        // Load messages for current channel
        const msgs = loadMessages(currentChannel)
        dispatch(setMessages(msgs))

        // Load and filter users
        const allUsers = loadUsers()
        const channelUsers = allUsers.filter((u) => u.channel === currentChannel && u.id !== currentUser.id)
        dispatch(setUsers(channelUsers))
      } catch (error) {
        console.error("Polling error:", error)
      }
    }

    poll() // Initial poll
    pollIntervalRef.current = setInterval(poll, 1000) // Poll every second

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [currentUser, currentChannel, dispatch, isMounted, loadMessages, loadUsers])

  useEffect(() => {
    if (!currentUser || !isMounted) return

    const updateActivity = () => {
      const allUsers = loadUsers()
      const userIdx = allUsers.findIndex((u) => u.id === currentUser.id)
      if (userIdx >= 0) {
        allUsers[userIdx].lastSeen = Date.now()
        allUsers[userIdx].status = "online"
        saveUsers(allUsers)
      }
    }

    activityIntervalRef.current = setInterval(updateActivity, 5000) // Update every 5 seconds

    return () => {
      if (activityIntervalRef.current) clearInterval(activityIntervalRef.current)
    }
  }, [currentUser, isMounted, loadUsers, saveUsers])

  useEffect(() => {
    typingCleanupIntervalRef.current = setInterval(() => {
      dispatch(cleanupTypingUsers())
    }, 1000)

    return () => {
      if (typingCleanupIntervalRef.current) clearInterval(typingCleanupIntervalRef.current)
    }
  }, [dispatch])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!isMounted) return

      try {
        if (e.key === `${STORAGE_KEYS.MESSAGES}-${currentChannel}` && e.newValue) {
          const msgs = JSON.parse(e.newValue)
          dispatch(setMessages(msgs))
        } else if (e.key === STORAGE_KEYS.USERS && e.newValue) {
          const allUsers = JSON.parse(e.newValue)
          const channelUsers = allUsers.filter(
            (u: ChatUser) => u.channel === currentChannel && u.id !== currentUser?.id,
          )
          dispatch(setUsers(channelUsers))
        }
      } catch (error) {
        console.error("Storage event error:", error)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [currentChannel, currentUser, dispatch, isMounted])

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      if (activityIntervalRef.current) clearInterval(activityIntervalRef.current)
      if (typingCleanupIntervalRef.current) clearInterval(typingCleanupIntervalRef.current)

      // Remove user from list on unmount
      if (currentUser) {
        const allUsers = loadUsers()
        const filtered = allUsers.filter((u) => u.id !== currentUser.id)
        saveUsers(filtered)
      }
    }
  }, [currentUser, loadUsers, saveUsers])

  return {
    messages: messages.filter((m) => m.channel === currentChannel),
    users: users.filter((u) => u.id !== currentUser?.id),
    currentUser,
    currentChannel,
    connectionStatus,
    typingUsers: typingUsers.filter((id) => id !== currentUser?.id),
    sendMessage,
    setTyping,
    getAvatarColor,
  }
}
