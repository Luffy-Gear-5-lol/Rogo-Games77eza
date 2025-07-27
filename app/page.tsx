import { games } from "@/data/games"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Hero Section */}
      <section className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl lg:static lg:w-auto  lg:before:bg-gradient-radial lg:before:p-0 lg:after:bg-gradient-conic lg:after:from-sky-200 lg:after:via-[#0141ff] lg:after:opacity-40 before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#2200ff] after:dark:opacity-40 dark:lg:after:from-blue-900 dark:lg:via-blue-300 dark:lg:opacity-40">
        <div>
          <h1 className="text-4xl font-bold text-center">
            Welcome to <span className="text-blue-600">GameSphere</span>
          </h1>
          <p className="mt-3 text-lg text-center">
            Explore a universe of games. Discover new worlds, epic adventures, and thrilling challenges.
          </p>
        </div>
      </section>

      {/* Game Counter Section */}
      <section className="py-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            <span className="text-2xl">🎮</span>
            <span>{games.length} Games Available</span>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Featured Games</h2>
        {/* Add game cards or a carousel here */}
        <p className="text-center">Check out our hand-picked selection of games.</p>
      </section>

      {/* Footer */}
      <footer className="flex justify-center items-center py-4">
        <p className="text-gray-500">© {new Date().getFullYear()} GameSphere. All rights reserved.</p>
      </footer>
    </main>
  )
}
