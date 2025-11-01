/**
 * Utility functions for loading and optimizing game images
 */

export function getGameImageAlt(gameTitle: string): string {
  return `${gameTitle} cover art`
}

export function getGameImageLoader(id: number) {
  return ({ src }: { src: string }) => {
    // If it's already a full URL, return it
    if (src.startsWith("http") || src.startsWith("/")) {
      return src
    }
    // Otherwise construct the path
    return `/images/games/${src}`
  }
}

/**
 * Get responsive image sizes for game cards
 */
export const gameImageSizes = {
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  featured: "100vw",
  grid: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}

/**
 * Preload critical game images
 */
export function preloadGameImages(gameIds: number[]) {
  if (typeof window !== "undefined") {
    gameIds.forEach((id) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = `/placeholder.svg?height=300&width=400&query=game${id}`
      document.head.appendChild(link)
    })
  }
}
