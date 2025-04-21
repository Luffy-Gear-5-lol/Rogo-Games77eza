import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { games } from "@/data/games"

export default function PapasSeriesPage() {
  const papasGames = games.filter((game) => game.series === "papas")

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Papa's Restaurant Games</h1>
          <p className="mt-2 text-gray-400">
            Run different restaurants and serve customers in these time-management simulation games
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {papasGames.map((game) => (
            <Link key={game.id} href={`/game/${game.id}`} className="group">
              <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{game.title}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 font-bold group-hover:text-purple-400">{game.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-bold">About Papa's Games</h2>
          <p className="mb-4 text-gray-300">
            Papa's Games is a popular series of time-management and restaurant simulation games created by Flipline
            Studios. In each game, you take on the role of a restaurant employee who must prepare food, serve customers,
            and manage your restaurant.
          </p>
          <p className="mb-4 text-gray-300">
            The gameplay typically involves four main stations: taking orders, preparing the food, cooking or baking,
            and assembling the final product with toppings and sides. As you progress, you'll earn tips based on how
            well you serve your customers, which you can use to upgrade your restaurant and unlock new items.
          </p>
          <p className="text-gray-300">
            Each game in the series focuses on a different type of restaurant, from pizzerias and burger joints to ice
            cream shops and taco stands. The series is known for its addictive gameplay, colorful graphics, and
            increasing challenge as you progress through the levels.
          </p>
        </div>
      </div>
    </div>
  )
}
