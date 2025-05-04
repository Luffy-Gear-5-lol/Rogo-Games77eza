import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"

export default function SonicCategoryPage() {
  // Filter games that have "Sonic" in the title
  const sonicGames = games
    .filter(
      (game) =>
        game.title.toLowerCase().includes("sonic") ||
        (game.categories && game.categories.some((cat) => cat.toLowerCase() === "sonic")),
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
          <h1 className="text-3xl font-bold">Sonic Games</h1>
          <p className="mt-2 text-gray-400">All Sonic games in our collection</p>
        </div>

        {sonicGames.length > 0 ? (
          <GameGrid games={sonicGames} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Sonic games found</h2>
            <p className="text-gray-400">Check back later for more games</p>
          </div>
        )}
      </div>
    </div>
  )
}
