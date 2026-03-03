"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MangaReadButton } from "@/components/manga-read-button"
import type { Game } from "@/types/game"

interface MangaDetailPageClientProps {
  manga: Game
}

export default function MangaDetailPageClient({ manga }: MangaDetailPageClientProps) {
  const router = useRouter()
  const [currentChapter, setCurrentChapter] = useState(0)
  const [chapterImages, setChapterImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (manga.playUrl) {
      fetchChapterImages(manga.playUrl)
    } else {
      setError("No reading link available for this manga.")
      setLoading(false)
    }
  }, [manga.playUrl])

  const fetchChapterImages = async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      // In a real application, you would fetch the chapter images from a backend API
      // For this example, we'll simulate fetching images from a placeholder
      // This is a simplified example and might not work for all external manga sites
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")
      const images = Array.from(doc.querySelectorAll('img[src*="cdn"]'))
        .map((img) => (img as HTMLImageElement).src)
        .filter((src) => src.includes("chapter") || src.includes("page")) // Basic filtering for chapter images

      if (images.length === 0) {
        setError(
          "Could not find any chapter images on the provided link. This might be due to cross-origin restrictions or website structure.",
        )
      }
      setChapterImages(images)
    } catch (e: any) {
      setError(
        `Failed to load chapter images: ${e.message}. This might be due to cross-origin restrictions or website structure.`,
      )
      console.error("Failed to load chapter images:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleNextChapter = () => {
    // In a real app, this would navigate to the next chapter's URL
    // For now, we just show a message
    alert("Next chapter functionality is not yet implemented for external links.")
  }

  const handlePrevChapter = () => {
    // In a real app, this would navigate to the previous chapter's URL
    // For now, we just show a message
    alert("Previous chapter functionality is not yet implemented for external links.")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Manga
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{manga.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Image
              src={manga.cover || "/placeholder.svg?height=400&width=300&query=manga cover"}
              alt={manga.title}
              width={300}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <p className="text-lg text-muted-foreground">{manga.description}</p>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Genres:</span> {manga.genres?.join(", ")}
              </div>
              <div>
                <span className="font-semibold">Chapters:</span> {manga.chapters}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {manga.status}
              </div>
              <div>
                <span className="font-semibold">Rating:</span> {manga.rating} / 5
              </div>
            </div>
            <div className="flex gap-2">
              {manga.playUrl && (
                <Button asChild>
                  <a href={manga.playUrl} target="_blank" rel="noopener noreferrer">
                    Read on External Site <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              <MangaReadButton slug={manga.slug} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Read Manga</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading chapter...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : chapterImages.length > 0 ? (
            <div className="space-y-4">
              {chapterImages.map((src, index) => (
                <div key={index} className="flex justify-center">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Chapter image ${index + 1}`}
                    width={800}
                    height={1200}
                    className="max-w-full h-auto border rounded-lg"
                    priority={index < 3} // Prioritize loading first few images
                  />
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <Button onClick={handlePrevChapter} disabled={currentChapter === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
                </Button>
                <Button onClick={handleNextChapter}>
                  Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No images found for this chapter. Please try the external link.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
