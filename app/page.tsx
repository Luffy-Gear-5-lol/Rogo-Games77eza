import GameGrid from "@/components/game-grid"

async function getData() {
  const res = await fetch("http://localhost:3000/api/games", { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function Home() {
  const games = await getData()

  return (
    <main className="container mx-auto p-4">
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">All Games</h2>
            <p className="text-gray-400">Browse our complete collection of games</p>
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                🎮 {games.length} Games Available
              </span>
            </div>
          </div>
        </div>
        <GameGrid games={games} />
      </section>
    </main>
  )
}
