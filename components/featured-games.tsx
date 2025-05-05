"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Game } from "@/types/game"

interface FeaturedGamesProps {
  games: Game[]
}

export default function FeaturedGames({ games = [] }: FeaturedGamesProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Safety check - if no games are provided, don't render anything
  if (!games || games.length === 0) {
    return null
  }

  const activeGame = games[activeIndex] || games[0]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % games.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + games.length) % games.length)
  }

  return (
    <div className="mb-12 relative">
      <h2 className="text-2xl font-bold mb-6">Featured Games</h2>
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          {activeGame && activeGame.image && (
            <Image
              src={activeGame.image || "/placeholder.svg"}
              alt={activeGame.title}
              fill
              className="object-cover opacity-30"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-6">
          <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{activeGame?.title || "Featured Game"}</h3>
            <p className="text-gray-300 mb-6 line-clamp-3">{activeGame?.description || "Game description"}</p>
            <Link href={`/game/${activeGame?.id || 1}`}>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Play Now
              </Button>
            </Link>
          </div>

          <div className="md:w-1/3 relative h-[200px] md:h-[300px] w-full md:w-[300px]">
            {activeGame && activeGame.image && (
              <Image
                src={activeGame.image || "/placeholder.svg"}
                alt={activeGame.title}
                fill
                className="object-contain rounded-lg"
                priority
              />
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        {games.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full z-20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full z-20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Indicators */}
        {games.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {games.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex ? "bg-white" : "bg-gray-500"
                } transition-colors`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
