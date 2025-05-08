"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { likeGame, dislikeGame, unlikeGame, undislikeGame } from "@/actions/game-actions"

interface GameRatingProps {
  gameId: number
  initialLikes: number
  initialDislikes: number
}

export default function GameRating({ gameId, initialLikes, initialDislikes }: GameRatingProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null)

  // Calculate like percentage
  const totalVotes = likes + dislikes
  const likePercentage = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : 0

  // Format numbers with k for thousands
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + " k"
    }
    return num.toString()
  }

  // Check if user has already voted
  useEffect(() => {
    const votes = localStorage.getItem("gameVotes")
    if (votes) {
      const votesObj = JSON.parse(votes)
      if (votesObj[gameId]) {
        setUserVote(votesObj[gameId])
      }
    }
  }, [gameId])

  const handleLike = async () => {
    try {
      // If user already liked, unlike
      if (userVote === "like") {
        const newLikes = await unlikeGame(gameId)
        setLikes(newLikes)
        setUserVote(null)

        // Update localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        delete votesObj[gameId]
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      } else {
        // If user previously disliked, remove that first
        if (userVote === "dislike") {
          const newDislikes = await undislikeGame(gameId)
          setDislikes(newDislikes)
        }

        // Like the game
        const newLikes = await likeGame(gameId)
        setLikes(newLikes)
        setUserVote("like")

        // Save vote to localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        votesObj[gameId] = "like"
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      }
    } catch (error) {
      console.error("Failed to handle like:", error)
    }
  }

  const handleDislike = async () => {
    try {
      // If user already disliked, undislike
      if (userVote === "dislike") {
        const newDislikes = await undislikeGame(gameId)
        setDislikes(newDislikes)
        setUserVote(null)

        // Update localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        delete votesObj[gameId]
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      } else {
        // If user previously liked, remove that first
        if (userVote === "like") {
          const newLikes = await unlikeGame(gameId)
          setLikes(newLikes)
        }

        // Dislike the game
        const newDislikes = await dislikeGame(gameId)
        setDislikes(newDislikes)
        setUserVote("dislike")

        // Save vote to localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        votesObj[gameId] = "dislike"
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      }
    } catch (error) {
      console.error("Failed to handle dislike:", error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-gray-800/80 rounded-full px-1 py-1">
        <button
          onClick={handleLike}
          className={`flex items-center px-2 py-1 rounded-l-full ${userVote === "like" ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
          aria-label="Like game"
        >
          <ThumbsUp size={16} className="mr-1" />
          <span className="text-xs font-medium">{formatNumber(likes)}</span>
        </button>

        <div className="h-4 w-px bg-gray-700 mx-1"></div>

        <button
          onClick={handleDislike}
          className={`flex items-center px-2 py-1 rounded-r-full ${userVote === "dislike" ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
          aria-label="Dislike game"
        >
          <ThumbsDown size={16} className="mr-1" />
          <span className="text-xs font-medium">{formatNumber(dislikes)}</span>
        </button>
      </div>

      <div className="bg-gray-800/80 text-white font-medium text-xs px-2 py-1 rounded-full">{likePercentage}%</div>
    </div>
  )
}
