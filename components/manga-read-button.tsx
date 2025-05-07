"use client"

import { BookOpen, ExternalLink } from "lucide-react"
import { openInAboutBlank } from "@/utils/link-utils"

interface MangaReadButtonProps {
  url: string
  title?: string
  className?: string
}

export function MangaReadButton({ url, title = "Read Manga Online", className = "" }: MangaReadButtonProps) {
  return (
    <button
      onClick={() => openInAboutBlank(url)}
      className={`flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors ${className}`}
    >
      <BookOpen className="mr-2 h-5 w-5" />
      {title}
      <ExternalLink className="ml-2 h-4 w-4" />
    </button>
  )
}
