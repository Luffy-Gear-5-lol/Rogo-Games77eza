import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"

export default function FNFCategoryPage() {
  // Filter games that have "FNF" or "Friday Night Funkin" in the title or categories
  const fnfGames = games
    .filter(
      (game) =>
        game.title.toLowerCase().includes("fnf") ||
        game.title.toLowerCase().includes("friday night funkin") ||
        (game.categories &&
          game.categories.some(
            (cat) =>
              cat.toLowerCase() === "fnf" ||
              cat.toLowerCase() === "friday night funkin" ||
              cat.toLowerCase() === "rhythm" ||
              cat.toLowerCase() === "music",
          )),
    )
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Friday Night Funkin' Games</h1>
          <p className="mt-2 text-gray-400">All FNF games and mods in our collection</p>
        </div>

        {fnfGames.length > 0 ? (
          <GameGrid games={fnfGames} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No FNF games found</h2>
            <p className="text-gray-400">Check back later for more games</p>
          </div>
        )}
      </div>
    </div>
  )
}
