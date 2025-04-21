import Image from "next/image"
import Link from "next/link"
import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/types/game"

interface FeaturedGameProps {
  game: Game
}

export default function FeaturedGame({ game }: FeaturedGameProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
      <div className="relative aspect-[21/9] w-full">
        <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
      </div>
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="px-6 py-4 sm:px-10 sm:py-6 md:max-w-2xl">
          <Badge className="mb-2 bg-purple-600 hover:bg-purple-700">{game.category}</Badge>
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">{game.title}</h2>
          <div className="mb-4 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < game.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-300">{game.rating.toFixed(1)}</span>
          </div>
          <p className="mb-6 text-gray-300 line-clamp-3">{game.description}</p>
          <div className="flex gap-4">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Play className="mr-2 h-4 w-4 fill-current" /> Play Now
            </Button>
            <Link href={`/games/${game.slug}`}>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
