import { Suspense } from "react"
import FeaturedGames from "@/components/featured-games"
import GameGrid from "@/components/game-grid"
import CategoryFilter from "@/components/category-filter"
import RecentlyPlayed from "@/components/recently-played"
import GameRecommendations from "@/components/game-recommendations"
import { games } from "@/data/games"

export default function Home() {
  // Get featured games directly from the games array
  const featuredGames = games.filter((game) => game.featured === true).slice(0, 3)

  // Make sure we have at least one featured game
  const displayFeaturedGames = featuredGames.length > 0 ? featuredGames : [games[0], games[1], games[2]].filter(Boolean)

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Rogo Games</h1>
          <p className="text-gray-300">
            Discover and play the best online games for free. New games added regularly! 🎮
          </p>
        </div>

        {/* Only render FeaturedGames if we have games to display */}
        {displayFeaturedGames && displayFeaturedGames.length > 0 && <FeaturedGames games={displayFeaturedGames} />}

        <Suspense fallback={<div className="h-24 flex items-center justify-center">Loading recently played...</div>}>
          <RecentlyPlayed />
        </Suspense>

        <Suspense fallback={<div className="h-24 flex items-center justify-center">Loading recommendations...</div>}>
          <GameRecommendations />
        </Suspense>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">All Games</h2>
          <CategoryFilter />
          <GameGrid games={games} />
        </div>
      </div>
    </main>
  )
}
