"use client"

import useSWR from "swr"
import { useEffect, useState } from "react"

interface GamePlayRecord {
  gameId: number
  playedAt: string
  duration?: number
}

interface GameProgressData {
  totalGamesPlayed: number
  uniqueGames: number[]
  recentGames: GamePlayRecord[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useGameProgress(userId?: string) {
  const [localUserId, setLocalUserId] = useState<string | null>(null)

  // Generate or retrieve a session user ID
  useEffect(() => {
    let id = localStorage.getItem("gameSessionId")
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("gameSessionId", id)
    }
    setLocalUserId(userId || id)
  }, [userId])

  const { data, error, isLoading, mutate } = useSWR(
    localUserId ? `/api/games/play-progress?userId=${localUserId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  )

  // Mark a game as played
  const recordGamePlay = async (gameId: number, duration?: number) => {
    if (!localUserId) return

    try {
      const response = await fetch(`/api/games/play-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: localUserId, gameId, duration }),
      })

      if (response.ok) {
        // Refresh the progress data
        mutate()
        return await response.json()
      }
    } catch (error) {
      console.error("Error recording game play:", error)
    }
  }

  // Check if user has played a specific game
  const hasPlayedGame = (gameId: number): boolean => {
    return data?.uniqueGames?.includes(gameId) || false
  }

  // Get play count for a specific game
  const getGamePlayCount = (gameId: number): number => {
    return data?.recentGames?.filter((g) => g.gameId === gameId).length || 0
  }

  // Clear history
  const clearHistory = async (gameId?: number) => {
    if (!localUserId) return

    try {
      const url = gameId
        ? `/api/games/play-progress?userId=${localUserId}&gameId=${gameId}`
        : `/api/games/play-progress?userId=${localUserId}`

      const response = await fetch(url, { method: "DELETE" })

      if (response.ok) {
        mutate()
        return await response.json()
      }
    } catch (error) {
      console.error("Error clearing game history:", error)
    }
  }

  return {
    totalGamesPlayed: data?.totalGamesPlayed || 0,
    uniqueGamesCount: data?.uniqueGames?.length || 0,
    recentGames: data?.recentGames || [],
    isLoading,
    error,
    recordGamePlay,
    hasPlayedGame,
    getGamePlayCount,
    clearHistory,
  }
}
