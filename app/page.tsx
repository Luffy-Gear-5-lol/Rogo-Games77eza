import GameGrid from "@/components/game-grid"
import CategoryFilter from "@/components/category-filter"
import { games } from "@/data/games"

export default function Home() {
  // Use the games array directly to avoid any server action issues
  const allGames = games || []

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Welcome to Rogo Games</h1>
          <p className="text-gray-300 mb-4">
            Discover and play the best online games for free. New games added regularly!
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">All Games</h2>
          <CategoryFilter />
          <GameGrid games={allGames} />
        </div>
      </div>
    </main>
  )
}
