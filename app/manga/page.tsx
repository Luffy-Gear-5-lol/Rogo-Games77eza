import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { manga } from "@/data/games"

// Featured manga
const featuredManga = manga.slice(0, 3)

// Popular manga
const popularManga = manga.slice(3, 7)

// New releases
const newReleases = manga.slice(7, 11)

function MangaCard({ manga }: { manga: (typeof manga)[0] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image src={manga.cover || "/placeholder.svg"} alt={manga.title} fill className="object-cover" />
        <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1 text-xs flex items-center">
          <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
          {manga.rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold hover:text-purple-400">{manga.title}</h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {manga.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="bg-gray-700 text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {manga.chapters} ch
          </span>
          <span>{manga.status}</span>
        </div>
      </div>
    </div>
  )
}

function FeaturedManga() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {featuredManga.map((manga) => (
        <div key={manga.id} className="relative overflow-hidden rounded-xl bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
          <div className="relative aspect-[16/9] w-full">
            <Image src={manga.cover || "/placeholder.svg"} alt={manga.title} fill className="object-cover" />
          </div>
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="px-6 py-4 sm:px-10 sm:py-6 md:max-w-2xl">
              <Badge className="mb-2 bg-purple-600 hover:bg-purple-700">{manga.genres[0]}</Badge>
              <h2 className="mb-2 text-2xl font-bold sm:text-3xl">{manga.title}</h2>
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(manga.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-300">{manga.rating.toFixed(1)}</span>
              </div>
              <p className="mb-6 text-gray-300 line-clamp-3">{manga.description}</p>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <BookOpen className="mr-2 h-4 w-4" /> Read Now
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Add to Library
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MangaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Manga Collection</h1>
          <p className="mt-2 text-gray-400">Read your favorite manga online</p>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Featured Manga</h2>
          <FeaturedManga />
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Popular Manga</h2>
            <Button variant="link" className="text-purple-400 hover:text-purple-300">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {popularManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">New Releases</h2>
            <Button variant="link" className="text-purple-400 hover:text-purple-300">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {newReleases.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Browse by Genre</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {[
              "Action",
              "Adventure",
              "Comedy",
              "Fantasy",
              "Romance",
              "Slice of Life",
              "Horror",
              "Sci-Fi",
              "Sports",
              "Mystery",
              "Drama",
              "Supernatural",
            ].map((genre) => (
              <a
                key={genre}
                href={`#${genre.toLowerCase()}`}
                className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900 p-4 text-center font-medium transition-transform hover:scale-105"
              >
                {genre}
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Manga</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select className="rounded-md bg-gray-800 border-gray-700 text-white text-sm">
                <option>Popularity</option>
                <option>Latest Update</option>
                <option>Alphabetical</option>
                <option>Rating</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {manga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
