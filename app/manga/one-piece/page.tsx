import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Star, Clock, Calendar, ExternalLink } from "lucide-react"
import { manga } from "@/data/games"

export default function OnePiecePage() {
  const onePiece = manga.find((item) => item.slug === "one-piece")

  if (!onePiece) {
    return null
  }

  const readingLink = "https://ww11.readonepiece.com/chapter/one-piece-digital-colored-comics-chapter-001/"

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
                src={onePiece.cover || onePiece.image || "/placeholder.svg?height=600&width=400"}
                alt={onePiece.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-bold">{onePiece.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">/ 5.0</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-400 text-sm">{onePiece.chapters} chapters</span>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-gray-400 text-sm">Status: {onePiece.status}</span>
              </div>

              <div className="pt-4">
                <a
                  href={readingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read One Piece Online
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Manga Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">One Piece</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {onePiece.genres?.map((genre) => (
                <span key={genre} className="px-3 py-1 bg-gray-800 text-gray-200 text-sm rounded-full">
                  {genre}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{onePiece.description}</p>

              <h2 className="text-xl font-semibold mb-4">About One Piece</h2>
              <p className="text-gray-300 leading-relaxed">
                One Piece is a Japanese manga series written and illustrated by Eiichiro Oda. It has been serialized in
                Shueisha's shōnen manga magazine Weekly Shōnen Jump since July 1997, with its individual chapters
                compiled into 104 tankōbon volumes as of November 2022. The story follows the adventures of Monkey D.
                Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit. With
                his crew of pirates, named the Straw Hat Pirates, Luffy explores the Grand Line in search of the world's
                ultimate treasure known as the "One Piece" to become the next Pirate King.
              </p>

              <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Reading Guide</h3>
                <p className="text-gray-300">
                  Click the "Read One Piece Online" button to start reading from Chapter 1. The link provides access to
                  the digital colored comics version of One Piece, which features officially colored pages for an
                  enhanced reading experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Arcs Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Major Story Arcs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">East Blue Saga</h3>
              <p className="text-sm text-gray-300">
                The beginning of Luffy's journey as he recruits his initial crew members and sets sail for the Grand
                Line.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Alabasta Saga</h3>
              <p className="text-sm text-gray-300">
                The Straw Hats enter the Grand Line and become involved in a civil war in the desert kingdom of
                Alabasta.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Sky Island Saga</h3>
              <p className="text-sm text-gray-300">
                The crew journeys to a land in the sky and confronts a self-proclaimed god named Enel.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Water 7 Saga</h3>
              <p className="text-sm text-gray-300">
                The Straw Hats visit Water 7 to repair their ship and get caught in a conspiracy involving the World
                Government.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Thriller Bark Saga</h3>
              <p className="text-sm text-gray-300">
                The crew encounters a massive ghost ship and battles against the Warlord Gecko Moria.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Summit War Saga</h3>
              <p className="text-sm text-gray-300">
                A pivotal saga featuring the Marineford War and the death of Ace, Luffy's brother.
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Manga */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {manga
              .filter((item) => item.slug !== "one-piece")
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
