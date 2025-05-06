import Link from "next/link"
import Image from "next/image"
import { CheckCircle, XCircle } from "lucide-react"
import type { Game } from "@/types/game"
import LanguageBadge from "./language-badge"

interface GameCardProps {
  game: Game
  showNewBadge?: boolean
}

export default function GameCard({ game, showNewBadge = false }: GameCardProps) {
  // Check if the game is new (added in the last 7 days)
  const isNew = () => {
    if (!game.dateAdded) return false
    const addedDate = new Date(game.dateAdded)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - addedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  // Get the primary language (first in the list)
  const primaryLanguage = game.languages && game.languages.length > 0 ? game.languages[0] : null

  return (
    <Link href={`/game/${game.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:translate-y-[-5px]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-purple-900 to-gray-900">
          {game.imageUrl ? (
            <Image
              src={game.imageUrl || "/placeholder.svg"}
              alt={game.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-2xl font-bold text-white/70">{game.title.substring(0, 2)}</span>
            </div>
          )}

          {/* Status indicator */}
          {game.isWorking === false && (
            <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          )}

          {/* New badge */}
          {showNewBadge && isNew() && (
            <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              NEW
            </div>
          )}

          {/* Language badge */}
          {primaryLanguage && (
            <div className="absolute bottom-2 left-2">
              <LanguageBadge language={primaryLanguage} />
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-bold text-white group-hover:text-purple-400">{game.title}</h3>
          <div className="mt-1 flex items-center text-xs text-gray-400">
            {game.categories && game.categories.length > 0 ? game.categories[0] : "Game"}
            {game.isWorking !== false && (
              <>
                <span className="mx-1">•</span>
                <span className="flex items-center text-green-400">
                  <CheckCircle className="mr-1 h-3 w-3" /> Working
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
