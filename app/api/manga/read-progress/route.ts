import { kv } from "@vercel/kv"
import { type NextRequest, NextResponse } from "next/server"

interface ReadProgress {
  mangaId: number
  lastReadChapter: number
  readChapters: number[]
  lastReadAt: string
}

// GET - Fetch read progress for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mangaId = searchParams.get("mangaId")
    const userId = searchParams.get("userId") || "anonymous"

    if (!mangaId) {
      return NextResponse.json({ error: "Missing mangaId" }, { status: 400 })
    }

    const key = `manga:${mangaId}:user:${userId}`
    const progress = await kv.get<ReadProgress>(key)

    return NextResponse.json({
      success: true,
      data: progress || {
        mangaId: Number.parseInt(mangaId),
        lastReadChapter: 0,
        readChapters: [],
        lastReadAt: null,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching read progress:", error)
    return NextResponse.json({ error: "Failed to fetch read progress" }, { status: 500 })
  }
}

// POST - Mark a chapter as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mangaId, chapterNumber, userId = "anonymous" } = body

    if (mangaId === undefined || chapterNumber === undefined) {
      return NextResponse.json({ error: "Missing mangaId or chapterNumber" }, { status: 400 })
    }

    const key = `manga:${mangaId}:user:${userId}`
    const currentProgress = (await kv.get<ReadProgress>(key)) || {
      mangaId,
      lastReadChapter: 0,
      readChapters: [],
      lastReadAt: null,
    }

    // Add chapter to read chapters if not already there
    if (!currentProgress.readChapters.includes(chapterNumber)) {
      currentProgress.readChapters.push(chapterNumber)
    }

    // Update last read chapter
    currentProgress.lastReadChapter = Math.max(currentProgress.lastReadChapter, chapterNumber)
    currentProgress.lastReadAt = new Date().toISOString()

    // Store in Redis with 90-day expiration
    await kv.setex(key, 90 * 24 * 60 * 60, currentProgress)

    return NextResponse.json({
      success: true,
      data: currentProgress,
    })
  } catch (error) {
    console.error("[v0] Error marking chapter as read:", error)
    return NextResponse.json({ error: "Failed to mark chapter as read" }, { status: 500 })
  }
}

// DELETE - Clear read progress for a manga
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mangaId = searchParams.get("mangaId")
    const userId = searchParams.get("userId") || "anonymous"

    if (!mangaId) {
      return NextResponse.json({ error: "Missing mangaId" }, { status: 400 })
    }

    const key = `manga:${mangaId}:user:${userId}`
    await kv.del(key)

    return NextResponse.json({
      success: true,
      message: "Read progress cleared",
    })
  } catch (error) {
    console.error("[v0] Error clearing read progress:", error)
    return NextResponse.json({ error: "Failed to clear read progress" }, { status: 500 })
  }
}
