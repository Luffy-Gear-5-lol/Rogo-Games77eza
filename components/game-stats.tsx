"use client"

import { useGameProgress } from "@/hooks/use-game-progress"
import { Trophy, Zap, Clock } from "lucide-react"

export default function GameStats() {
  const { totalGamesPlayed, uniqueGamesCount, isLoading } = useGameProgress()

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Games Played</p>
            <p className="text-3xl font-bold text-purple-400">{totalGamesPlayed || 0}</p>
          </div>
          <Zap className="h-8 w-8 text-purple-500 opacity-50" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Unique Games</p>
            <p className="text-3xl font-bold text-blue-400">{uniqueGamesCount || 0}</p>
          </div>
          <Trophy className="h-8 w-8 text-blue-500 opacity-50" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border border-cyan-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Streak</p>
            <p className="text-3xl font-bold text-cyan-400">Active</p>
          </div>
          <Clock className="h-8 w-8 text-cyan-500 opacity-50" />
        </div>
      </div>
    </div>
  )
}
