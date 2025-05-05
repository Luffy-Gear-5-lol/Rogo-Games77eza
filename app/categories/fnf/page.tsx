import Link from "next/link"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import { games } from "@/data/games"
import GameGrid from "@/components/game-grid"
import { sortGames } from "@/utils/sort-utils"

export default function FNFCategoryPage() {
  // Filter games with "FNF" in the title or in the categories
  const fnfGames = games.filter(
    (game) =>
      game.title.toLowerCase().includes("fnf") ||
      game.categories?.some((cat) => cat.toLowerCase() === "fnf") ||
      game.title.toLowerCase().includes("friday night funkin"),
  )

  // Sort the games
  const sortedGames = sortGames(fnfGames)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/categories" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Gamepad2 className="mr-2 h-6 w-6" />
            Friday Night Funkin' Games
          </h1>
          <p className="mt-2 text-gray-400">
            {sortedGames.length} {sortedGames.length === 1 ? "game" : "games"} in this category
          </p>
        </div>

        {sortedGames.length > 0 ? (
          <GameGrid games={sortedGames} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No FNF games found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
