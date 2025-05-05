import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"

export default function ComingSoonPage() {
  // Filter games that are marked as coming soon
  const comingSoonGames = games.filter((game) => game.comingSoon)

  // Sort the coming soon games
  const sortedComingSoonGames = sortGames(comingSoonGames)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-purple-500" />
            Coming Soon
          </h1>
          <p className="mt-2 text-gray-400">These exciting games will be available soon!</p>
        </div>

        {sortedComingSoonGames.length > 0 ? (
          <GameGrid games={sortedComingSoonGames} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No upcoming games at the moment. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
