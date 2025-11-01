"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import ChatInterface from "@/components/chat-interface"
import UserSetup from "@/components/user-setup"

export default function ChatPage() {
  return (
    <Provider store={store}>
      <div className="container mx-auto h-[calc(100vh-4rem)] py-4">
        <div className="h-full border rounded-lg overflow-hidden bg-background">
          <UserSetup>
            <ChatInterface />
          </UserSetup>
        </div>
      </div>
    </Provider>
  )
}
