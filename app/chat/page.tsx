"use client"
import type { FilterLevel } from "@/utils/profanity-filter"
import ChatInterface from "@/components/chat-interface"

interface Channel {
  id: string
  name: string
  filterLevel: FilterLevel
  description: string
}

export default function ChatPage() {
  return <ChatInterface />
}
