"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { games } from "@/data/games"

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Extract all unique categories from games
    const allCategories = new Set<string>()
    allCategories.add("All")

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
  )
}
