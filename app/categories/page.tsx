import Link from "next/link"
import { ArrowLeft, Grid } from "lucide-react"
import { games } from "@/data/games"

export default function CategoriesPage() {
  // Get all unique categories
  const allCategories = Array.from(new Set(games.flatMap((game) => game.categories || []))).sort()

  // Count games in each category
  const categoryCounts = allCategories.reduce(
    (acc, category) => {
      acc[category] = games.filter((game) => game.categories?.includes(category)).length
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort categories by game count (descending)
  const sortedCategories = allCategories.sort((a, b) => categoryCounts[b] - categoryCounts[a])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Grid className="mr-2 h-6 w-6" />
            Game Categories
          </h1>
          <p className="mt-2 text-gray-400">Browse games by category</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedCategories.map((category) => (
            <Link key={category} href={`/categories/${category.toLowerCase()}`} className="group">
              <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20 p-4">
                <h3 className="text-lg font-bold group-hover:text-purple-400">{category}</h3>
                <p className="text-sm text-gray-400 mt-1">{categoryCounts[category]} games</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
