"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { games } from "@/data/games"
import { ChevronRight } from "lucide-react"

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Extract all unique categories from games
    const allCategories = new Set<string>()
    allCategories.add("All")

    // Ensure FNF is included as a category
    allCategories.add("FNF")

    if (games && games.length > 0) {
      games.forEach((game) => {
        if (game.categories && Array.isArray(game.categories)) {
          game.categories.forEach((category) => {
            allCategories.add(category)
          })
        }
      })
    }

    // Sort categories alphabetically
    const sortedCategories = Array.from(allCategories).sort()

    // Make sure "All" is first
    const finalCategories = sortedCategories.filter((cat) => cat !== "All")
    finalCategories.unshift("All")

    setCategories(finalCategories)
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories
          .filter((cat) => cat !== "All")
          .slice(0, 8)
          .map((category) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              className="relative group overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">{category}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {
                    games.filter((game) => game.categories?.some((cat) => cat.toLowerCase() === category.toLowerCase()))
                      .length
                  }{" "}
                  games
                </p>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
      </div>

      <div className="text-center mt-4">
        <Link href="/categories">
          <Button
            variant="outline"
            className="text-purple-400 hover:text-purple-300 border-purple-600 hover:bg-purple-900/20"
          >
            View All Categories
          </Button>
        </Link>
      </div>
    </div>
  )
}
