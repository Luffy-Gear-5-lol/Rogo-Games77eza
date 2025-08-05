// WebSocket server implementation inspired by Discord's architecture
import WebSocket from "ws"
import http from "http"
import { filterProfanity, FilterLevel } from "@/utils/profanity-filter"

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: string
  channelId: string
  type: "message" | "system"
}

interface User {
  id: string
  username: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  lastSeen: number
  channelId: string
}

interface Channel {
  id: string
  name: string
  type: "text" | "voice"
  users: Set<string>
  filterLevel: FilterLevel
  messages: ChatMessage[]
}

interface WebSocketConnection {
  ws: WebSocket
  userId: string
  channelId: string
  heartbeat: NodeJS.Timeout
  lastPong: number
}

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

class DiscordLikeChatServer {
  private static instance: DiscordLikeChatServer
  private wss: WebSocket.Server | null = null
  private connections = new Map<string, WebSocketConnection>()
  private users = new Map<string, User>()
  private channels = new Map<string, Channel>()
  private messages = new Map<string, ChatMessage[]>()
  private heartbeatInterval = 30000 // 30 seconds like Discord

  static getInstance(): DiscordLikeChatServer {
    if (!DiscordLikeChatServer.instance) {
      DiscordLikeChatServer.instance = new DiscordLikeChatServer()
    }
    return DiscordLikeChatServer.instance
  }

  initialize(port = 8080) {
    const server = http.createServer()
    this.wss = new WebSocket.Server({ server })

    // Initialize default channels
    this.initializeChannels()

    this.wss.on("connection", (ws: WebSocket, request) => {
      console.log("New WebSocket connection established")

      ws.on("message", (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString())
          this.handleMessage(ws, message)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
          this.sendError(ws, "Invalid message format")
        }
      })

      ws.on("close", () => {
        this.handleDisconnection(ws)
      })

      ws.on("error", (error) => {
        console.error("WebSocket error:", error)
        this.handleDisconnection(ws)
      })

      ws.on("pong", () => {
        const connection = this.findConnectionByWs(ws)
        if (connection) {
          connection.lastPong = Date.now()
        }
      })

      // Send initial handshake
      this.sendMessage(ws, {
        op: OpCode.DISPATCH,
        d: {
          event: "HELLO",
          data: {
            message: "Welcome to Rogo Chat!",
          },
        },
      })
    })

    server.listen(port, () => {
      console.log(`Discord-like chat server running on port ${port}`)
    })

    // Start cleanup interval
    setInterval(() => this.cleanup(), 60000) // Every minute
  }

  private initializeChannels() {
    const defaultChannels = [
      {
        id: "general",
        name: "general",
        type: "text" as const,
        users: new Set(),
        filterLevel: FilterLevel.PG13,
        messages: [],
      },
      {
        id: "gaming",
        name: "gaming",
        type: "text" as const,
        users: new Set(),
        filterLevel: FilterLevel.PG13,
        messages: [],
      },
      {
        id: "memes",
        name: "memes",
        type: "text" as const,
        users: new Set(),
        filterLevel: FilterLevel.PG13,
        messages: [],
      },
      {
        id: "after-dark",
        name: "after-dark",
        type: "text" as const,
        users: new Set(),
        filterLevel: FilterLevel.R,
        messages: [],
      },
      {
        id: "nsfw-chat",
        name: "nsfw-chat",
        type: "text" as const,
        users: new Set(),
        filterLevel: FilterLevel.R,
        messages: [],
      },
    ]

    defaultChannels.forEach((channel) => {
      this.channels.set(channel.id, channel)
      this.messages.set(channel.id, channel.messages)
    })
  }

  private handleMessage(ws: WebSocket, message: any) {
    const { op, d } = message

    switch (op) {
      case OpCode.IDENTIFY:
        this.handleIdentify(ws, d)
        break
      case OpCode.HEARTBEAT:
        this.handleHeartbeat(d)
        break
      case OpCode.MESSAGE_CREATE:
        this.handleMessageCreate(d)
        break
      case OpCode.CHANNEL_JOIN:
        this.handleChannelJoin(ws, d)
        break
      case OpCode.TYPING_START:
        this.handleTypingStart(d)
        break
      case OpCode.PRESENCE_UPDATE:
        this.handlePresenceUpdate(d)
        break
      default:
        this.sendError(ws, "Unknown opcode")
    }
  }

  private handleHeartbeat(data: any) {
    const { userId } = data
    const user = this.users.get(userId)

    if (user) {
      user.lastSeen = Date.now()
      this.users.set(userId, user)
    }
  }

  private handleIdentify(ws: WebSocket, data: any) {
    const { user, channel } = data

    if (!user || !user.id || !user.username || !channel) {
      this.sendError(ws, "Invalid identify payload")
      return
    }

    // Remove existing connection for this user
    this.removeUserConnections(user.id)

    // Create new connection
    const connectionId = `${user.id}_${Date.now()}`
    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping()
      }
    }, this.heartbeatInterval)

    const connection: WebSocketConnection = {
      ws,
      userId: user.id,
      channelId: channel,
      heartbeat,
      lastPong: Date.now(),
    }

    this.connections.set(connectionId, connection)

    // Update user status
    this.users.set(user.id, {
      id: user.id,
      username: user.username,
      avatar: user.avatar || "bg-purple-500",
      status: "online",
      lastSeen: Date.now(),
      channelId: channel,
    })

    // Add user to channel
    const channelObj = this.channels.get(channel)
    if (channelObj) {
      channelObj.users.add(user.id)
    }

    // Send ready event
    this.sendMessage(ws, {
      op: OpCode.DISPATCH,
      d: {
        event: "READY",
        data: {
          user: this.users.get(user.id),
          channels: Array.from(this.channels.values()).map((ch) => ({
            id: ch.id,
            name: ch.name,
            type: ch.type,
            filterLevel: ch.filterLevel,
          })),
        },
      },
    })

    // Send initial data
    this.sendChannelMessages(ws, channel)
    this.broadcastPresenceUpdate(user.id)

    console.log(`User ${user.username} connected to channel ${channel}`)
  }

  private handleDispatch(ws: WebSocket, type: string, data: any) {
    const connection = this.findConnectionByWs(ws)
    if (!connection) return

    switch (type) {
      case "MESSAGE_CREATE":
        this.handleMessageCreate(connection, data)
        break
      case "CHANNEL_JOIN":
        this.handleChannelJoin(connection, data)
        break
      case "TYPING_START":
        this.handleTypingStart(connection, data)
        break
      case "PRESENCE_UPDATE":
        this.handlePresenceUpdate(connection, data)
        break
    }
  }

  private handleMessageCreate(connection: WebSocketConnection, data: any) {
    const { content } = data

    if (!content || content.trim().length === 0) return

    const user = this.users.get(connection.userId)
    if (!user) return

    const channelData = this.channels.get(connection.channelId)
    if (!channelData) return

    // Filter content based on channel settings
    const filteredContent = filterProfanity(content, channelData.filterLevel)

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content: filteredContent,
      timestamp: new Date().toISOString(),
      channelId: connection.channelId,
      type: "message",
    }

    // Store message
    const channelMessages = this.messages.get(connection.channelId) || []
    channelMessages.push(message)

    // Keep only last 500 messages per channel
    if (channelMessages.length > 500) {
      channelMessages.splice(0, channelMessages.length - 500)
    }

    this.messages.set(connection.channelId, channelMessages)

    // Broadcast to all users in channel
    this.broadcastToChannel(connection.channelId, {
      op: OpCode.DISPATCH,
      d: {
        event: "MESSAGE_CREATE",
        data: message,
      },
    })

    // Update user activity
    user.lastSeen = Date.now()
    this.users.set(connection.userId, user)

    console.log(`Message from ${user.username} in ${connection.channelId}: ${content}`)
  }

  private handleChannelJoin(connection: WebSocketConnection, data: any) {
    const { channel_id } = data

    if (!this.channels.has(channel_id)) return

    // Remove from old channel
    const oldChannel = this.channels.get(connection.channelId)
    if (oldChannel) {
      oldChannel.users.delete(connection.userId)
    }

    // Add to new channel
    const newChannel = this.channels.get(channel_id)
    if (newChannel) {
      newChannel.users.add(connection.userId)
      connection.channelId = channel_id

      // Send channel messages
      this.sendChannelMessages(connection.ws, channel_id)

      // Broadcast presence updates
      this.broadcastPresenceUpdate(connection.userId)
    }
  }

  private handleTypingStart(connection: WebSocketConnection, data: any) {
    const user = this.users.get(connection.userId)
    if (!user) return

    // Broadcast typing indicator to channel (except sender)
    this.broadcastToChannel(
      connection.channelId,
      {
        op: OpCode.DISPATCH,
        d: {
          event: "TYPING_START",
          data: {
            userId: user.id,
            username: user.username,
            channel: connection.channelId,
          },
        },
      },
      connection.userId,
    )
  }

  private handlePresenceUpdate(connection: WebSocketConnection, data: any) {
    const { status } = data
    const user = this.users.get(connection.userId)

    if (user && ["online", "away", "busy"].includes(status)) {
      user.status = status
      user.lastSeen = Date.now()
      this.users.set(connection.userId, user)
      this.broadcastPresenceUpdate(connection.userId)
    }
  }

  private sendChannelMessages(ws: WebSocket, channelId: string) {
    const messages = this.messages.get(channelId) || []

    this.sendMessage(ws, {
      op: OpCode.MESSAGE_LIST,
      d: {
        channel: channelId,
        messages: messages.slice(-100), // Send last 100 messages
      },
    })
  }

  private broadcastPresenceUpdate(userId: string) {
    const user = this.users.get(userId)
    if (!user) return

    // Get all channels this user is in
    const userChannels = Array.from(this.channels.entries())
      .filter(([_, channel]) => channel.users.has(userId))
      .map(([channelId, _]) => channelId)

    // Broadcast to all relevant channels
    userChannels.forEach((channelId) => {
      const channelUsers = Array.from(this.channels.get(channelId)?.users || [])
        .map((uid) => this.users.get(uid))
        .filter(Boolean)

      this.broadcastToChannel(channelId, {
        op: OpCode.DISPATCH,
        d: {
          event: "PRESENCE_UPDATE",
          data: {
            channel_id: channelId,
            users: channelUsers,
          },
        },
      })
    })
  }

  private broadcastToChannel(channelId: string, message: any, excludeUserId?: string) {
    const channel = this.channels.get(channelId)
    if (!channel) return

    const connections = Array.from(this.connections.values()).filter(
      (conn) => conn.channelId === channelId && conn.ws.readyState === WebSocket.OPEN && conn.userId !== excludeUserId,
    )

    connections.forEach((conn) => {
      this.sendMessage(conn.ws, message)
    })
  }

  private sendMessage(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  private sendError(ws: WebSocket, error: string) {
    this.sendMessage(ws, {
      op: OpCode.ERROR,
      d: { message: error },
    })
  }

  private findConnectionByWs(ws: WebSocket): WebSocketConnection | undefined {
    return Array.from(this.connections.values()).find((conn) => conn.ws === ws)
  }

  private removeUserConnections(userId: string) {
    const connectionsToRemove = Array.from(this.connections.entries()).filter(([_, conn]) => conn.userId === userId)

    connectionsToRemove.forEach(([connId, conn]) => {
      clearInterval(conn.heartbeat)
      this.connections.delete(connId)
    })
  }

  private handleDisconnection(ws: WebSocket) {
    const connection = this.findConnectionByWs(ws)
    if (!connection) return

    console.log(`User ${connection.userId} disconnected`)

    // Remove from channel
    const channel = this.channels.get(connection.channelId)
    if (channel) {
      channel.users.delete(connection.userId)
    }

    // Update user status
    const user = this.users.get(connection.userId)
    if (user) {
      user.status = "offline"
      user.lastSeen = Date.now()
    }

    // Clean up connection
    clearInterval(connection.heartbeat)
    const connId = Array.from(this.connections.entries()).find(([_, conn]) => conn.ws === ws)?.[0]

    if (connId) {
      this.connections.delete(connId)
    }

    // Broadcast presence update
    this.broadcastPresenceUpdate(connection.userId)
  }

  private cleanup() {
    const now = Date.now()
    const timeout = 120000 // 2 minutes

    // Remove stale connections
    const staleConnections = Array.from(this.connections.entries()).filter(([_, conn]) => now - conn.lastPong > timeout)

    staleConnections.forEach(([connId, conn]) => {
      console.log(`Removing stale connection: ${connId}`)
      this.handleDisconnection(conn.ws)
    })

    // Remove offline users after 5 minutes
    const offlineTimeout = 300000 // 5 minutes
    const offlineUsers = Array.from(this.users.entries()).filter(
      ([_, user]) => user.status === "offline" && now - user.lastSeen > offlineTimeout,
    )

    offlineUsers.forEach(([userId, _]) => {
      this.users.delete(userId)
      console.log(`Removed offline user: ${userId}`)
    })
  }

  getStats() {
    return {
      connections: this.connections.size,
      users: this.users.size,
      channels: this.channels.size,
      totalMessages: Array.from(this.messages.values()).reduce((sum, msgs) => sum + msgs.length, 0),
    }
  }
}

export const chatServer = DiscordLikeChatServer.getInstance()
