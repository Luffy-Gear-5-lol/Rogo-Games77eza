"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { filterProfanity, FilterLevel } from "@/utils/profanity-filter"
import { Send, Hash, Settings, Users, Bell, PlusCircle, Smile, Paperclip, LogOut, RefreshCw } from "lucide-react"
import { getCurrentUser, type User } from "@/utils/user-utils"
import {
  getMessages,
  saveMessage,
  type ChatMessage,
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  updateUserActivity,
  type OnlineUser,
  subscribeToChatEvents,
  forceRefreshChatData,
} from "@/utils/chat-storage"
import UserSetup from "@/components/user-setup"

interface Channel {
  id: string
  name: string
  filterLevel: FilterLevel
  description: string
}

export default function ChatPage() {
  const channels: Channel[] = [
    {
      id: "general",
      name: "general",
      filterLevel: FilterLevel.PG13,
      description: "General discussion - No slurs, profanity allowed",
    },
    {
      id: "gaming",
      name: "gaming",
      filterLevel: FilterLevel.PG13,
      description: "Game discussion - No slurs, profanity allowed",
    },
    {
      id: "memes",
      name: "memes",
      filterLevel: FilterLevel.PG13,
      description: "Share memes - No slurs, profanity allowed",
    },
    {
      id: "after-dark",
      name: "after-dark",
      filterLevel: FilterLevel.R,
      description: "Mature content allowed - No filtering",
    },
    {
      id: "nsfw-chat",
      name: "nsfw-chat",
      filterLevel: FilterLevel.R,
      description: "Adult topics - No filtering",
    },
  ]

  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">("connected")

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Initialize user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      addOnlineUser(currentUser, activeChannel.id)
      console.log("User initialized:", currentUser)
    }
  }, [activeChannel.id])

  // Load messages and users for active channel
  const loadChatData = useCallback(() => {
    if (!user) return

    try {
      const channelMessages = getMessages(activeChannel.id)
      const channelUsers = getOnlineUsers(activeChannel.id)

      setMessages(channelMessages)
      setOnlineUsers(channelUsers)

      // Update connection status based on data freshness
      if (channelMessages.length !== lastMessageCount) {
        setConnectionStatus("connected")
        setLastMessageCount(channelMessages.length)
      }

      console.log("Chat data loaded:", {
        messages: channelMessages.length,
        users: channelUsers.length,
        channel: activeChannel.id,
      })
    } catch (error) {
      console.error("Error loading chat data:", error)
      setConnectionStatus("disconnected")
    }
  }, [user, activeChannel.id, lastMessageCount])

  // Set up real-time event listeners
  useEffect(() => {
    if (!user) return

    console.log("Setting up event listeners for channel:", activeChannel.id)

    // Initial load
    loadChatData()

    // Subscribe to chat events
    unsubscribeRef.current = subscribeToChatEvents((event, data) => {
      console.log("Chat event received:", event, data)

      if (event === "message-added" && data.channel === activeChannel.id) {
        loadChatData()
      } else if (event === "users-updated") {
        const channelUsers = getOnlineUsers(activeChannel.id)
        setOnlineUsers(channelUsers)
      } else if (event === "force-refresh" && data.channel === activeChannel.id) {
        setMessages(data.messages)
        setOnlineUsers(data.users)
      }
    })

    // Set up multiple event listeners for maximum compatibility
    const handleStorageChange = (e: StorageEvent) => {
      console.log("Storage event:", e.key, e.newValue ? "has data" : "no data")

      if (e.key === `rogo-chat-messages-${activeChannel.id}` || e.key === "rogo-chat-online-users") {
        setTimeout(loadChatData, 100) // Small delay to ensure data is written
      }
    }

    const handleCustomEvent = (e: CustomEvent) => {
      console.log("Custom event:", e.detail)

      if (e.detail.type === "message" && e.detail.channel === activeChannel.id) {
        loadChatData()
      } else if (e.detail.type === "users") {
        const channelUsers = getOnlineUsers(activeChannel.id)
        setOnlineUsers(channelUsers)
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log("Tab became visible, refreshing data")
        updateUserActivity(user.id, activeChannel.id)
        loadChatData()
      }
    }

    const handleFocus = () => {
      if (user) {
        console.log("Window focused, refreshing data")
        updateUserActivity(user.id, activeChannel.id)
        loadChatData()
      }
    }

    // Add all event listeners
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("rogo-chat-update", handleCustomEvent as EventListener)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)

    // Set up aggressive polling for real-time updates
    refreshIntervalRef.current = setInterval(() => {
      loadChatData()
      if (user) {
        updateUserActivity(user.id, activeChannel.id)
      }
    }, 1000) // Poll every second

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("rogo-chat-update", handleCustomEvent as EventListener)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)

      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [activeChannel.id, user, loadChatData])

  // Set up user activity tracking
  useEffect(() => {
    if (!user) return

    // Update user activity every 5 seconds (more frequent)
    activityIntervalRef.current = setInterval(() => {
      updateUserActivity(user.id, activeChannel.id)
      addOnlineUser(user, activeChannel.id) // Refresh user presence
    }, 5000)

    return () => {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current)
      }
    }
  }, [user, activeChannel.id])

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (user) {
        removeOnlineUser(user.id)
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current)
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [user])

  const handleUserCreated = useCallback(
    (newUser: User) => {
      setUser(newUser)
      addOnlineUser(newUser, activeChannel.id)
      console.log("New user created:", newUser)
    },
    [activeChannel.id],
  )

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (newMessage.trim() && user) {
        const filteredMessage = filterProfanity(newMessage.trim(), activeChannel.filterLevel)
        const message: ChatMessage = {
          id: `msg_${Date.now()}_${user.id}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          text: filteredMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          channel: activeChannel.id,
          serverTimestamp: Date.now(),
        }

        console.log("Sending message:", message)
        saveMessage(message)
        setNewMessage("")

        // Update user activity
        updateUserActivity(user.id, activeChannel.id)

        // Force immediate refresh
        setTimeout(loadChatData, 50)
      }
    },
    [newMessage, user, activeChannel, loadChatData],
  )

  const changeChannel = useCallback(
    (channel: Channel) => {
      console.log("Changing channel from", activeChannel.id, "to", channel.id)
      setActiveChannel(channel)
      if (user) {
        addOnlineUser(user, channel.id)
      }
    },
    [activeChannel.id, user],
  )

  const handleLogout = useCallback(() => {
    if (user) {
      removeOnlineUser(user.id)
      localStorage.removeItem("rogo-chat-user")
      setUser(null)
      console.log("User logged out")
    }
  }, [user])

  const handleForceRefresh = useCallback(() => {
    setIsRefreshing(true)
    console.log("Force refreshing chat data")

    forceRefreshChatData(activeChannel.id)
    loadChatData()

    setTimeout(() => {
      setIsRefreshing(false)
      setConnectionStatus("connected")
    }, 1000)
  }, [activeChannel.id, loadChatData])

  // Show user setup if no user is logged in
  if (!user) {
    return <UserSetup onUserCreated={handleUserCreated} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Rogo Chat</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "reconnecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-400">
                {onlineUsers.length} user{onlineUsers.length !== 1 ? "s" : ""} online
              </span>
            </div>
            <Button
              onClick={handleForceRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[80vh]">
          {/* Sidebar */}
          <div className="bg-gray-800 rounded-lg p-4 lg:col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Channels</h2>
              <Button variant="ghost" size="icon" className="rounded-full">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => changeChannel(channel)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeChannel.id === channel.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  <span>{channel.name}</span>
                  {channel.filterLevel === FilterLevel.R && (
                    <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">R</span>
                  )}
                  {channel.filterLevel === FilterLevel.PG13 && (
                    <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">PG-13</span>
                  )}
                </button>
              ))}
            </div>

            {/* Online Users List */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Online Users ({onlineUsers.length})</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {onlineUsers.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No users online</p>
                ) : (
                  onlineUsers.map((onlineUser) => (
                    <div key={onlineUser.id} className="flex items-center text-sm">
                      <div
                        className={`w-6 h-6 rounded-full ${onlineUser.avatar} flex items-center justify-center text-xs font-bold mr-2`}
                      >
                        {onlineUser.username.charAt(0).toUpperCase()}
                      </div>
                      <span className={onlineUser.id === user.id ? "text-purple-400 font-medium" : "text-gray-300"}>
                        {onlineUser.username}
                        {onlineUser.id === user.id && " (You)"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${user.avatar} flex items-center justify-center text-sm font-bold`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2 font-medium">{user.username}</span>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col bg-gray-800 border-gray-700">
            {/* Channel Header */}
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Hash className="h-5 w-5 mr-2" />
                    <h2 className="text-lg font-bold">{activeChannel.name}</h2>
                    {activeChannel.filterLevel === FilterLevel.R && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">R</span>
                    )}
                    {activeChannel.filterLevel === FilterLevel.PG13 && (
                      <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">PG-13</span>
                    )}
                    <span className="ml-2 text-xs text-gray-400">({messages.length} messages)</span>
                  </div>
                  <p className="text-sm text-gray-400">{activeChannel.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Users className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 italic py-8">
                    <p>No messages yet. Say hello!</p>
                    <p className="text-xs mt-2">Messages will appear here in real-time</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${msg.avatar} flex items-center justify-center text-sm font-bold`}
                    >
                      {msg.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{msg.username}</span>
                        {msg.userId === user.id && (
                          <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded">You</span>
                        )}
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-200 break-words">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder={`Message #${activeChannel.name}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-gray-700 border-gray-600 focus:ring-purple-500 pr-20"
                    maxLength={500}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <div>
                  {activeChannel.filterLevel === FilterLevel.PG13 ? (
                    <p>PG-13 mode: Slurs are filtered, profanity is allowed</p>
                  ) : (
                    <p>R mode: No filtering applied - anything goes</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>{newMessage.length}/500</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-green-500"
                        : connectionStatus === "reconnecting"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
