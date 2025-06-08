"use client"

import { BookOpen, ExternalLink } from "lucide-react"
import type React from "react"

interface MangaReadButtonProps {
  url: string
  title?: string
  className?: string
}

export function MangaReadButton({ url, title = "Read Manga Online", className = "" }: MangaReadButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const newWindow = window.open("about:blank", "_blank")
    if (newWindow) {
      // Keep the window on about:blank and use a hidden iframe to load the content
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reading Manga</title>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${url}" allowfullscreen></iframe>
        </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors ${className}`}
    >
      <BookOpen className="mr-2 h-5 w-5" />
      {title}
      <ExternalLink className="ml-2 h-4 w-4" />
    </button>
  )
}
