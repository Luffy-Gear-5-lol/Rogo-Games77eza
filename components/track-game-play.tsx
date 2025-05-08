"use client"

import { useEffect, useCallback } from "react"
import { addToRecentlyPlayed } from "@/utils/recently-played-utils"

interface TrackGamePlayProps {
  gameId: number
  onPlay?: () => void
}

export default function TrackGamePlay({ gameId, onPlay }: TrackGamePlayProps) {
  const trackPlay = useCallback(() => {
    // Add the game to recently played when played
    addToRecentlyPlayed(gameId)
    if (onPlay) onPlay()
  }, [gameId, onPlay])

  useEffect(() => {
    // Find all play buttons for this game
    const playButtons = document.querySelectorAll(`[data-game-id="${gameId}"]`)

    // Add click event listeners to track plays
    playButtons.forEach((button) => {
      button.addEventListener("click", trackPlay)
    })

    // Cleanup
    return () => {
      playButtons.forEach((button) => {
        button.removeEventListener("click", trackPlay)
      })
    }
  }, [gameId, trackPlay])

  // This component doesn't render anything
  return null
}
