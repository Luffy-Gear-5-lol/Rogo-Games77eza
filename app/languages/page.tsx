import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"

export default function LanguagesPage() {
  const programmingLanguages = [
    { name: "JavaScript", color: "bg-yellow-600", icon: "JS" },
    { name: "HTML", color: "bg-orange-600", icon: "HTML" },
    { name: "Java", color: "bg-red-600", icon: "JAVA" },
    { name: "Python", color: "bg-blue-600", icon: "PY" },
    { name: "C++", color: "bg-purple-600", icon: "C++" },
    { name: "C#", color: "bg-green-600", icon: "C#" },
    { name: "TypeScript", color: "bg-blue-500", icon: "TS" },
    { name: "Rust", color: "bg-orange-700", icon: "RS" },
    { name: "Ruby", color: "bg-red-500", icon: "RB" },
    { name: "Lua", color: "bg-blue-400", icon: "LUA" },
    { name: "Haxe", color: "bg-orange-500", icon: "HX" },
    { name: "C", color: "bg-gray-600", icon: "C" },
    { name: "CSS", color: "bg-pink-600", icon: "CSS" },
    { name: "PHP", color: "bg-indigo-600", icon: "PHP" },
    { name: "Go", color: "bg-cyan-600", icon: "GO" },
    { name: "Swift", color: "bg-orange-600", icon: "SWIFT" },
    { name: "ActionScript", color: "bg-red-700", icon: "AS" },
    { name: "Shell", color: "bg-green-700", icon: "SH" },
  ]

  // Get a sample of games for each language
  const getLanguageGames = (language: string) => {
    return games.filter((game) => game.languages?.includes(language)).slice(0, 4)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Games by Programming Language</h1>
          <p className="text-gray-400">
            Browse games based on the programming languages they were built with. Our platform supports a wide variety
            of languages to provide the best gaming experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {programmingLanguages.map((language) => (
            <Link href={`/languages/${language.name.toLowerCase()}`} key={language.name} className="group">
              <div
                className={`${language.color} p-6 rounded-lg text-center transition-transform group-hover:scale-105`}
              >
                <div className="text-3xl font-mono font-bold mb-2 text-white/90">{language.icon}</div>
                <div className="text-white font-bold mb-1">{language.name}</div>
                <div className="text-xs text-white/80">{Math.floor(Math.random() * 50) + 10} Games</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured language sections */}
        {programmingLanguages.slice(0, 6).map((language) => (
          <div key={language.name} className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <span className={`${language.color} w-4 h-4 rounded-full mr-2`}></span>
                {language.name} Games
              </h2>
              <Link href={`/languages/${language.name.toLowerCase()}`}>
                <Button variant="link" className="text-purple-400 hover:text-purple-300">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              <GameGrid games={sortGames(getLanguageGames(language.name))} />
            </Suspense>
          </div>
        ))}
      </div>
    </main>
  )
}
