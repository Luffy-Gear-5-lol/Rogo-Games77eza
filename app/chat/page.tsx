"use client"

import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import ChatInterface from "@/components/chat-interface"
import UserSetup from "@/components/user-setup"
import type { User } from "@/utils/user-utils"

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("rogo-chat-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("rogo-chat-user")
      }
    }
  }, [])

  const handleUserCreated = (newUser: User) => {
    setUser(newUser)
  }

  return (
    <Provider store={store}>
      <div className="container mx-auto h-[calc(100vh-4rem)] py-4">
        <div className="h-full border rounded-lg overflow-hidden bg-background">
          {!user ? <UserSetup onUserCreated={handleUserCreated} /> : <ChatInterface />}
        </div>
      </div>
    </Provider>
  )
}
