"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { games } from "@/data/games"
import GameGrid from "@/components/game-grid"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  // Filter games based on search query
  const filteredGames = games.filter(
    (game) =>
      game.title.toLowerCase().includes(query.toLowerCase()) ||
      game.description.toLowerCase().includes(query.toLowerCase()) ||
      (game.categories && game.categories.some((cat) => cat.toLowerCase().includes(query.toLowerCase()))),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="mt-2 text-gray-400">
            {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} found for "{query}"
          </p>
        </div>

        {filteredGames.length > 0 ? (
          <GameGrid games={filteredGames} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No games found</h2>
            <p className="text-gray-400 mb-8">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  )
}
