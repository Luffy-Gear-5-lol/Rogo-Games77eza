import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, Calendar, Flame } from "lucide-react"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"
import { getGameViews, getPopularGames, getNextPopularReset } from "@/actions/game-actions"
import { isAdmin } from "@/utils/admin-utils"
import { sortGames } from "@/utils/sort-utils"

async function PopularGamesContent() {
  // Get popular game IDs based on view count
  const popularGameIds = await getPopularGames(24)
  const gameViews = await getGameViews()
  const nextResetDate = await getNextPopularReset()
  const showViewCounts = isAdmin()

  // Format the next reset date
  const nextReset = new Date(nextResetDate)
  const formattedNextReset = nextReset.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Filter games by the popular IDs and add view count
  const popularGames = popularGameIds
    .map((id) => {
      const game = games.find((g) => g.id === id)
      if (game) {
        return {
          ...game,
          views: gameViews[id] || 0,
        }
      }
      return null
    })
    .filter(Boolean) as typeof games

  // Sort the popular games
  const sortedPopularGames = sortGames(popularGames)

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Flame className="mr-2 h-6 w-6 text-orange-500" />
          Popular Games
        </h1>
        <p className="mt-2 text-gray-400">The most played games on Rogo Games in the last 2 weeks</p>
        {showViewCounts && (
          <div className="mt-2 flex items-center text-sm text-gray-400">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Next popular games refresh: {formattedNextReset}</span>
          </div>
        )}
      </div>

      {sortedPopularGames.length > 0 ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedPopularGames.slice(0, 4).map((game) => (
              <Link key={game.id} href={`/game/${game.id}`} className="group">
                <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{game.title}</span>
                    </div>
                    {showViewCounts && (
                      <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1 text-xs flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {game.views?.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-bold group-hover:text-purple-400">{game.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{game.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <GameGrid games={sortedPopularGames.slice(4)} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No popular games yet. Start playing to see games here!</p>
        </div>
      )}
    </>
  )
}

export default function PopularGamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            </div>
          }
        >
          <PopularGamesContent />
        </Suspense>
      </div>
    </div>
  )
}
