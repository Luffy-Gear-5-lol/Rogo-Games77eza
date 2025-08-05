// WebSocket server implementation inspired by Discord's architecture
import { WebSocketServer, WebSocket } from "ws"
import { createServer } from "http"

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: number
  channelId: string
  type: "message" | "system"
}

interface User {
  id: string
  username: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  lastSeen: number
}

interface Channel {
  id: string
  name: string
  type: "text" | "voice"
  users: Set<string>
}

interface WebSocketConnection {
  ws: WebSocket
  userId: string
  channelId: string
  heartbeat: NodeJS.Timeout
  lastPong: number
}

class DiscordLikeChatServer {
  private static instance: DiscordLikeChatServer
  private wss: WebSocketServer | null = null
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
    const server = createServer()
    this.wss = new WebSocketServer({ server })

    // Initialize default channels
    this.initializeChannels()

    this.wss.on("connection", (ws: WebSocket, request) => {
      console.log("New WebSocket connection established")

      ws.on("message", (data: Buffer) => {
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
        op: 10, // Hello opcode (Discord-like)
        d: {
          heartbeat_interval: this.heartbeatInterval,
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
      { id: "general", name: "general", type: "text" as const },
      { id: "gaming", name: "gaming", type: "text" as const },
      { id: "memes", name: "memes", type: "text" as const },
      { id: "after-dark", name: "after-dark", type: "text" as const },
      { id: "nsfw-chat", name: "nsfw-chat", type: "text" as const },
    ]

    defaultChannels.forEach((channel) => {
      this.channels.set(channel.id, {
        ...channel,
        users: new Set(),
      })
      this.messages.set(channel.id, [])
    })
  }

  private handleMessage(ws: WebSocket, message: any) {
    const { op, d, t } = message

    switch (op) {
      case 1: // Heartbeat
        this.handleHeartbeat(ws)
        break
      case 2: // Identify
        this.handleIdentify(ws, d)
        break
      case 0: // Dispatch
        this.handleDispatch(ws, t, d)
        break
      default:
        console.log("Unknown opcode:", op)
    }
  }

  private handleHeartbeat(ws: WebSocket) {
    this.sendMessage(ws, { op: 11 }) // Heartbeat ACK
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
    })

    // Add user to channel
    const channelObj = this.channels.get(channel)
    if (channelObj) {
      channelObj.users.add(user.id)
    }

    // Send ready event
    this.sendMessage(ws, {
      op: 0,
      t: "READY",
      d: {
        user: this.users.get(user.id),
        channels: Array.from(this.channels.values()).map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type,
        })),
        session_id: connectionId,
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

    const message: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content: content.trim(),
      timestamp: Date.now(),
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
      op: 0,
      t: "MESSAGE_CREATE",
      d: message,
    })

    // Update user activity
    user.lastSeen = Date.now()

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
        op: 0,
        t: "TYPING_START",
        d: {
          user_id: user.id,
          username: user.username,
          channel_id: connection.channelId,
          timestamp: Date.now(),
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
      this.broadcastPresenceUpdate(connection.userId)
    }
  }

  private sendChannelMessages(ws: WebSocket, channelId: string) {
    const messages = this.messages.get(channelId) || []

    this.sendMessage(ws, {
      op: 0,
      t: "MESSAGE_HISTORY",
      d: {
        channel_id: channelId,
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
        op: 0,
        t: "PRESENCE_UPDATE",
        d: {
          channel_id: channelId,
          users: channelUsers,
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
      op: 0,
      t: "ERROR",
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
