import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Eye, Calendar, Flame, Play, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"
import { getGameViews, getPopularGames, getNextPopularReset } from "@/actions/game-actions"
import { sortGames } from "@/utils/sort-utils"

async function PopularGamesContent() {
  const popularGameIds = await getPopularGames(15)
  const gameViews = await getGameViews()
  const nextResetDate = await getNextPopularReset()

  const nextReset = new Date(nextResetDate)
  const formattedNextReset = nextReset.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get popular games with view counts
  let popularGames = popularGameIds
    .map((id) => {
      const game = games.find((g) => g.id === id)
      if (game) {
        return { ...game, views: gameViews[id] || 0 }
      }
      return null
    })
    .filter(Boolean) as typeof games

  // If we don't have enough popular games from views, supplement with games marked as popular
  if (popularGames.length < 15) {
    const additionalPopular = games
      .filter((g) => g.popular && !popularGames.some((pg) => pg.id === g.id))
      .slice(0, 15 - popularGames.length)
      .map((g) => ({ ...g, views: gameViews[g.id] || 0 }))
    popularGames = [...popularGames, ...additionalPopular]
  }

  const sortedPopularGames = sortGames(popularGames).slice(0, 15)

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Popular Games</h1>
        </div>
        <p className="text-muted-foreground">The most played games on Rogo Games - Updates every 2 weeks</p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Next refresh: {formattedNextReset}
          </span>
          <span className="flex items-center gap-1 bg-gradient-to-r from-primary to-pink-500 text-white px-3 py-1 rounded-full font-medium">
            <Trophy className="h-4 w-4" />
            {sortedPopularGames.length} Games
          </span>
        </div>
      </div>

      {sortedPopularGames.length > 0 ? (
        <>
          {/* Top 3 Featured Popular Games */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {sortedPopularGames.slice(0, 3).map((game, index) => (
              <Link key={game.id} href={`/games/${game.slug}`} className="group relative">
                <div className="game-card overflow-hidden rounded-2xl bg-card border border-border relative">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={game.image || "/placeholder.svg?height=200&width=350"}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    
                    {/* Rank badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                        ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' : ''}
                        ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : ''}
                        ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' : ''}
                      `}>
                        #{index + 1}
                      </div>
                    </div>
                    
                    {/* View count */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center text-white z-10">
                      <Eye className="h-3 w-3 mr-1" />
                      {(game.views || 0).toLocaleString()}
                    </div>
                    
                    {/* Play overlay */}
                    <div className="play-overlay">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full font-bold">
                        <Play className="h-5 w-5 mr-2 fill-current" />
                        Play Now
                      </Button>
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="game-card-title text-lg mb-1 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Rest of popular games */}
          <GameGrid games={sortedPopularGames.slice(3)} />
        </>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium text-lg">No popular games yet</p>
          <p className="text-muted-foreground mt-2">Start playing games to see them appear here!</p>
        </div>
      )}
    </>
  )
}

export default function PopularGamesPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          }
        >
          <PopularGamesContent />
        </Suspense>
      </div>
    </div>
  )
}
