export interface User {
  id: string
  username: string
  avatar: string
  joinedAt: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("rogo-chat-user")
  return userData ? JSON.parse(userData) : null
}

export function saveUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("rogo-chat-user", JSON.stringify(user))
}

export function generateUserId(): string {
  return "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

export function generateAvatar(): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
