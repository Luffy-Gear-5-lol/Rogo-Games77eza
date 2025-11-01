"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Game } from "@/types/game"

interface FeaturedGamesProps {
  games: Game[]
}

export default function FeaturedGames({ games }: FeaturedGamesProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef(autoplay)

  // Safety check to ensure we have games
  if (!games || games.length === 0) {
    return null
  }

  // Get the active game with a safety check
  const activeGame = games[activeIndex] || games[0]

  // Handle navigation
  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1))
    setAutoplay(false)
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1))
    setAutoplay(false)
  }

  useEffect(() => {
    autoplayRef.current = autoplay
  }, [autoplay])

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (games.length > 0) {
      interval = setInterval(() => {
        if (autoplayRef.current) {
          setActiveIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1))
        }
      }, 5000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [games.length])

  return (
    <div className="mb-12 relative">
      <h2 className="text-2xl font-bold mb-6">Featured Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="transform transition-all duration-300 hover:scale-[1.02]">
            <Card className="overflow-hidden border-0 bg-transparent">
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
                <Image
                  src={game.image || "/placeholder.svg?height=600&width=1400"}
                  alt={game.title}
                  fill
                  priority
                  className="object-cover transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">{game.title}</h3>
                  <p className="text-sm md:text-base text-gray-200 mb-4 max-w-2xl line-clamp-2">{game.description}</p>
                  <Link href={`/games/${game.slug}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700">Play Now</Button>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                  onClick={goToPrevious}
                  aria-label="Previous game"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                  onClick={goToNext}
                  aria-label="Next game"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
