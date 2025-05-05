"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { likeGame, dislikeGame } from "@/actions/game-actions"

interface GameRatingProps {
  gameId: number
  initialLikes: number
  initialDislikes: number
}

export default function GameRating({ gameId, initialLikes, initialDislikes }: GameRatingProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [hasVoted, setHasVoted] = useState(false)

  // Check if user has already voted
  useEffect(() => {
    const votedGames = JSON.parse(localStorage.getItem("votedGames") || "{}")
    if (votedGames[gameId]) {
      setHasVoted(true)
    }
  }, [gameId])

  const handleLike = async () => {
    if (hasVoted) return

    try {
      await likeGame(gameId)
      setLikes(likes + 1)
      setHasVoted(true)

      // Save vote to localStorage
      const votedGames = JSON.parse(localStorage.getItem("votedGames") || "{}")
      votedGames[gameId] = "like"
      localStorage.setItem("votedGames", JSON.stringify(votedGames))
    } catch (error) {
      console.error("Failed to like game:", error)
    }
  }

  const handleDislike = async () => {
    if (hasVoted) return

    try {
      await dislikeGame(gameId)
      setDislikes(dislikes + 1)
      setHasVoted(true)

      // Save vote to localStorage
      const votedGames = JSON.parse(localStorage.getItem("votedGames") || "{}")
      votedGames[gameId] = "dislike"
      localStorage.setItem("votedGames", JSON.stringify(votedGames))
    } catch (error) {
      console.error("Failed to dislike game:", error)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleLike}
        disabled={hasVoted}
        className={`flex items-center space-x-1 ${hasVoted ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500"}`}
        aria-label="Like game"
      >
        <ThumbsUp size={20} />
        <span>{likes}</span>
      </button>

      <button
        onClick={handleDislike}
        disabled={hasVoted}
        className={`flex items-center space-x-1 ${hasVoted ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"}`}
        aria-label="Dislike game"
      >
        <ThumbsDown size={20} />
        <span>{dislikes}</span>
      </button>
    </div>
  )
}
