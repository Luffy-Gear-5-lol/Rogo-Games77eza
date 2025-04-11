import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = decodeURIComponent(params.category)
  const categoryGames = games.filter(
    (game) => game.categories && game.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
  )

  if (categoryGames.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{category} Games</h1>
          <p className="mt-2 text-gray-400">
            Browse our collection of {categoryGames.length} {category.toLowerCase()} games
          </p>
        </div>

        <GameGrid games={categoryGames} />
      </div>
    </div>
  )
}
