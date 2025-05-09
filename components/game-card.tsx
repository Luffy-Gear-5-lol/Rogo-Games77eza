import Image from "next/image"
import Link from "next/link"
import { Play, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isAdmin } from "@/utils/admin-utils"
import type { Game } from "@/types/game"
import GameRating from "./game-rating"

// Update the GameCardProps interface to include an isNew property
interface GameCardProps {
  game: Game
  isNew?: boolean
}

// Update the function signature to include the isNew prop with a default value of false
export default function GameCard({ game, isNew = false }: GameCardProps) {
  // Determine the link based on whether it's a Papa's game
  const gameLink = game.series === "papas" ? "/series/papas" : `/games/${game.slug}`
  const showViewCount = isAdmin() && game.views !== undefined

  // Determine status color and icon
  const getStatusIndicator = () => {
    if (game.isWorking === undefined) {
      return { color: "text-white", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
    } else if (game.isWorking) {
      return { color: "text-green-400", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
    } else {
      return { color: "text-red-400", icon: <XCircle className="h-3 w-3 mr-1" /> }
    }
  }

  const statusIndicator = getStatusIndicator()

  // Use a default placeholder if no image is provided
  const imageSrc = game.image || "/placeholder.svg?height=200&width=350"

  return (
    <Card className="overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20 group">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={game.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {showViewCount && (
          <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1 text-xs flex items-center z-10">
            <Eye className="h-3 w-3 mr-1" />
            {game.views.toLocaleString()}
          </div>
        )}
        {game.popular && (
          <div className="absolute top-2 left-2 bg-red-500 text-white rounded-full px-3 py-1 text-xs font-bold z-10">
            Popular
          </div>
        )}
        {isNew && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white rounded-full px-3 py-1 text-xs font-bold z-10">
            New
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity hover:opacity-100">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            {game.categories && game.categories.length > 0 && (
              <Badge variant="secondary" className="bg-purple-600 hover:bg-purple-700">
                {game.categories[0]}
              </Badge>
            )}
            <Button size="sm" className="rounded-full bg-white text-black hover:bg-gray-200" data-game-id={game.id}>
              <Play className="h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col h-[120px]">
        <Link href={gameLink}>
          <h3 className="mb-1 font-bold hover:text-purple-400">{game.title}</h3>
        </Link>
        <div className="flex items-center mb-2">
          <span className={`text-xs flex items-center ${statusIndicator.color}`}>
            {statusIndicator.icon}
            {game.isWorking === undefined ? "Status Unknown" : game.isWorking ? "Working" : "Not Working"}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{game.description}</p>
        {game.categories && game.categories.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {game.categories.slice(1).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        )}
        {/* Game rating */}
        <div className="mt-2">
          <GameRating gameId={game.id} initialLikes={game.likes || 0} initialDislikes={game.dislikes || 0} />
        </div>
        {game.views !== undefined && (
          <div className="mt-auto pt-2 text-xs text-gray-500 flex items-center">
            <Eye className="h-3 w-3 mr-1 inline" />
            {game.views.toLocaleString()} views
          </div>
        )}
      </CardContent>
    </Card>
  )
}
