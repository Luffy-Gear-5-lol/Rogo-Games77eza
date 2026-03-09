import Link from "next/link"
import { notFound } from "next/navigation"
import { games } from "@/data/games"
import GameCard from "@/components/game-card"
import { ChevronLeft, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

// Get games by category slug
function getGamesByCategory(slug: string) {
  const categoryName = slug.replace(/-/g, " ")
  
  return games.filter((game) =>
    game.categories.some(
      (cat) => cat.toLowerCase() === categoryName.toLowerCase()
    )
  )
}

// Get category display name from slug
function getCategoryDisplayName(slug: string): string {
  const categoryName = slug.replace(/-/g, " ")
  
  // Find the actual category name from games (preserves capitalization)
  for (const game of games) {
    for (const cat of game.categories) {
      if (cat.toLowerCase() === categoryName.toLowerCase()) {
        return cat
      }
    }
  }
  
  // Fallback: capitalize each word
  return categoryName.split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ")
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryGames = getGamesByCategory(slug)
  const categoryName = getCategoryDisplayName(slug)
  
  if (categoryGames.length === 0) {
    notFound()
  }
  
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/categories">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            All Categories
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{categoryName}</h1>
            <p className="text-muted-foreground">
              {categoryGames.length} {categoryGames.length === 1 ? "game" : "games"} available
            </p>
          </div>
        </div>
      </div>
      
      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categorySet = new Set<string>()
  
  games.forEach((game) => {
    game.categories.forEach((category) => {
      categorySet.add(category.toLowerCase().replace(/\s+/g, "-"))
    })
  })
  
  return Array.from(categorySet).map((slug) => ({
    slug,
  }))
}
