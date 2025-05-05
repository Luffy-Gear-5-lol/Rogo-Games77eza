import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { manga } from "@/data/games"
import { sortGames } from "@/utils/sort-utils"

export default function MangaPage() {
  // Sort the manga
  const sortedManga = sortGames(manga)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Manga Collection
          </h1>
          <p className="mt-2 text-gray-400">Browse our collection of {sortedManga.length} manga titles</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedManga.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={item.cover || item.image} alt={item.title} className="object-cover w-full h-full" />
                <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1 text-xs">★ {item.rating}</div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-bold">{item.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{item.chapters} chapters</span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-700">{item.status}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
