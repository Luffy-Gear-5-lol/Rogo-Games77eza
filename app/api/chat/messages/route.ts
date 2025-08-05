import { type NextRequest, NextResponse } from "next/server"
import { chatServer } from "@/lib/chat-server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get("channel")

  if (!channel) {
    return NextResponse.json({ error: "Channel is required" }, { status: 400 })
  }

  try {
    const messages = chatServer.getMessages(channel)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error getting messages:", error)
    return NextResponse.json({ error: "Failed to get messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, username, avatar, text, channel } = body

    if (!userId || !username || !text || !channel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const message = chatServer.addMessage({
      userId,
      username,
      avatar,
      text,
      channel,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })

    // Update user activity
    chatServer.updateUserActivity(userId)

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error posting message:", error)
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 })
  }
}
