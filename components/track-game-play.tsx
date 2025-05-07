"use client"

import { useEffect } from "react"
import { addToRecentlyPlayed } from "@/utils/recently-played-utils"

interface TrackGamePlayProps {
  gameId: number
}

export default function TrackGamePlay({ gameId }: TrackGamePlayProps) {
  useEffect(() => {
    // Add the game to recently played when the component mounts
    addToRecentlyPlayed(gameId)
  }, [gameId])

  // This component doesn't render anything
  return null
}
