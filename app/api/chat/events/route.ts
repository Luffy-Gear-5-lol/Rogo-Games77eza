import type { NextRequest } from "next/server"
import { chatServer } from "@/lib/chat-server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const connectionId =
    searchParams.get("connectionId") || `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected", connectionId })}\n\n`))

      // Create a mock response object for the chat server
      const mockResponse = {
        body: {
          getWriter: () => ({
            write: (chunk: Uint8Array) => {
              try {
                controller.enqueue(chunk)
              } catch (error) {
                console.error("Stream write error:", error)
              }
            },
          }),
        },
      } as Response

      // Add connection to chat server
      chatServer.addConnection(connectionId, mockResponse)

      // Send periodic heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`),
          )
        } catch (error) {
          console.error("Heartbeat error:", error)
          clearInterval(heartbeat)
        }
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        chatServer.removeConnection(connectionId)
        try {
          controller.close()
        } catch (error) {
          console.error("Stream close error:", error)
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
