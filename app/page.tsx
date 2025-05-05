import { Suspense } from "react"
import Link from "next/link"
import { games } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"
import FeaturedGames from "@/components/featured-games"
import GameGrid from "@/components/game-grid"
import CategoryFilter from "@/components/category-filter"
import RecentlyPlayed from "@/components/recently-played"
import GameRecommendations from "@/components/game-recommendations"

export default function HomePage() {
  // Get featured games
  const featuredGames = games.filter((game) => game.featured)

  // Sort the games
  const sortedGames = sortGames(games)

  // Get all unique categories
  const allCategories = Array.from(new Set(games.flatMap((game) => game.categories || []))).sort()

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/70" />
            <div className="relative py-16 px-8 md:py-24 md:px-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Rogo Games</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                Discover and play the best online games for free. New games added regularly! 🎮
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/popular"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  Popular Games
                </Link>
                <Link
                  href="/categories"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        {featuredGames.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Games</h2>
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-20">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                </div>
              }
            >
              <FeaturedGames games={featuredGames} />
            </Suspense>
          </section>
        )}

        {/* Recently Played */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              </div>
            }
          >
            <RecentlyPlayed />
          </Suspense>
        </section>

        {/* Game Recommendations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              </div>
            }
          >
            <GameRecommendations />
          </Suspense>
        </section>

        {/* All Games with Category Filter */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">All Games</h2>
            <CategoryFilter categories={allCategories} />
          </div>
          <GameGrid games={sortedGames} />
        </section>
      </div>
    </main>
  )
}
