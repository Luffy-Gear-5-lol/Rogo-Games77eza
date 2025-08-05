// Discord-inspired chat interface component
"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { filterProfanity, FilterLevel } from "@/utils/profanity-filter"
import {
  Send,
  Hash,
  Settings,
  Users,
  Bell,
  PlusCircle,
  Smile,
  Paperclip,
  LogOut,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useChatWebSocket } from "@/hooks/use-chat-websocket"
import { getCurrentUser, type User } from "@/utils/user-utils"
import UserSetup from "@/components/user-setup"

interface Channel {
  id: string
  name: string
  type: "text" | "voice"
  filterLevel: FilterLevel
  description: string
}

function ChatInterfaceInner() {
  const channels: Channel[] = [
    {
      id: "general",
      name: "general",
      type: "text",
      filterLevel: FilterLevel.PG13,
      description: "General discussion - No slurs, profanity allowed",
    },
    {
      id: "gaming",
      name: "gaming",
      type: "text",
      filterLevel: FilterLevel.PG13,
      description: "Game discussion - No slurs, profanity allowed",
    },
    {
      id: "memes",
      name: "memes",
      type: "text",
      filterLevel: FilterLevel.PG13,
      description: "Share memes - No slurs, profanity allowed",
    },
    {
      id: "after-dark",
      name: "after-dark",
      type: "text",
      filterLevel: FilterLevel.R,
      description: "Mature content allowed - No filtering",
    },
    {
      id: "nsfw-chat",
      name: "nsfw-chat",
      type: "text",
      filterLevel: FilterLevel.R,
      description: "Adult topics - No filtering",
    },
  ]

  const [user, setUser] = useState<User | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    connected,
    connecting,
    error,
    currentUser,
    activeChannel,
    messages,
    users,
    typingUsers,
    channels: availableChannels,
    connect,
    sendMessage,
    changeChannel,
    handleTyping,
    reconnectAttempts,
    maxReconnectAttempts,
  } = useChatWebSocket()

  // Initialize user and connect
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser && !isInitialized) {
      setUser(currentUser)
      connect(currentUser, "general")
      setIsInitialized(true)
    }
  }, [connect, isInitialized])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Focus input when channel changes
  useEffect(() => {
    if (messageInputRef.current && connected) {
      messageInputRef.current.focus()
    }
  }, [activeChannel, connected])

  const handleUserCreated = useCallback(
    (newUser: User) => {
      setUser(newUser)
      connect(newUser, "general")
      setIsInitialized(true)
    },
    [connect],
  )

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!newMessage.trim() || !activeChannel) return

      const activeChannelConfig = channels.find((c) => c.id === activeChannel.id)
      const filterLevel = activeChannelConfig?.filterLevel || FilterLevel.PG13

      const filteredMessage = filterProfanity(newMessage.trim(), filterLevel)
      const success = await sendMessage(filteredMessage)

      if (success) {
        setNewMessage("")
      }
    },
    [newMessage, activeChannel, sendMessage],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value)

      // Handle typing indicator
      if (e.target.value.length > 0) {
        handleTyping()
      }
    },
    [handleTyping],
  )

  const handleChannelChange = useCallback(
    (channelId: string) => {
      changeChannel(channelId)
    },
    [changeChannel],
  )

  const handleLogout = useCallback(() => {
    localStorage.removeItem("rogo-chat-user")
    setUser(null)
    setIsInitialized(false)
    window.location.reload()
  }, [])

  const handleReconnect = useCallback(() => {
    if (user) {
      connect(user, activeChannel?.id || "general")
    }
  }, [user, activeChannel, connect])

  // Show user setup if no user
  if (!user) {
    return <UserSetup onUserCreated={handleUserCreated} />
  }

  const ConnectionIcon = connected ? Wifi : WifiOff
  const activeChannelConfig = channels.find((c) => c.id === activeChannel?.id)
  const typingUsernames = typingUsers.map((tu) => tu.username)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Rogo Chat</h1>
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <ConnectionIcon
                className={`w-4 h-4 ${
                  connected ? "text-green-500" : connecting ? "text-yellow-500 animate-pulse" : "text-red-500"
                }`}
              />
              <span className="text-sm text-gray-400">
                {users.length} user{users.length !== 1 ? "s" : ""} online
              </span>
              {!connected && (
                <Badge variant="destructive" className="text-xs">
                  {connecting ? "Connecting..." : "Disconnected"}
                </Badge>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Reconnect Button */}
            {!connected && !connecting && reconnectAttempts < maxReconnectAttempts && (
              <Button
                onClick={handleReconnect}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reconnect
              </Button>
            )}

            {/* Logout Button */}
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
            {/* Channels */}
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
                  onClick={() => handleChannelChange(channel.id)}
                  disabled={!connected}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${
                    activeChannel?.id === channel.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50"
                  }`}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  <span>{channel.name}</span>
                  {channel.filterLevel === FilterLevel.R && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      R
                    </Badge>
                  )}
                  {channel.filterLevel === FilterLevel.PG13 && (
                    <Badge className="ml-auto text-xs bg-green-500">PG-13</Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Online Users */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Online Users ({users.length})</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No users online</p>
                ) : (
                  users.map((onlineUser) => (
                    <div key={onlineUser.id} className="flex items-center text-sm">
                      <div
                        className={`w-6 h-6 rounded-full ${onlineUser.avatar} flex items-center justify-center text-xs font-bold mr-2 relative`}
                      >
                        {onlineUser.username.charAt(0).toUpperCase()}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${
                            onlineUser.status === "online"
                              ? "bg-green-500"
                              : onlineUser.status === "away"
                                ? "bg-yellow-500"
                                : onlineUser.status === "busy"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <span
                        className={onlineUser.id === currentUser?.id ? "text-purple-400 font-medium" : "text-gray-300"}
                      >
                        {onlineUser.username}
                        {onlineUser.id === currentUser?.id && " (You)"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Current User */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${user.avatar} flex items-center justify-center text-sm font-bold relative`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
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
                    <h2 className="text-lg font-bold">{activeChannel?.name || "Loading..."}</h2>
                    {activeChannelConfig?.filterLevel === FilterLevel.R && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        R
                      </Badge>
                    )}
                    {activeChannelConfig?.filterLevel === FilterLevel.PG13 && (
                      <Badge className="ml-2 text-xs bg-green-500">PG-13</Badge>
                    )}
                    <span className="ml-2 text-xs text-gray-400">({messages.length} messages)</span>
                  </div>
                  <p className="text-sm text-gray-400">{activeChannelConfig?.description || "Loading channel..."}</p>
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
                {!connected && (
                  <div className="text-center text-gray-500 italic py-4">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                    {connecting ? "Connecting to chat..." : "Disconnected from chat"}
                  </div>
                )}

                {connected && messages.length === 0 && (
                  <div className="text-center text-gray-500 italic py-8">
                    <p>No messages yet. Say hello!</p>
                    <p className="text-xs mt-2">Messages will appear here in real-time</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 group hover:bg-gray-700/20 p-2 rounded">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${msg.avatar} flex items-center justify-center text-sm font-bold`}
                    >
                      {msg.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{msg.username}</span>
                        {msg.userId === currentUser?.id && <Badge className="text-xs bg-purple-600">You</Badge>}
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-200 break-words">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicators */}
                {typingUsernames.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 italic">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span>
                      {typingUsernames.length === 1
                        ? `${typingUsernames[0]} is typing...`
                        : typingUsernames.length === 2
                          ? `${typingUsernames[0]} and ${typingUsernames[1]} are typing...`
                          : `${typingUsernames.slice(0, -1).join(", ")} and ${typingUsernames[typingUsernames.length - 1]} are typing...`}
                    </span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={messageInputRef}
                    type="text"
                    placeholder={connected ? `Message #${activeChannel?.name || "channel"}` : "Connecting..."}
                    value={newMessage}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 focus:ring-purple-500 pr-20"
                    maxLength={2000}
                    disabled={!connected}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      disabled={!connected}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      disabled={!connected}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!newMessage.trim() || !connected}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <div>
                  {activeChannelConfig?.filterLevel === FilterLevel.PG13 ? (
                    <p>PG-13 mode: Slurs are filtered, profanity is allowed</p>
                  ) : (
                    <p>R mode: No filtering applied - anything goes</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>{newMessage.length}/2000</span>
                  <ConnectionIcon
                    className={`w-3 h-3 ${
                      connected ? "text-green-500" : connecting ? "text-yellow-500" : "text-red-500"
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

export default function ChatInterface() {
  return (
    <Provider store={store}>
      <ChatInterfaceInner />
    </Provider>
  )
}
