import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { games } from "@/data/games"

export default function CategoriesPage() {
  // Get all unique categories
  const allCategories = new Set<string>()
  games.forEach((game) => {
    if (game.categories) {
      game.categories.forEach((category) => allCategories.add(category))
    }
  })

  // Convert to array and sort alphabetically
  const categories = Array.from(allCategories).sort()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Categories</h1>
          <p className="mt-2 text-gray-400">Browse games by category</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => {
            // Count games in this category
            const gameCount = games.filter((game) => game.categories && game.categories.includes(category)).length

            return (
              <Link
                key={category}
                href={`/categories/${encodeURIComponent(category.toLowerCase())}`}
                className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900 p-6 text-center transition-transform hover:scale-105"
              >
                <span className="font-medium text-lg mb-2">{category}</span>
                <span className="text-sm text-gray-300">{gameCount} games</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
