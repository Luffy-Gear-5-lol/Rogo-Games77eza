import { manga } from "@/data/manga"
import { notFound } from "next/navigation"
import MangaDetailPageClient from "./MangaDetailPageClient"

interface MangaDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return manga.map((item) => ({
    slug: item.slug,
  }))
}

export default function MangaDetailPage({ params }: MangaDetailPageProps) {
  const mangaItem = manga.find((item) => item.slug === params.slug)

  if (!mangaItem) {
    notFound()
  }

  return <MangaDetailPageClient manga={mangaItem} />
}
