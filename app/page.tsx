import Link from "next/link"
import { ChevronRight, Flame, Gamepad2, Sparkles, Clock, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeaturedGames from "@/components/featured-games"
import GameGrid from "@/components/game-grid"
import GameCategories from "@/components/game-categories"
import RecentlyPlayed from "@/components/recently-played"
import { games } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"

// Get daily featured games based on date
function getDailyFeaturedGames() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const featuredGames = games.filter((game) => game.featured)
  
  // Rotate through featured games daily
  const startIndex = dayOfYear % Math.max(1, featuredGames.length - 3)
  return featuredGames.slice(startIndex, startIndex + 4)
}

// Check if recently added games are within 2 weeks
function getRecentlyAddedGames() {
  const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000)
  const recentGames = [...games]
    .sort((a, b) => b.id - a.id)
    .slice(0, 12)
  
  // For now, return recent games. In production, you'd check actual add dates
  return recentGames
}

export default function HomePage() {
  const featuredGames = getDailyFeaturedGames()
  const popularGames = games.filter((game) => game.popular).slice(0, 15)
  
  const fnfGames = games
    .filter(
      (game) =>
        game.title.toLowerCase().includes("fnf") ||
        game.categories?.some((cat) => cat.toLowerCase() === "fnf") ||
        game.title.toLowerCase().includes("friday night funkin"),
    )
    .slice(0, 6)

  const sortedGames = sortGames(games)
  const recentGames = getRecentlyAddedGames()

  return (
    <main className="flex-1">
      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-12">
          {/* Background with purple accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background dark:from-primary/10" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Featured Games Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="section-header-gradient">Featured Games</span>
                </h2>
                <Link href="/popular" className="text-primary hover:text-primary/80 text-sm flex items-center font-medium">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <FeaturedGames games={featuredGames} />
            </section>

            {/* Popular Categories */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                  <span>Popular Categories</span>
                </h2>
                <Link href="/categories" className="text-primary hover:text-primary/80 text-sm flex items-center font-medium">
                  See All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <GameCategories />
            </section>

            {/* Recently Played */}
            <section className="mb-12">
              <RecentlyPlayed />
            </section>

            {/* Popular Games */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span>Popular Games</span>
                </h2>
                <Link href="/popular">
                  <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <GameGrid games={sortGames(popularGames)} />
            </section>

            {/* FNF Games */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header">
                  <Gamepad2 className="h-5 w-5 text-pink-500" />
                  <span>FNF Games</span>
                </h2>
                <Link href="/categories/fnf">
                  <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <GameGrid games={sortGames(fnfGames)} />
            </section>

            {/* Recently Added */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span>Recently Added</span>
                </h2>
              </div>
              {recentGames.length > 0 ? (
                <GameGrid games={recentGames} />
              ) : (
                <div className="text-center py-8 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No games added recently</p>
                </div>
              )}
            </section>

            {/* All Games */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="section-header mb-1">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                    <span>All Games</span>
                  </h2>
                  <p className="text-muted-foreground text-sm">Browse our complete collection</p>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-primary/25">
                  <Gamepad2 className="h-4 w-4" />
                  <span>{sortedGames.length} Games</span>
                </div>
              </div>
              <GameGrid games={sortedGames} />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
