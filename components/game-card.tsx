import Image from "next/image"
import Link from "next/link"
import { Play, Eye, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/types/game"
import GameRating from "./game-rating"

interface GameCardProps {
  game: Game
  isNew?: boolean
}

export default function GameCard({ game, isNew = false }: GameCardProps) {
  const gameLink = game.series === "papas" ? "/series/papas" : `/games/${game.slug}`
  const imageSrc = game.image || "/placeholder.svg?height=200&width=350"

  // Status indicator - simplified: green = working, yellow/orange = might work for some
  const getStatusIndicator = () => {
    if (game.isWorking === undefined) {
      return { color: "text-yellow-400", icon: <AlertTriangle className="h-3 w-3" />, text: "May work for some" }
    } else if (game.isWorking) {
      return { color: "text-green-400", icon: <CheckCircle className="h-3 w-3" />, text: "Working" }
    } else {
      return { color: "text-orange-400", icon: <AlertTriangle className="h-3 w-3" />, text: "May be blocked" }
    }
  }

  const status = getStatusIndicator()

  return (
    <Card className="game-card overflow-hidden bg-card border-border group relative">
      <Link href={gameLink} className="block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageSrc}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* View counter - always visible */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center z-10 text-white">
            <Eye className="h-3 w-3 mr-1" />
            {(game.views || 0).toLocaleString()}
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {game.popular && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs font-bold">
                Popular
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs font-bold">
                New
              </Badge>
            )}
          </div>
          
          {/* Play Now overlay - appears on hover */}
          <div className="play-overlay">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-full shadow-lg shadow-primary/50"
            >
              <Play className="h-5 w-5 mr-2 fill-current" />
              Play Now
            </Button>
          </div>
          
          {/* Bottom gradient for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>
        
        <CardContent className="p-4">
          {/* Game title - bright and readable */}
          <h3 className="game-card-title text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {game.title}
          </h3>
          
          {/* Status indicator */}
          <div className="flex items-center gap-1 mb-2">
            <span className={`text-xs flex items-center gap-1 ${status.color}`}>
              {status.icon}
              {status.text}
            </span>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{game.description}</p>
          
          {/* Categories */}
          {game.categories && game.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {game.categories.slice(0, 2).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                  {category}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Rating */}
          <div className="mt-auto">
            <GameRating gameId={game.id} initialLikes={game.likes || 0} initialDislikes={game.dislikes || 0} />
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
