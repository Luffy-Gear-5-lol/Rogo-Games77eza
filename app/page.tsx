import Link from "next/link"
import { ChevronRight, Flame, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeaturedGames from "@/components/featured-games"
import GameGrid from "@/components/game-grid"
import RecentlyPlayed from "@/components/recently-played"
import { games } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"

export default function HomePage() {
  // Get featured games
  const featuredGames = games.filter((game) => game.featured)

  // Get popular games
  const popularGames = games.filter((game) => game.popular).slice(0, 12)

  // Get FNF games
  const fnfGames = games
    .filter(
      (game) =>
        game.title.toLowerCase().includes("fnf") ||
        game.categories?.some((cat) => cat.toLowerCase() === "fnf") ||
        game.title.toLowerCase().includes("friday night funkin"),
    )
    .slice(0, 6)

  // Sort all games numerically and then alphabetically
  const sortedGames = sortGames(games)

  // Get recent games (last 12 added)
  const recentGames = [...games].sort((a, b) => b.id - a.id).slice(0, 12)

  return (
    <main className="flex-1">
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        {/* Hero section with improved visual design */}
        <div className="relative pt-10 pb-20 sm:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-black"></div>
          </div>

          {/* Featured Games */}
          <section className="relative z-10 py-12 bg-gradient-to-b from-black to-gray-900">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Featured Games
                  </span>
                </h2>
                <Link href="/popular" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <FeaturedGames />
            </div>
          </section>

          {/* Recently Played Games - positioned right after Featured Games */}
          <div className="mt-12">
            <RecentlyPlayed />
          </div>

          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <Flame className="mr-2 h-5 w-5 text-orange-500" />
                Popular Games
              </h2>
              <Link href="/popular">
                <Button variant="link" className="text-purple-400 hover:text-purple-300">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <GameGrid games={sortGames(popularGames)} />
          </div>

          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <Gamepad2 className="mr-2 h-5 w-5" />
                FNF Games
              </h2>
              <Link href="/categories/fnf">
                <Button variant="link" className="text-purple-400 hover:text-purple-300">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <GameGrid games={sortGames(fnfGames)} />
          </div>

          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Recently Added</h2>
            </div>
            <GameGrid games={recentGames} />
          </div>

          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">All Games</h2>
              <p className="text-gray-400 mt-1">Browse our complete collection of games</p>
            </div>
            <GameGrid games={sortedGames} />
          </div>

          {/* Skip Ad Button */}
          <div className="fixed bottom-4 left-4 z-10">
            <Button variant="outline" className="bg-black/80 border-gray-700 hover:bg-black">
              Skip Ad
            </Button>
          </div>

          {/* Game Controls */}
          <div className="fixed bottom-4 right-4 z-10 flex gap-2">
            <Button variant="outline" className="bg-black/80 border-gray-700 hover:bg-black">
              Fullscreen
            </Button>
            <Button variant="outline" className="bg-black/80 border-gray-700 hover:bg-black">
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
