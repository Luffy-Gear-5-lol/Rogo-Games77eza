import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Star, Clock, Calendar, ExternalLink } from "lucide-react"
import { manga } from "@/data/games"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return manga.map((item) => ({
    slug: item.slug,
  }))
}

export default function MangaDetailPage({ params }: { params: { slug: string } }) {
  const mangaItem = manga.find((item) => item.slug === params.slug)

  if (!mangaItem) {
    notFound()
  }

  // Get reading link based on manga title
  const getReadingLink = (title: string) => {
    switch (title.toLowerCase()) {
      case "one piece":
        return "https://ww11.readonepiece.com/chapter/one-piece-digital-colored-comics-chapter-001/"
      case "naruto":
        return "https://naruto-manga-online.com/"
      case "bleach":
        return "https://bleachmanga.biz/"
      case "attack on titan":
        return "https://attackontitanmanga.com/"
      case "death note":
        return "https://deathnote-manga.com/"
      case "demon slayer":
        return "https://demonslayermanga.com/"
      case "hunter x hunter":
        return "https://hunterxhuntermanga.com/"
      default:
        return "#" // Placeholder for manga without specific links
    }
  }

  const readingLink = getReadingLink(mangaItem.title)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/manga" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Manga Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Manga Cover */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg border-2 border-gray-700 shadow-xl shadow-purple-500/10">
              <Image
                src={mangaItem.cover || mangaItem.image || "/placeholder.svg?height=600&width=400"}
                alt={mangaItem.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-bold">{mangaItem.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">/ 5.0</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-400 text-sm">{mangaItem.chapters} chapters</span>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-gray-400 text-sm">Status: {mangaItem.status}</span>
              </div>

              <div className="pt-4">
                <a
                  href={readingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Manga Online
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Manga Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{mangaItem.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {mangaItem.genres?.map((genre) => (
                <span key={genre} className="px-3 py-1 bg-gray-800 text-gray-200 text-sm rounded-full">
                  {genre}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{mangaItem.description}</p>

              <h2 className="text-xl font-semibold mb-4">About This Manga</h2>
              <p className="text-gray-300 leading-relaxed">
                {mangaItem.title} is a popular manga with {mangaItem.chapters} chapters and a rating of{" "}
                {mangaItem.rating}/5. The manga is currently {mangaItem.status.toLowerCase()}. It features genres such
                as
                {mangaItem.genres?.join(", ")}.
              </p>

              <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Reading Guide</h3>
                <p className="text-gray-300">
                  Click the "Read Manga Online" button to start reading {mangaItem.title} from Chapter 1. The external
                  site provides high-quality scans and translations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Manga */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {manga
              .filter((item) => item.id !== mangaItem.id)
              .slice(0, 5)
              .map((item) => (
                <Link key={item.id} href={`/manga/${item.slug}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                    <Image
                      src={item.cover || item.image || "/placeholder.svg?height=300&width=200"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 font-medium text-sm group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
