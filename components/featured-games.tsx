"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { isAdmin } from "@/utils/admin-utils"
import type { Game } from "@/types/game"

interface FeaturedGamesProps {
  games: Game[]
}

export default function FeaturedGames({ games }: FeaturedGamesProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const showViewCounts = isAdmin()

  // If no games are provided, return null
  if (!games || games.length === 0) {
    return null
  }

  // Make sure activeIndex is valid
  const safeActiveIndex = activeIndex < games.length ? activeIndex : 0
  const activeGame = games[safeActiveIndex]

  // Function to get status indicator
  const getStatusIndicator = (game: Game) => {
    if (!game) {
      return { color: "text-white", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
    }

    if (game.isWorking === undefined) {
      return { color: "text-white", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
    } else if (game.isWorking) {
      return { color: "text-green-400", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
    } else {
      return { color: "text-red-400", icon: <XCircle className="h-3 w-3 mr-1" /> }
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-12">
      <div className="md:col-span-2">
        {activeGame && (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

            {/* View count badge - only for admins */}
            {showViewCounts && activeGame.views !== undefined && (
              <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1 text-xs flex items-center z-20">
                <Eye className="h-3 w-3 mr-1" />
                {activeGame.views.toLocaleString()}
              </div>
            )}

            {/* Status indicator */}
            <div
              className={`absolute top-2 left-2 bg-black/60 rounded-full px-2 py-1 text-xs flex items-center z-20 ${getStatusIndicator(activeGame).color}`}
            >
              {getStatusIndicator(activeGame).icon}
              {activeGame.isWorking === undefined ? "Status Unknown" : activeGame.isWorking ? "Working" : "Not Working"}
            </div>

            {/* Placeholder gradient background - will be replaced with actual image */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-900" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold z-5">{activeGame.title}</span>
            </div>

            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
              <h3 className="mb-2 text-2xl font-bold">{activeGame.title}</h3>
              <p className="mb-4 text-sm text-gray-300 line-clamp-2">{activeGame.description}</p>
              <Link
                href={`/game/${activeGame.id}`}
                className="flex w-fit items-center gap-2 rounded-full bg-purple-600 px-4 py-2 font-medium transition-colors hover:bg-purple-700"
              >
                <Play className="h-4 w-4 fill-current" /> Play Now
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {games.map((game, index) => {
          if (!game) return null

          const statusIndicator = getStatusIndicator(game)

          return (
            <motion.div
              key={game.id}
              className={`relative flex cursor-pointer gap-4 rounded-lg p-3 ${
                index === safeActiveIndex ? "bg-purple-900/50" : "bg-gray-800/50 hover:bg-gray-800"
              }`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ x: 5 }}
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center">
                <span className="text-xs font-bold">{game.title.substring(0, 2)}</span>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-medium">{game.title}</h4>
                <div className="flex items-center text-xs">
                  <span className={`flex items-center mr-2 ${statusIndicator.color}`}>{statusIndicator.icon}</span>
                  {game.categories && game.categories.length > 0 && (
                    <span className="text-gray-400">{game.categories[0]}</span>
                  )}
                  {showViewCounts && game.views !== undefined && (
                    <div className="ml-2 flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {game.views.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
