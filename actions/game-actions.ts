"use server"

import fs from "fs"
import path from "path"
import { games } from "@/data/games"

// Path to a JSON file that will store view counts
const viewsFilePath = path.join(process.cwd(), "data", "game-views.json")
const likesFilePath = path.join(process.cwd(), "data", "game-likes.json")

// Initialize the views file if it doesn't exist
const initViewsFile = () => {
  if (!fs.existsSync(path.dirname(viewsFilePath))) {
    fs.mkdirSync(path.dirname(viewsFilePath), { recursive: true })
  }

  if (!fs.existsSync(viewsFilePath)) {
    // Initialize with all games having 0 views
    const initialViews = {
      lastReset: new Date().toISOString(),
      games: games.reduce(
        (acc, game) => {
          // Start all games with 0 views
          acc[game.id] = []
          return acc
        },
        {} as Record<number, string[]>,
      ),
    }

    fs.writeFileSync(viewsFilePath, JSON.stringify(initialViews, null, 2))
    return initialViews
  }

  const viewsData = JSON.parse(fs.readFileSync(viewsFilePath, "utf-8"))

  // Check if we need to reset the popular games (every 2 weeks)
  const lastReset = new Date(viewsData.lastReset || new Date(0))
  const now = new Date()
  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000

  if (now.getTime() - lastReset.getTime() > twoWeeksInMs) {
    // It's been more than 2 weeks, reset the lastReset timestamp
    viewsData.lastReset = now.toISOString()
    fs.writeFileSync(viewsFilePath, JSON.stringify(viewsData, null, 2))
  }

  return viewsData
}

// Initialize the likes file if it doesn't exist
const initLikesFile = () => {
  if (!fs.existsSync(path.dirname(likesFilePath))) {
    fs.mkdirSync(path.dirname(likesFilePath), { recursive: true })
  }

  if (!fs.existsSync(likesFilePath)) {
    // Initialize with all games having 0 likes and dislikes
    const initialLikes = {
      games: games.reduce(
        (acc, game) => {
          acc[game.id] = { likes: 0, dislikes: 0 }
          return acc
        },
        {} as Record<number, { likes: number; dislikes: number }>,
      ),
    }

    fs.writeFileSync(likesFilePath, JSON.stringify(initialLikes, null, 2))
    return initialLikes
  }

  return JSON.parse(fs.readFileSync(likesFilePath, "utf-8"))
}

// Get all game views - accessible to everyone
export async function getGameViews(): Promise<Record<number, number>> {
  try {
    const viewsData = initViewsFile()

    // Count total views for each game
    const totalViews: Record<number, number> = {}

    for (const [gameId, timestamps] of Object.entries(viewsData.games)) {
      totalViews[Number(gameId)] = timestamps.length
    }

    return totalViews
  } catch (error) {
    console.error("Error getting game views:", error)
    return {}
  }
}

// Increment view count for a specific game
export async function incrementGameView(gameId: number): Promise<number> {
  try {
    const viewsData = initViewsFile()

    // Initialize the game's view array if it doesn't exist
    if (!viewsData.games[gameId]) {
      viewsData.games[gameId] = []
    }

    // Add the current timestamp to the game's views
    viewsData.games[gameId].push(new Date().toISOString())

    // Save the updated views
    fs.writeFileSync(viewsFilePath, JSON.stringify(viewsData, null, 2))

    // Return the total view count to everyone
    return viewsData.games[gameId].length
  } catch (error) {
    console.error("Error incrementing game view:", error)
    return 0
  }
}

// Get popular games based on view count
export async function getPopularGames(limit = 20): Promise<number[]> {
  try {
    const viewsData = initViewsFile()

    // Calculate views for each game
    const gameViews: [string, number][] = Object.entries(viewsData.games).map(([gameId, timestamps]) => {
      return [gameId, timestamps.length]
    })

    // Sort by view count and filter for games with at least 5 views (lowered threshold for testing)
    return gameViews
      .filter(([, count]) => count >= 5)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([id]) => Number(id))
      .slice(0, limit)
  } catch (error) {
    console.error("Error getting popular games:", error)
    return []
  }
}

// Check if a game is popular (has 5+ views - lowered threshold for testing)
export async function isGamePopular(gameId: number): Promise<boolean> {
  try {
    const viewsData = initViewsFile()

    if (!viewsData.games[gameId]) return false

    return viewsData.games[gameId].length >= 5
  } catch (error) {
    console.error("Error checking if game is popular:", error)
    return false
  }
}

// Get the date of the next popular games reset
export async function getNextPopularReset(): Promise<string> {
  try {
    const viewsData = initViewsFile()
    const lastReset = new Date(viewsData.lastReset)
    const nextReset = new Date(lastReset.getTime() + 14 * 24 * 60 * 60 * 1000)
    return nextReset.toISOString()
  } catch (error) {
    console.error("Error getting next popular reset:", error)
    const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    return twoWeeksFromNow.toISOString()
  }
}

// Like a game
export async function likeGame(gameId: number): Promise<number> {
  try {
    const likesData = initLikesFile()

    // Initialize the game's likes if it doesn't exist
    if (!likesData.games[gameId]) {
      likesData.games[gameId] = { likes: 0, dislikes: 0 }
    }

    // Increment likes
    likesData.games[gameId].likes += 1

    // Save the updated likes
    fs.writeFileSync(likesFilePath, JSON.stringify(likesData, null, 2))

    return likesData.games[gameId].likes
  } catch (error) {
    console.error("Error liking game:", error)
    return 0
  }
}

// Unlike a game
export async function unlikeGame(gameId: number): Promise<number> {
  try {
    const likesData = initLikesFile()

    // Initialize the game's likes if it doesn't exist
    if (!likesData.games[gameId]) {
      likesData.games[gameId] = { likes: 0, dislikes: 0 }
    }

    // Decrement likes, but don't go below 0
    likesData.games[gameId].likes = Math.max(0, likesData.games[gameId].likes - 1)

    // Save the updated likes
    fs.writeFileSync(likesFilePath, JSON.stringify(likesData, null, 2))

    return likesData.games[gameId].likes
  } catch (error) {
    console.error("Error unliking game:", error)
    return 0
  }
}

// Dislike a game
export async function dislikeGame(gameId: number): Promise<number> {
  try {
    const likesData = initLikesFile()

    // Initialize the game's likes if it doesn't exist
    if (!likesData.games[gameId]) {
      likesData.games[gameId] = { likes: 0, dislikes: 0 }
    }

    // Increment dislikes
    likesData.games[gameId].dislikes += 1

    // Save the updated likes
    fs.writeFileSync(likesFilePath, JSON.stringify(likesData, null, 2))

    return likesData.games[gameId].dislikes
  } catch (error) {
    console.error("Error disliking game:", error)
    return 0
  }
}

// Undislike a game
export async function undislikeGame(gameId: number): Promise<number> {
  try {
    const likesData = initLikesFile()

    // Initialize the game's likes if it doesn't exist
    if (!likesData.games[gameId]) {
      likesData.games[gameId] = { likes: 0, dislikes: 0 }
    }

    // Decrement dislikes, but don't go below 0
    likesData.games[gameId].dislikes = Math.max(0, likesData.games[gameId].dislikes - 1)

    // Save the updated likes
    fs.writeFileSync(likesFilePath, JSON.stringify(likesData, null, 2))

    return likesData.games[gameId].dislikes
  } catch (error) {
    console.error("Error undisliking game:", error)
    return 0
  }
}

// Get likes and dislikes for a game
export async function getGameLikes(gameId: number): Promise<{ likes: number; dislikes: number }> {
  try {
    const likesData = initLikesFile()

    // Initialize the game's likes if it doesn't exist
    if (!likesData.games[gameId]) {
      likesData.games[gameId] = { likes: 0, dislikes: 0 }
    }

    return likesData.games[gameId]
  } catch (error) {
    console.error("Error getting game likes:", error)
    return { likes: 0, dislikes: 0 }
  }
}

export async function getAllGames() {
  // Sort games alphabetically, numbers first then A-Z
  return [...games].sort((a, b) => {
    // Check if titles start with numbers
    const aStartsWithNumber = /^\d/.test(a.title)
    const bStartsWithNumber = /^\d/.test(b.title)

    // If one starts with number and the other doesn't, prioritize the one with number
    if (aStartsWithNumber && !bStartsWithNumber) return -1
    if (!aStartsWithNumber && bStartsWithNumber) return 1

    // Otherwise sort alphabetically
    return a.title.localeCompare(b.title)
  })
}
