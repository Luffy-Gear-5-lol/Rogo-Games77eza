"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { games } from "@/data/games"
import { Clock } from "lucide-react"

export default function RecentlyPlayed() {
  const [recentGames, setRecentGames] = useState<typeof games>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get recently played games from localStorage
    const recent = localStorage.getItem("recentlyPlayed")

    if (recent) {
      try {
        const recentIds = JSON.parse(recent) as number[]
        // Get the games in the correct order (most recent first)
        const recentGamesList = recentIds.map((id) => games.find((g) => g.id === id)).filter(Boolean) as typeof games

        setRecentGames(recentGamesList)
      } catch (error) {
        console.error("Error parsing recently played games:", error)
        // Reset recently played if there's an error
        localStorage.setItem("recentlyPlayed", JSON.stringify([]))
      }
    }

    setIsLoading(false)
  }, [])

  // If loading or no recent games, don't render anything
  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-400" />
          Recently Played
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (recentGames.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-400" />
          Recently Played
        </h2>
        <div className="p-6 text-center border border-gray-800 rounded-lg bg-gray-900/50">
          <p className="text-gray-400">No recently played games yet.</p>
          <p className="text-gray-500 text-sm mt-2">Games you play will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Clock className="mr-2 h-5 w-5 text-blue-400" />
        Recently Played
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {recentGames.map((game) => (
          <Link key={game.id} href={`/games/${game.slug}`} className="group">
            <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={game.image || "/placeholder.svg?height=200&width=350"}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate group-hover:text-purple-400">{game.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
