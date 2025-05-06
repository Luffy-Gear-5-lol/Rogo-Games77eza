import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import GameGrid from "@/components/game-grid"
import { games } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"

interface LanguagePageProps {
  params: {
    language: string
  }
}

export default function LanguagePage({ params }: LanguagePageProps) {
  const language = decodeURIComponent(params.language)
  const capitalizedLanguage = language.charAt(0).toUpperCase() + language.slice(1)

  // Get games for this language
  const languageGames = games.filter((game) =>
    game.languages?.some((lang) => lang.toLowerCase() === language.toLowerCase()),
  )

  // Color mapping for language
  const colorMap: Record<string, string> = {
    javascript: "bg-yellow-600",
    html: "bg-orange-600",
    java: "bg-red-600",
    python: "bg-blue-600",
    "c++": "bg-purple-600",
    "c#": "bg-green-600",
    typescript: "bg-blue-500",
    rust: "bg-orange-700",
    ruby: "bg-red-500",
    lua: "bg-blue-400",
    haxe: "bg-orange-500",
    c: "bg-gray-600",
    css: "bg-pink-600",
    php: "bg-indigo-600",
    go: "bg-cyan-600",
    swift: "bg-orange-600",
    actionscript: "bg-red-700",
    shell: "bg-green-700",
  }

  const bgColor = colorMap[language.toLowerCase()] || "bg-gray-600"

  // Language descriptions
  const languageDescriptions: Record<string, string> = {
    javascript:
      "JavaScript is a versatile language that powers interactive web games with smooth animations and dynamic content.",
    html: "HTML5 games use the latest web standards to create cross-platform gaming experiences that run in any modern browser.",
    java: "Java games offer robust performance and cross-platform compatibility, making them ideal for complex gaming experiences.",
    python: "Python games are known for their clean code and rapid development, perfect for puzzle and strategy games.",
    "c++": "C++ provides the performance needed for high-end 3D games and complex simulations with detailed physics.",
    "c#": "C# is widely used with Unity to create polished, professional games across multiple platforms.",
    typescript: "TypeScript adds type safety to JavaScript, making it ideal for large-scale game development projects.",
    rust: "Rust combines performance with memory safety, perfect for games that need both speed and reliability.",
    ruby: "Ruby games are quick to develop and feature elegant code, making them great for indie developers.",
    lua: "Lua is lightweight and embeddable, commonly used for game scripting and modding.",
    haxe: "Haxe is a versatile language that can compile to multiple platforms, ideal for cross-platform game development.",
    c: "C provides low-level control and high performance, essential for games with strict performance requirements.",
    css: "CSS is used alongside HTML and JavaScript to create visually appealing web-based games.",
    php: "PHP powers the backend of many browser-based multiplayer games and gaming communities.",
    go: "Go offers excellent concurrency support, making it great for server-side game components and multiplayer features.",
    swift: "Swift is used to create smooth, responsive games for Apple devices with excellent performance.",
    actionscript:
      "ActionScript was the foundation of Flash games, with many classics now preserved and playable in modern browsers.",
    shell: "Shell scripts help automate game development workflows and server management for online games.",
  }

  const description =
    languageDescriptions[language.toLowerCase()] || `Games built with ${capitalizedLanguage} programming language.`

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/languages" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Languages
        </Link>

        <div className={`${bgColor} rounded-lg p-6 mb-8`}>
          <h1 className="text-3xl font-bold mb-4">{capitalizedLanguage} Games</h1>
          <p className="text-white/80 max-w-3xl">{description}</p>
        </div>

        {languageGames.length > 0 ? (
          <Suspense fallback={<div>Loading games...</div>}>
            <GameGrid games={sortGames(languageGames)} />
          </Suspense>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No games found</h2>
            <p className="text-gray-400 mb-6">We couldn't find any games built with {capitalizedLanguage}.</p>
            <Link href="/languages">
              <Button>Browse Other Languages</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
