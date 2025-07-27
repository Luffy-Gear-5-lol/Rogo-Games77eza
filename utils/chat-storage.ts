export interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  text: string
  timestamp: string
  channel: string
}

export interface OnlineUser {
  id: string
  username: string
  avatar: string
  lastSeen: number
}

export function getMessages(channel: string): ChatMessage[] {
  if (typeof window === "undefined") return []
  const messages = localStorage.getItem(`rogo-chat-messages-${channel}`)
  return messages ? JSON.parse(messages) : []
}

export function saveMessage(message: ChatMessage): void {
  if (typeof window === "undefined") return
  const messages = getMessages(message.channel)
  messages.push(message)
  // Keep only last 100 messages per channel
  if (messages.length > 100) {
    messages.splice(0, messages.length - 100)
  }
  localStorage.setItem(`rogo-chat-messages-${message.channel}`, JSON.stringify(messages))

  // Trigger storage event for other tabs/windows
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: `rogo-chat-messages-${message.channel}`,
      newValue: JSON.stringify(messages),
    }),
  )

  // Also trigger a custom event for same-tab updates
  window.dispatchEvent(
    new CustomEvent("chat-message-added", {
      detail: { channel: message.channel, message },
    }),
  )
}

export function getOnlineUsers(): OnlineUser[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("rogo-chat-online-users")
  const parsedUsers: OnlineUser[] = users ? JSON.parse(users) : []

  // Filter out users who haven't been seen in the last 30 seconds
  const now = Date.now()
  const activeUsers = parsedUsers.filter((user) => now - user.lastSeen < 30000)

  // Update storage with only active users
  if (activeUsers.length !== parsedUsers.length) {
    localStorage.setItem("rogo-chat-online-users", JSON.stringify(activeUsers))
  }

  return activeUsers
}

export function addOnlineUser(user: { id: string; username: string; avatar: string }): void {
  if (typeof window === "undefined") return
  const users = getOnlineUsers()
  const existingUserIndex = users.findIndex((u) => u.id === user.id)

  const onlineUser: OnlineUser = {
    ...user,
    lastSeen: Date.now(),
  }

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = onlineUser
  } else {
    users.push(onlineUser)
  }

  localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))

  // Trigger event for user list updates
  window.dispatchEvent(
    new CustomEvent("chat-users-updated", {
      detail: { users },
    }),
  )
}

export function removeOnlineUser(userId: string): void {
  if (typeof window === "undefined") return
  const users = getOnlineUsers().filter((user) => user.id !== userId)
  localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))

  // Trigger event for user list updates
  window.dispatchEvent(
    new CustomEvent("chat-users-updated", {
      detail: { users },
    }),
  )
}

export function updateUserActivity(userId: string): void {
  if (typeof window === "undefined") return
  const users = getOnlineUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex >= 0) {
    users[userIndex].lastSeen = Date.now()
    localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))
  }
}
