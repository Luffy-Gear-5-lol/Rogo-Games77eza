import Link from "next/link"
import { ArrowLeft, Grid } from "lucide-react"
import { games } from "@/data/games"
import GameGrid from "@/components/game-grid"
import { sortGames } from "@/utils/sort-utils"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  const categories = Array.from(new Set(games.flatMap((game) => game.categories || [])))
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }))
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  // Find the original category with correct casing
  const originalCategory = Array.from(new Set(games.flatMap((game) => game.categories || []))).find(
    (cat) => cat.toLowerCase() === category.toLowerCase(),
  )

  if (!originalCategory) {
    notFound()
  }

  // Filter games by category
  const categoryGames = games.filter((game) =>
    game.categories?.some((cat) => cat.toLowerCase() === category.toLowerCase()),
  )

  // Sort the games
  const sortedGames = sortGames(categoryGames)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/categories" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Grid className="mr-2 h-6 w-6" />
            {originalCategory} Games
          </h1>
          <p className="mt-2 text-gray-400">
            {sortedGames.length} {sortedGames.length === 1 ? "game" : "games"} in this category
          </p>
        </div>

        {sortedGames.length > 0 ? (
          <GameGrid games={sortedGames} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No games found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
