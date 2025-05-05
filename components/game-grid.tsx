import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Game } from "@/types/game"

interface GameGridProps {
  games: Game[]
  title?: string
}

export default function GameGrid({ games = [], title }: GameGridProps) {
  // Safety check - if no games are provided, show a message
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No games available</h3>
        <p className="text-gray-400 mt-2">Check back later for new games!</p>
      </div>
    )
  }

  return (
    <div className="mb-12">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {games.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`}>
            <Card className="overflow-hidden h-full transition-transform hover:scale-105 hover:shadow-xl bg-gray-800 border-gray-700">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={game.image || "/placeholder.svg?height=300&width=200"}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
                {game.popular && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                {!game.isWorking && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-bold">Coming Soon</span>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{game.title}</h3>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {game.categories?.slice(0, 2).join(" • ") || "Game"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
