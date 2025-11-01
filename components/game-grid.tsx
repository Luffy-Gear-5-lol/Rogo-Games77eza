import Link from "next/link"
import { Flame } from "lucide-react"
import type { Game } from "@/types/game"
import { Badge } from "@/components/ui/badge"

interface GameGridProps {
  games: Game[]
  showCategories?: boolean
}

export default function GameGrid({ games, showCategories = true }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {games.map((game) => (
        <Link key={game.id} href={`/game/${game.id}`} className="group">
          <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <div className="relative aspect-video overflow-hidden">
              {game.image ? (
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
                  <span className="text-lg font-bold">{game.title.substring(0, 2)}</span>
                </div>
              )}
              {game.popular && (
                <div className="absolute top-2 right-2 bg-orange-600 rounded-full px-2 py-1 text-xs font-bold flex items-center">
                  <Flame className="h-3 w-3 mr-1" />
                  Popular
                </div>
              )}
              {!game.isWorking && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-900/80 py-1 text-center text-xs font-medium">
                  Not Working
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium line-clamp-1 group-hover:text-purple-400">{game.title}</h3>
              {showCategories && game.categories && game.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {game.categories.slice(0, 2).map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {game.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{game.categories.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
