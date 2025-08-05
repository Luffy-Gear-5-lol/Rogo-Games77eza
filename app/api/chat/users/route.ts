import { type NextRequest, NextResponse } from "next/server"
import { chatServer } from "@/lib/chat-server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get("channel")

  try {
    const users = chatServer.getOnlineUsers(channel || undefined)
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error getting users:", error)
    return NextResponse.json({ error: "Failed to get users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, username, avatar, channel, connectionId } = body

    if (!userId || !username || !channel || !connectionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    chatServer.addUser(
      {
        id: userId,
        username,
        avatar,
        channel,
      },
      connectionId,
    )

    const users = chatServer.getOnlineUsers(channel)
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error adding user:", error)
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    chatServer.removeUser(userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing user:", error)
    return NextResponse.json({ error: "Failed to remove user" }, { status: 500 })
  }
}
