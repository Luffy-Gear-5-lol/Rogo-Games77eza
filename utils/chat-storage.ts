export interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  text: string
  timestamp: string
  channel: string
  serverTimestamp: number
}

export interface OnlineUser {
  id: string
  username: string
  avatar: string
  lastSeen: number
  channel: string
}

// Global event emitter for cross-tab communication
class ChatEventEmitter {
  private static instance: ChatEventEmitter
  private listeners: Map<string, Function[]> = new Map()

  static getInstance(): ChatEventEmitter {
    if (!ChatEventEmitter.instance) {
      ChatEventEmitter.instance = new ChatEventEmitter()
    }
    return ChatEventEmitter.instance
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }
}

const chatEmitter = ChatEventEmitter.getInstance()

export function getMessages(channel: string): ChatMessage[] {
  if (typeof window === "undefined") return []

  try {
    const messages = localStorage.getItem(`rogo-chat-messages-${channel}`)
    const parsedMessages: ChatMessage[] = messages ? JSON.parse(messages) : []

    // Sort messages by server timestamp to ensure correct order
    return parsedMessages.sort((a, b) => (a.serverTimestamp || 0) - (b.serverTimestamp || 0))
  } catch (error) {
    console.error("Error getting messages:", error)
    return []
  }
}

export function saveMessage(message: ChatMessage): void {
  if (typeof window === "undefined") return

  try {
    // Add server timestamp for proper ordering
    const messageWithTimestamp = {
      ...message,
      serverTimestamp: Date.now(),
    }

    const messages = getMessages(message.channel)

    // Check if message already exists to prevent duplicates
    const existingMessage = messages.find((m) => m.id === message.id)
    if (existingMessage) {
      return
    }

    messages.push(messageWithTimestamp)

    // Keep only last 200 messages per channel (increased from 100)
    if (messages.length > 200) {
      messages.splice(0, messages.length - 200)
    }

    localStorage.setItem(`rogo-chat-messages-${message.channel}`, JSON.stringify(messages))

    // Emit events for real-time updates
    chatEmitter.emit("message-added", { channel: message.channel, message: messageWithTimestamp })

    // Trigger storage event for cross-tab communication
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `rogo-chat-messages-${message.channel}`,
        newValue: JSON.stringify(messages),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href,
      }),
    )

    // Force a custom event as backup
    window.dispatchEvent(
      new CustomEvent("rogo-chat-update", {
        detail: {
          type: "message",
          channel: message.channel,
          message: messageWithTimestamp,
          timestamp: Date.now(),
        },
        bubbles: true,
      }),
    )

    console.log("Message saved:", messageWithTimestamp)
  } catch (error) {
    console.error("Error saving message:", error)
  }
}

export function getOnlineUsers(channel?: string): OnlineUser[] {
  if (typeof window === "undefined") return []

  try {
    const users = localStorage.getItem("rogo-chat-online-users")
    const parsedUsers: OnlineUser[] = users ? JSON.parse(users) : []

    // Filter out users who haven't been seen in the last 45 seconds (increased timeout)
    const now = Date.now()
    const activeUsers = parsedUsers.filter((user) => {
      const isActive = now - user.lastSeen < 45000
      // If channel is specified, only return users in that channel
      const inChannel = !channel || user.channel === channel
      return isActive && inChannel
    })

    // Update storage with only active users if changed
    if (activeUsers.length !== parsedUsers.length) {
      localStorage.setItem("rogo-chat-online-users", JSON.stringify(activeUsers))
      chatEmitter.emit("users-updated", { users: activeUsers })
    }

    return activeUsers
  } catch (error) {
    console.error("Error getting online users:", error)
    return []
  }
}

export function addOnlineUser(user: { id: string; username: string; avatar: string }, channel: string): void {
  if (typeof window === "undefined") return

  try {
    const users = getOnlineUsers()
    const existingUserIndex = users.findIndex((u) => u.id === user.id)

    const onlineUser: OnlineUser = {
      ...user,
      lastSeen: Date.now(),
      channel: channel,
    }

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = onlineUser
    } else {
      users.push(onlineUser)
    }

    localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))

    // Emit events for real-time updates
    chatEmitter.emit("users-updated", { users })

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "rogo-chat-online-users",
        newValue: JSON.stringify(users),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href,
      }),
    )

    window.dispatchEvent(
      new CustomEvent("rogo-chat-update", {
        detail: {
          type: "users",
          users,
          timestamp: Date.now(),
        },
        bubbles: true,
      }),
    )

    console.log("User added/updated:", onlineUser)
  } catch (error) {
    console.error("Error adding online user:", error)
  }
}

export function removeOnlineUser(userId: string): void {
  if (typeof window === "undefined") return

  try {
    const users = getOnlineUsers().filter((user) => user.id !== userId)
    localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))

    // Emit events
    chatEmitter.emit("users-updated", { users })

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "rogo-chat-online-users",
        newValue: JSON.stringify(users),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href,
      }),
    )

    window.dispatchEvent(
      new CustomEvent("rogo-chat-update", {
        detail: {
          type: "users",
          users,
          timestamp: Date.now(),
        },
        bubbles: true,
      }),
    )

    console.log("User removed:", userId)
  } catch (error) {
    console.error("Error removing online user:", error)
  }
}

export function updateUserActivity(userId: string, channel: string): void {
  if (typeof window === "undefined") return

  try {
    const users = getOnlineUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex >= 0) {
      users[userIndex].lastSeen = Date.now()
      users[userIndex].channel = channel
      localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))

      // Emit update
      chatEmitter.emit("users-updated", { users })
    }
  } catch (error) {
    console.error("Error updating user activity:", error)
  }
}

// Subscribe to chat events
export function subscribeToChatEvents(callback: (event: string, data: any) => void) {
  const messageHandler = (data: any) => callback("message-added", data)
  const usersHandler = (data: any) => callback("users-updated", data)

  chatEmitter.on("message-added", messageHandler)
  chatEmitter.on("users-updated", usersHandler)

  return () => {
    chatEmitter.off("message-added", messageHandler)
    chatEmitter.off("users-updated", usersHandler)
  }
}

// Force refresh all chat data
export function forceRefreshChatData(channel: string) {
  if (typeof window === "undefined") return

  try {
    const messages = getMessages(channel)
    const users = getOnlineUsers(channel)

    chatEmitter.emit("force-refresh", { messages, users, channel })

    console.log("Force refresh:", { messagesCount: messages.length, usersCount: users.length })
  } catch (error) {
    console.error("Error force refreshing chat data:", error)
  }
}
