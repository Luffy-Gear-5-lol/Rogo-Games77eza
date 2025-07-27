export interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  text: string
  timestamp: string
  channel: string
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
}

export function getOnlineUsers(): string[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("rogo-chat-online-users")
  return users ? JSON.parse(users) : []
}

export function addOnlineUser(userId: string): void {
  if (typeof window === "undefined") return
  const users = getOnlineUsers()
  if (!users.includes(userId)) {
    users.push(userId)
    localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))
  }
}

export function removeOnlineUser(userId: string): void {
  if (typeof window === "undefined") return
  const users = getOnlineUsers().filter((id) => id !== userId)
  localStorage.setItem("rogo-chat-online-users", JSON.stringify(users))
}
