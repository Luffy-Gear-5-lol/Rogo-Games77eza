"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { games } from "@/data/games"
import { Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentlyPlayedEntry {
  id: number
  timestamp: number
}

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

export default function RecentlyPlayed() {
  const [recentGames, setRecentGames] = useState<typeof games>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasExpired, setHasExpired] = useState(false)

  useEffect(() => {
    const recent = localStorage.getItem("recentlyPlayedWithTime")

    if (recent) {
      try {
        const recentEntries = JSON.parse(recent) as RecentlyPlayedEntry[]
        const now = Date.now()
        
        // Filter out entries older than 2 weeks
        const validEntries = recentEntries.filter(entry => now - entry.timestamp < TWO_WEEKS_MS)
        
        if (validEntries.length === 0 && recentEntries.length > 0) {
          setHasExpired(true)
        }
        
        // Update localStorage with only valid entries
        localStorage.setItem("recentlyPlayedWithTime", JSON.stringify(validEntries))
        
        // Get the games in the correct order (most recent first)
        const recentGamesList = validEntries
          .map((entry) => games.find((g) => g.id === entry.id))
          .filter(Boolean) as typeof games

        setRecentGames(recentGamesList.slice(0, 10))
      } catch (error) {
        console.error("Error parsing recently played games:", error)
        localStorage.setItem("recentlyPlayedWithTime", JSON.stringify([]))
      }
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div>
        <h2 className="section-header mb-6">
          <Clock className="h-5 w-5 text-blue-500" />
          <span>Recently Played</span>
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (recentGames.length === 0) {
    return (
      <div>
        <h2 className="section-header mb-6">
          <Clock className="h-5 w-5 text-blue-500" />
          <span>Recently Played</span>
        </h2>
        <div className="p-8 text-center rounded-xl bg-card border border-border">
          {hasExpired ? (
            <>
              <p className="text-foreground font-medium">No games played recently</p>
              <p className="text-muted-foreground text-sm mt-2">Your history was cleared after 2 weeks of inactivity.</p>
            </>
          ) : (
            <>
              <p className="text-foreground font-medium">No recently played games yet</p>
              <p className="text-muted-foreground text-sm mt-2">Games you play will appear here for 2 weeks.</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="section-header mb-6">
        <Clock className="h-5 w-5 text-blue-500" />
        <span>Recently Played</span>
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {recentGames.map((game) => (
          <Link key={game.id} href={`/games/${game.slug}`} className="group">
            <div className="game-card overflow-hidden rounded-xl bg-card border border-border relative">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={game.image || "/placeholder.svg?height=200&width=350"}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {/* Play overlay */}
                <div className="play-overlay">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full">
                    <Play className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="game-card-title text-sm truncate group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Utility function to add a game to recently played (call this when a game is played)
export function addToRecentlyPlayed(gameId: number) {
  if (typeof window === "undefined") return
  
  const recent = localStorage.getItem("recentlyPlayedWithTime")
  let entries: RecentlyPlayedEntry[] = []
  
  if (recent) {
    try {
      entries = JSON.parse(recent) as RecentlyPlayedEntry[]
    } catch {
      entries = []
    }
  }
  
  // Remove existing entry for this game
  entries = entries.filter(entry => entry.id !== gameId)
  
  // Add new entry at the beginning
  entries.unshift({ id: gameId, timestamp: Date.now() })
  
  // Keep only last 20 entries
  entries = entries.slice(0, 20)
  
  localStorage.setItem("recentlyPlayedWithTime", JSON.stringify(entries))
}
