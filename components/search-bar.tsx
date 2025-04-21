"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { games } from "@/data/games"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof games>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = games
        .filter(
          (game) =>
            game.title.toLowerCase().includes(query.toLowerCase()) ||
            game.description.toLowerCase().includes(query.toLowerCase()) ||
            (game.categories && game.categories.some((cat) => cat.toLowerCase().includes(query.toLowerCase()))),
        )
        .slice(0, 5)

      setResults(searchResults)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`)
    setQuery("")
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
        />
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-gray-800 border border-gray-700 shadow-lg">
          <ul className="py-1">
            {results.map((game) => (
              <li
                key={game.id}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleGameClick(game.id)}
              >
                <div className="font-medium">{game.title}</div>
                <div className="text-xs text-gray-400">
                  {game.categories && game.categories.length > 0 ? game.categories[0] : ""}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
