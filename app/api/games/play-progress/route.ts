import { kv } from "@vercel/kv"
import { type NextRequest, NextResponse } from "next/server"

interface GamePlayRecord {
  gameId: number
  playedAt: string
  duration?: number
}

interface UserGameProgress {
  totalGamesPlayed: number
  uniqueGames: Set<number>
  gamesHistory: GamePlayRecord[]
}

// GET: Retrieve a user's game play history
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const gameId = searchParams.get("gameId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    if (gameId) {
      // Get play history for a specific game
      const key = `user:${userId}:game:${gameId}`
      const history = await kv.get<GamePlayRecord[]>(key)
      return NextResponse.json({ gameId: Number(gameId), playHistory: history || [] })
    }

    // Get all games play history for user
    const key = `user:${userId}:games`
    const gamesData = await kv.get<UserGameProgress>(key)

    return NextResponse.json({
      totalGamesPlayed: gamesData?.totalGamesPlayed || 0,
      uniqueGames: gamesData?.uniqueGames ? Array.from(gamesData.uniqueGames) : [],
      recentGames: gamesData?.gamesHistory?.slice(0, 10) || [],
    })
  } catch (error) {
    console.error("Error fetching game progress:", error)
    return NextResponse.json({ error: "Failed to fetch game progress" }, { status: 500 })
  }
}

// POST: Mark a game as played
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, gameId, duration } = body

    if (!userId || !gameId) {
      return NextResponse.json({ error: "userId and gameId are required" }, { status: 400 })
    }

    // Record individual game play
    const gameKey = `user:${userId}:game:${gameId}`
    const existingHistory = await kv.get<GamePlayRecord[]>(gameKey)
    const newRecord: GamePlayRecord = {
      gameId,
      playedAt: new Date().toISOString(),
      duration,
    }

    const updatedHistory = [...(existingHistory || []), newRecord].slice(-100) // Keep last 100 plays
    await kv.set(gameKey, updatedHistory, { ex: 90 * 24 * 60 * 60 }) // 90 days expiry

    // Update user's overall progress
    const userKey = `user:${userId}:games`
    const userData = await kv.get<UserGameProgress>(userKey)
    const uniqueGames = new Set(userData?.uniqueGames || [])
    uniqueGames.add(gameId)

    const updatedProgress: UserGameProgress = {
      totalGamesPlayed: (userData?.totalGamesPlayed || 0) + 1,
      uniqueGames,
      gamesHistory: [...(userData?.gamesHistory || []), newRecord].slice(-50),
    }

    await kv.set(userKey, updatedProgress, { ex: 90 * 24 * 60 * 60 })

    return NextResponse.json({
      success: true,
      totalPlayed: updatedProgress.totalGamesPlayed,
      uniqueGamesCount: uniqueGames.size,
    })
  } catch (error) {
    console.error("Error updating game progress:", error)
    return NextResponse.json({ error: "Failed to update game progress" }, { status: 500 })
  }
}

// DELETE: Clear a user's game play history
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const gameId = searchParams.get("gameId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    if (gameId) {
      // Clear history for specific game
      const key = `user:${userId}:game:${gameId}`
      await kv.del(key)
      return NextResponse.json({ success: true, message: "Game history cleared" })
    }

    // Clear all game history
    const userKey = `user:${userId}:games`
    await kv.del(userKey)
    return NextResponse.json({ success: true, message: "All game history cleared" })
  } catch (error) {
    console.error("Error clearing game progress:", error)
    return NextResponse.json({ error: "Failed to clear game progress" }, { status: 500 })
  }
}
