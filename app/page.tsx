import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight, Flame, Gamepad2, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeaturedGames from "@/components/featured-games"
import GameGrid from "@/components/game-grid"
import CategoryFilter from "@/components/category-filter"
import LanguageCompatibility from "@/components/language-compatibility"
import LanguageFilter from "@/components/language-filter"
import { games } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"

export default function HomePage() {
  // At the beginning, after getting games, identify recently added games
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))

  // Get recent games (last 12 added)
  const recentGames = [...games]
    .filter((game) => game.dateAdded)
    .sort((a, b) => new Date(b.dateAdded!).getTime() - new Date(a.dateAdded!).getTime())
    .slice(0, 12)

  // Get coming soon games
  const comingSoonGames = games.filter((game) => game.comingSoon)

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            </div>
          }
        >
          <FeaturedGames games={featuredGames} />
        </Suspense>

        {/* Language banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Multi-Language Game Platform
            </h2>
            <p className="text-gray-200 max-w-2xl">
              Our platform supports games built with Java, JavaScript, HTML, Shell, Rust, Ruby, Lua, Haxe, C, C++, C#,
              Python, TypeScript, CSS, PHP, Go, Swift, ActionScript and more!
            </p>
          </div>
          <Link href="/languages" className="mt-4 md:mt-0">
            <Button className="bg-white text-purple-900 hover:bg-gray-200">Browse by Language</Button>
          </Link>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Filter by Programming Language</h2>
            <p className="text-gray-400 mt-1">Find games built with your favorite technologies</p>
          </div>
          <LanguageFilter onFilterChange={(languages) => console.log("Selected languages:", languages)} />
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
            <h2 className="text-2xl font-bold">Browse by Category</h2>
          </div>
          <CategoryFilter />
        </div>

        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Recently Added</h2>
          </div>
          <GameGrid games={recentGames} showNewBadge={true} />
        </div>

        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">All Games</h2>
            <p className="text-gray-400 mt-1">Browse our complete collection of games</p>
          </div>
          <GameGrid games={sortedGames} />
        </div>

        {comingSoonGames.length > 0 && (
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Coming Soon</h2>
              <p className="text-gray-400 mt-1">Stay tuned for these upcoming games!</p>
            </div>
            <GameGrid games={comingSoonGames} />
          </div>
        )}

        <LanguageCompatibility />

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
    </main>
  )
}
