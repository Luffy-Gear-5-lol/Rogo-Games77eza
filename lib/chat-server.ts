// Server-side chat management using in-memory storage
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

class ChatServer {
  private static instance: ChatServer
  private messages: Map<string, ChatMessage[]> = new Map()
  private users: Map<string, OnlineUser> = new Map()
  private connections: Map<string, Response> = new Map()
  private messageIdCounter = 0

  static getInstance(): ChatServer {
    if (!ChatServer.instance) {
      ChatServer.instance = new ChatServer()
    }
    return ChatServer.instance
  }

  // Message management
  addMessage(message: Omit<ChatMessage, "id" | "serverTimestamp">): ChatMessage {
    const fullMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${++this.messageIdCounter}`,
      serverTimestamp: Date.now(),
    }

    if (!this.messages.has(message.channel)) {
      this.messages.set(message.channel, [])
    }

    const channelMessages = this.messages.get(message.channel)!
    channelMessages.push(fullMessage)

    // Keep only last 200 messages per channel
    if (channelMessages.length > 200) {
      channelMessages.splice(0, channelMessages.length - 200)
    }

    // Broadcast to all connected clients
    this.broadcastMessage(fullMessage)

    return fullMessage
  }

  getMessages(channel: string): ChatMessage[] {
    return this.messages.get(channel) || []
  }

  // User management
  addUser(user: Omit<OnlineUser, "lastSeen">, connectionId: string): void {
    const onlineUser: OnlineUser = {
      ...user,
      lastSeen: Date.now(),
      connectionId,
    }

    this.users.set(user.id, onlineUser)
    this.broadcastUserUpdate()
  }

  removeUser(userId: string): void {
    const user = this.users.get(userId)
    if (user) {
      this.connections.delete(user.connectionId)
      this.users.delete(userId)
      this.broadcastUserUpdate()
    }
  }

  updateUserActivity(userId: string): void {
    const user = this.users.get(userId)
    if (user) {
      user.lastSeen = Date.now()
      this.users.set(userId, user)
    }
  }

  getOnlineUsers(channel?: string): OnlineUser[] {
    const now = Date.now()
    const activeUsers = Array.from(this.users.values()).filter((user) => {
      const isActive = now - user.lastSeen < 60000 // 1 minute timeout
      const inChannel = !channel || user.channel === channel
      return isActive && inChannel
    })

    // Clean up inactive users
    const inactiveUsers = Array.from(this.users.values()).filter((user) => now - user.lastSeen >= 60000)
    inactiveUsers.forEach((user) => {
      this.connections.delete(user.connectionId)
      this.users.delete(user.id)
    })

    return activeUsers
  }

  // SSE connection management
  addConnection(connectionId: string, response: Response): void {
    this.connections.set(connectionId, response)
  }

  removeConnection(connectionId: string): void {
    this.connections.delete(connectionId)
  }

  // Broadcasting
  private broadcastMessage(message: ChatMessage): void {
    const data = JSON.stringify({
      type: "message",
      data: message,
    })

    this.broadcast(data)
  }

  private broadcastUserUpdate(): void {
    const data = JSON.stringify({
      type: "users",
      data: Array.from(this.users.values()),
    })

    this.broadcast(data)
  }

  private broadcast(data: string): void {
    const deadConnections: string[] = []

    this.connections.forEach((response, connectionId) => {
      try {
        const writer = response.body?.getWriter()
        if (writer) {
          writer.write(new TextEncoder().encode(`data: ${data}\n\n`))
        }
      } catch (error) {
        console.error("Failed to send to connection:", connectionId, error)
        deadConnections.push(connectionId)
      }
    })

    // Clean up dead connections
    deadConnections.forEach((connectionId) => {
      this.connections.delete(connectionId)
    })
  }

  // Cleanup inactive connections
  cleanup(): void {
    const now = Date.now()
    const inactiveUsers = Array.from(this.users.values()).filter((user) => now - user.lastSeen >= 60000)

    inactiveUsers.forEach((user) => {
      this.removeUser(user.id)
    })
  }
}

export const chatServer = ChatServer.getInstance()

// Cleanup interval
setInterval(() => {
  chatServer.cleanup()
}, 30000) // Clean up every 30 seconds
