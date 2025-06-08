"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Music, Users } from "lucide-react"
import type { GameCredit, GameSong } from "@/data/game-credits"

interface GameCreditsProps {
  modCredits?: GameCredit[]
  originalCredits?: GameCredit[]
  additionalInfo?: string
  songs?: GameSong[] | Record<string, GameSong[]>
}

export default function GameCredits({ modCredits, originalCredits, additionalInfo, songs }: GameCreditsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!modCredits && !originalCredits && !songs) {
    return null
  }

  return (
    <div className="mt-4 bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Credits & Info</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-3 pt-0 border-t border-gray-700/50 space-y-3">
          {modCredits && modCredits.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Credits:</h4>
              <div className="text-xs text-gray-400 mb-2">Support the creators on their social media!</div>
              <ul className="text-xs text-gray-300 space-y-1">
                {modCredits.map((credit, index) => (
                  <li key={index}>
                    <span className="font-medium text-white">{credit.name}</span> - {credit.role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {originalCredits && originalCredits.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Original FNF Credits:</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {originalCredits.map((credit, index) => (
                  <li key={index}>
                    <span className="font-medium text-white">{credit.name}</span> - {credit.role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {songs && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Music className="h-3 w-3 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-300">Songs:</h4>
              </div>
              {Array.isArray(songs) ? (
                <ul className="text-xs text-gray-300 space-y-1">
                  {songs.map((song, index) => (
                    <li key={index}>
                      {song.title} {song.week && `(Week ${song.week})`}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                  {Object.entries(songs).map(([week, weekSongs]) => (
                    <div key={week}>
                      <h5 className="text-xs font-medium text-white">{week}:</h5>
                      <ul className="text-xs text-gray-300 space-y-1 ml-2">
                        {weekSongs.map((song, index) => (
                          <li key={index}>• {song.title}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {additionalInfo && (
            <div className="text-xs text-gray-400 italic border-t border-gray-700/50 pt-2">{additionalInfo}</div>
          )}
        </div>
      )}
    </div>
  )
}
