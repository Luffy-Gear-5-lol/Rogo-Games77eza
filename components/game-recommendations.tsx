"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { games } from "@/data/games"

export default function GameRecommendations() {
  const [recommendedGames, setRecommendedGames] = useState<typeof games>([])

  useEffect(() => {
    // Get recently played games
    const recent = localStorage.getItem("recentlyPlayed")
    if (recent) {
      const recentIds = JSON.parse(recent) as number[]
      const recentGamesList = recentIds.map((id) => games.find((g) => g.id === id)).filter(Boolean) as typeof games

      if (recentGamesList.length > 0) {
        // Get categories from recently played games
        const recentCategories = new Set<string>()
        recentGamesList.forEach((game) => {
          if (game.categories) {
            game.categories.forEach((cat) => recentCategories.add(cat.toLowerCase()))
          }
        })

        // Find games with similar categories that haven't been played recently
        const similarGames = games.filter(
          (game) =>
            !recentIds.includes(game.id) &&
            game.categories &&
            game.categories.some((cat) => recentCategories.has(cat.toLowerCase())),
        )

        // Shuffle and take up to 5
        const shuffled = [...similarGames].sort(() => 0.5 - Math.random())
        setRecommendedGames(shuffled.slice(0, 5))
      } else {
        // If no recent games, show random popular games
        const popularGames = games.filter((game) => game.popular)
        const shuffled = [...popularGames].sort(() => 0.5 - Math.random())
        setRecommendedGames(shuffled.slice(0, 5))
      }
    } else {
      // If no recent games, show random popular games
      const popularGames = games.filter((game) => game.popular)
      const shuffled = [...popularGames].sort(() => 0.5 - Math.random())
      setRecommendedGames(shuffled.slice(0, 5))
    }
  }, [])

  if (recommendedGames.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {recommendedGames.map((game) => (
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
