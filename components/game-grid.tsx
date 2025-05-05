"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { isAdmin } from "@/utils/admin-utils"
import type { Game } from "@/types/game"

interface GameGridProps {
  games: Game[]
}

export default function GameGrid({ games = [] }: GameGridProps) {
  const [hoveredGame, setHoveredGame] = useState<number | null>(null)
  const showViewCounts = isAdmin()

  // If no games are provided, show a message
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">No Games Found</h3>
        <p className="text-gray-400">Check back later for more games</p>
      </div>
    )
  }

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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {games.map((game) => {
        if (!game) return null

        // Determine the link based on whether it's a Papa's game
        const gameLink = game.series === "papas" ? "/series/papas" : `/game/${game.id}`
        const statusIndicator = getStatusIndicator(game)

        return (
          <Link
            key={game.id}
            href={gameLink}
            className="group"
            onMouseEnter={() => setHoveredGame(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
          >
            <motion.div
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-800"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* View count badge - only for admins */}
              {showViewCounts && game.views !== undefined && (
                <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1 text-xs flex items-center z-10">
                  <Eye className="h-3 w-3 mr-1" />
                  {game.views.toLocaleString()}
                </div>
              )}

              {/* Status indicator */}
              <div
                className={`absolute top-2 left-2 bg-black/60 rounded-full px-2 py-1 text-xs flex items-center z-10 ${statusIndicator.color}`}
              >
                {statusIndicator.icon}
              </div>

              {/* Placeholder for game image - will be replaced with actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{game.title}</span>
              </div>

              {hoveredGame === game.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 transition-opacity">
                  <span className="rounded-full bg-purple-600 px-4 py-2 font-medium flex items-center">
                    <Play className="mr-2 h-4 w-4 fill-current" /> Play Now
                  </span>
                </div>
              )}
            </motion.div>
            <h3 className="mt-2 text-center text-sm font-medium group-hover:text-purple-400">{game.title}</h3>
            <p className="text-center text-xs text-gray-500">
              {game.categories && game.categories.length > 0 ? game.categories[0] : ""}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
