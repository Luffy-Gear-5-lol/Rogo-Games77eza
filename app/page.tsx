import { Suspense } from "react"
import Link from "next/link"
import GameGrid from "@/components/game-grid"
import FeaturedGames from "@/components/featured-games"
import CategoryFilter from "@/components/category-filter"
import SearchBar from "@/components/search-bar"
import { games } from "@/data/games"
import { getGameViews } from "@/actions/game-actions"

async function HomePageContent() {
  // Get game views
  const gameViews = await getGameViews()

  // Add view counts to games
  const gamesWithViews = games.map((game) => ({
    ...game,
    views: gameViews[game.id] || 0,
  }))

  return (
    <>
      {/* Search and Categories */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar />
        <CategoryFilter />
      </div>

      {/* Featured Games */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Games</h2>
        <FeaturedGames games={gamesWithViews.filter((game) => game.featured).slice(0, 3)} />
      </section>

      {/* Popular Categories */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link href="/categories" className="text-sm text-purple-400 hover:text-purple-300">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {["Arcade", "Action", "Adventure", "Puzzle", "Racing", "Sports"].map((category) => (
            <a
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900 p-4 text-center font-medium transition-transform hover:scale-105"
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      {/* All Games */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Games</h2>
          <span className="text-sm text-gray-400">{games.length} games available</span>
        </div>
        <GameGrid games={gamesWithViews} />
      </section>
    </>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 z-10" />
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-40" />
        <div className="container relative z-20 mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Rogo Games
              </span>
              <span className="block">Play Awesome Games</span>
            </h1>
            <p className="mb-8 text-lg text-gray-300 sm:text-xl">
              Your ultimate collection of free online games. Play instantly in your browser!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            </div>
          }
        >
          <HomePageContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Rogo Games
              </h2>
              <p className="text-gray-400">© {new Date().getFullYear()} All rights reserved</p>
            </div>
            <div className="text-sm text-gray-400">
              All games playable on this website are copyrights & property of their respective owners
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
