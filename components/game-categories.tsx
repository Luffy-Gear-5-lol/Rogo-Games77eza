"use client"

import Link from "next/link"

const categories = [
  { name: "Arcade", slug: "arcade", gradient: "from-purple-600 to-purple-800" },
  { name: "Action", slug: "action", gradient: "from-purple-500 to-indigo-700" },
  { name: "Adventure", slug: "adventure", gradient: "from-indigo-500 to-purple-700" },
  { name: "Puzzle", slug: "puzzle", gradient: "from-purple-600 to-pink-600" },
  { name: "Racing", slug: "racing", gradient: "from-pink-500 to-purple-700" },
  { name: "Sports", slug: "sports", gradient: "from-purple-700 to-indigo-600" },
]

export default function GameCategories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className={`
            category-chip text-center py-4 px-6 rounded-xl font-semibold
            bg-gradient-to-br ${category.gradient}
            text-white shadow-lg shadow-primary/20
            hover:shadow-xl hover:shadow-primary/30 hover:scale-105
            transition-all duration-300
            border border-white/10
          `}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
