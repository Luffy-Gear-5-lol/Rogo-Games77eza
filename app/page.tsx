import { Suspense } from "react"
import FeaturedGames from "@/components/featured-games"
import GameGrid from "@/components/game-grid"
import CategoryFilter from "@/components/category-filter"
import { getAllGames } from "@/actions/game-actions"
import RecentlyPlayed from "@/components/recently-played"
import GameRecommendations from "@/components/game-recommendations"

export default async function Home() {
  const games = await getAllGames()

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <FeaturedGames />

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
