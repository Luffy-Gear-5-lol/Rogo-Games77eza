import Link from "next/link"
import { games } from "@/data/games"
import { Gamepad2, ChevronRight } from "lucide-react"

// Extract all unique categories from games
function getAllCategories(): { name: string; count: number; slug: string }[] {
  const categoryMap = new Map<string, number>()
  
  games.forEach((game) => {
    game.categories.forEach((category) => {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    })
  })
  
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }))
    .sort((a, b) => b.count - a.count)
}

// Get category icon/color based on name
function getCategoryStyle(categoryName: string): { bg: string; icon: string } {
  const styles: Record<string, { bg: string; icon: string }> = {
    "Arcade": { bg: "from-red-500 to-orange-500", icon: "arcade" },
    "Puzzle": { bg: "from-blue-500 to-cyan-500", icon: "puzzle" },
    "Action": { bg: "from-purple-500 to-pink-500", icon: "action" },
    "Racing": { bg: "from-green-500 to-emerald-500", icon: "racing" },
    "Sports": { bg: "from-yellow-500 to-orange-500", icon: "sports" },
    "Horror": { bg: "from-gray-700 to-red-900", icon: "horror" },
    "Platformer": { bg: "from-indigo-500 to-purple-500", icon: "platformer" },
    "Strategy": { bg: "from-teal-500 to-cyan-500", icon: "strategy" },
    "Simulation": { bg: "from-pink-500 to-rose-500", icon: "simulation" },
    "Multiplayer": { bg: "from-violet-500 to-purple-500", icon: "multiplayer" },
    "Classic": { bg: "from-amber-500 to-yellow-500", icon: "classic" },
    "Runner": { bg: "from-lime-500 to-green-500", icon: "runner" },
    "Sandbox": { bg: "from-orange-500 to-red-500", icon: "sandbox" },
  }
  
  return styles[categoryName] || { bg: "from-primary to-pink-500", icon: "default" }
}

export default function CategoriesPage() {
  const categories = getAllCategories()
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Game Categories</h1>
        <p className="text-muted-foreground">
          Browse all {categories.length} categories with {games.length} total games
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const style = getCategoryStyle(category.name)
          
          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center`}>
                    <Gamepad2 className="h-6 w-6 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="font-bold text-lg text-foreground mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} {category.count === 1 ? "game" : "games"}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
