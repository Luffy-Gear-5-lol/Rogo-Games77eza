"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { games } from "@/data/games"

export default function RecentlyPlayed() {
  const [recentGames, setRecentGames] = useState<typeof games>([])

  useEffect(() => {
    const recent = localStorage.getItem("recentlyPlayed")
    if (recent) {
      const recentIds = JSON.parse(recent) as number[]
      const recentGamesList = recentIds.map((id) => games.find((g) => g.id === id)).filter(Boolean) as typeof games

      setRecentGames(recentGamesList)
    }
  }, [])

  if (recentGames.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
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
