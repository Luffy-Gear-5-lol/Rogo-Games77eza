// Maximum number of recently played games to track
const MAX_RECENT_GAMES = 10

// Add a game to recently played
export function addToRecentlyPlayed(gameId: number): void {
  try {
    // Get current recently played games
    const recentlyPlayedJSON = localStorage.getItem("recentlyPlayed")
    let recentlyPlayed: number[] = []

    if (recentlyPlayedJSON) {
      recentlyPlayed = JSON.parse(recentlyPlayedJSON)
    }

    // Remove the game if it's already in the list
    recentlyPlayed = recentlyPlayed.filter((id) => id !== gameId)

    // Add the game to the beginning of the list
    recentlyPlayed.unshift(gameId)

    // Limit the list to MAX_RECENT_GAMES
    if (recentlyPlayed.length > MAX_RECENT_GAMES) {
      recentlyPlayed = recentlyPlayed.slice(0, MAX_RECENT_GAMES)
    }

    // Save the updated list
    localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed))
  } catch (error) {
    console.error("Error updating recently played games:", error)
  }
}

// Get recently played games
export function getRecentlyPlayed(): number[] {
  try {
    const recentlyPlayedJSON = localStorage.getItem("recentlyPlayed")

    if (recentlyPlayedJSON) {
      return JSON.parse(recentlyPlayedJSON)
    }
  } catch (error) {
    console.error("Error getting recently played games:", error)
  }

  return []
}

// Clear recently played games
export function clearRecentlyPlayed(): void {
  localStorage.setItem("recentlyPlayed", JSON.stringify([]))
}
