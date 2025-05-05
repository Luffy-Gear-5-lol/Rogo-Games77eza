import type { Game } from "@/types/game"

// Function to sort games by numbers first, then alphabetically
export function sortGames(games: Game[]): Game[] {
  return [...games].sort((a, b) => {
    // Check if titles start with numbers
    const aMatch = a.title.match(/^(\d+)/)
    const bMatch = b.title.match(/^(\d+)/)

    // If both titles start with numbers
    if (aMatch && bMatch) {
      const aNum = Number.parseInt(aMatch[1], 10)
      const bNum = Number.parseInt(bMatch[1], 10)
      return aNum - bNum
    }

    // If only a starts with a number
    if (aMatch) return -1

    // If only b starts with a number
    if (bMatch) return 1

    // Otherwise sort alphabetically
    return a.title.localeCompare(b.title)
  })
}
