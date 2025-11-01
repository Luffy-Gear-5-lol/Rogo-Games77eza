"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setCurrentChannel } from "@/store/chat-slice"
import { useChatWebSocket } from "@/hooks/use-chat-websocket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Users, Wifi, WifiOff, RefreshCw, AlertTriangle } from "lucide-react"
import { filterProfanity, FilterLevel } from "@/utils/profanity-filter"

const CHANNELS = [
  { id: "general", name: "General", description: "General discussion", filterLevel: FilterLevel.PG13 },
  { id: "pg13", name: "PG-13", description: "Mild language allowed", filterLevel: FilterLevel.PG13 },
  { id: "r-rated", name: "R-Rated", description: "All language allowed", filterLevel: FilterLevel.R },
]

export default function ChatInterface() {
  const dispatch = useDispatch()
  const { messages, users, currentUser, currentChannel, connectionStatus, typingUsers } = useSelector(
    (state: RootState) => state.chat,
  )
  const { sendMessage, setTyping, getAvatarColor } = useChatWebSocket()

  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true)
      setTyping(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      setTyping(false)
    }, 1000)
  }

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentUser) return

    const activeChannel = CHANNELS.find((c) => c.id === currentChannel)
    const filteredContent = filterProfanity(messageInput, activeChannel?.filterLevel || FilterLevel.PG13)
    sendMessage(filteredContent)
    setMessageInput("")
    setIsTyping(false)
    setTyping(false)
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Change channel
  const handleChannelChange = (channelId: string) => {
    dispatch(setCurrentChannel(channelId))
  }

  // Get connection status color
  const getConnectionColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-500"
      case "connecting":
        return "text-yellow-500"
      default:
        return "text-red-500"
    }
  }

  // Get connection icon
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4" />
      case "connecting":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <WifiOff className="h-4 w-4" />
    }
  }

  // Filter typing users (exclude current user and inactive users)
  const activeTypingUsers = typingUsers.filter(
    (userId) => userId !== currentUser?.id && users.some((user) => user.id === userId),
  )

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Welcome to Rogo Chat</h3>
          <p className="text-muted-foreground">Please set up your profile to start chatting.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Alert className="m-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 font-medium">
            ℹ️ Rogo will update very rarely. Features are stable and ready to use!
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                #{CHANNELS.find((c) => c.id === currentChannel)?.name || currentChannel}
              </h2>
              <Badge variant="outline" className={getConnectionColor()}>
                {getConnectionIcon()}
                {connectionStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {users.length + 1} {users.length === 0 ? "user" : "users"} online
            </div>
          </div>
        </div>

        {/* Channel Tabs */}
        <Tabs value={currentChannel} onValueChange={handleChannelChange} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            {CHANNELS.map((channel) => (
              <TabsTrigger key={channel.id} value={channel.id}>
                {channel.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {CHANNELS.map((channel) => (
            <TabsContent key={channel.id} value={channel.id} className="flex-1 flex flex-col mt-2">
              {/* Messages */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No messages yet. Start the conversation!</p>
                      <p className="text-sm mt-2">{channel.description}</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex gap-3 hover:bg-muted/20 p-2 rounded-lg transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${message.avatar} text-white text-sm`}>
                            {message.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{message.username}</span>
                            {message.userId === currentUser?.id && (
                              <Badge variant="secondary" className="text-xs">
                                You
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm break-words">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Typing Indicators */}
                  {activeTypingUsers.length > 0 && (
                    <div className="flex gap-3 opacity-60">
                      <div className="h-8 w-8 flex items-center justify-center">
                        <div className="flex gap-1">
                          <div
                            className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {activeTypingUsers.length === 1
                            ? `${users.find((u) => u.id === activeTypingUsers[0])?.username} is typing...`
                            : `${activeTypingUsers.length} users are typing...`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message #${channel.name.toLowerCase()}...`}
                    className="flex-1"
                    maxLength={500}
                  />
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>{channel.description}</span>
                  <span>{messageInput.length}/500</span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Sidebar */}
      <div className="w-64 border-l bg-muted/30">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Online Users ({users.length + 1})
          </h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {/* Current User */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className={`${currentUser.avatar} text-white text-xs`}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{currentUser.username}</span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  You
                </Badge>
              </div>

              {/* Other Users */}
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`${user.avatar} text-white text-xs`}>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.username}</span>
                  {typingUsers.includes(user.id) && (
                    <div className="flex gap-0.5 ml-auto">
                      <div
                        className="w-1 h-1 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-1 h-1 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-1 h-1 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  )}
                </div>
              ))}

              {users.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">No other users online</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
