import { manga } from "@/data/manga"
import { MangaReadButton } from "@/components/manga-read-button"
import Image from "next/image"
import Link from "next/link"

export default function MangaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Manga Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {manga.map((mangaItem) => (
          <div key={mangaItem.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
            <Link href={`/manga/${mangaItem.slug}`}>
              <Image
                src={mangaItem.cover || "/placeholder.svg?height=300&width=200&query=manga cover"}
                alt={mangaItem.title}
                width={200}
                height={300}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{mangaItem.title}</h2>
              <p className="text-muted-foreground text-sm mb-2">{mangaItem.genres?.join(", ")}</p>
              <p className="text-muted-foreground text-sm mb-4">
                Chapters: {mangaItem.chapters} | Status: {mangaItem.status}
              </p>
              <MangaReadButton slug={mangaItem.slug} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
