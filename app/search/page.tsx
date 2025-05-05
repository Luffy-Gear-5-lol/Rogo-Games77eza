import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { games } from "@/data/games"
import GameGrid from "@/components/game-grid"
import { sortGames } from "@/utils/sort-utils"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : ""

  // Filter games by search query
  const filteredGames = games.filter((game) => {
    const searchableText = `${game.title} ${game.description} ${game.categories?.join(" ") || ""}`.toLowerCase()
    return searchableText.includes(query.toLowerCase())
  })

  // Sort the games
  const sortedGames = sortGames(filteredGames)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Search className="mr-2 h-6 w-6" />
            Search Results
          </h1>
          {query ? (
            <p className="mt-2 text-gray-400">
              Found {sortedGames.length} {sortedGames.length === 1 ? "result" : "results"} for "{query}"
            </p>
          ) : (
            <p className="mt-2 text-gray-400">Enter a search term to find games</p>
          )}
        </div>

        {query ? (
          sortedGames.length > 0 ? (
            <GameGrid games={sortedGames} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No games found matching your search.</p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Please enter a search term to find games.</p>
          </div>
        )}
      </div>
    </div>
  )
}
