"use server"

import fs from "fs"
import path from "path"
import { games } from "@/data/games"
import { isAdmin } from "@/utils/admin-utils"

// Path to a JSON file that will store view counts
const viewsFilePath = path.join(process.cwd(), "data", "game-views.json")

// Initialize the views file if it doesn't exist
const initViewsFile = () => {
  if (!fs.existsSync(path.dirname(viewsFilePath))) {
    fs.mkdirSync(path.dirname(viewsFilePath), { recursive: true })
  }

  if (!fs.existsSync(viewsFilePath)) {
    // Initialize with some random games having views
    const initialViews = {
      lastReset: new Date().toISOString(),
      games: games.reduce(
        (acc, game) => {
          // Random views between 0-200 for initial data
          const viewCount = Math.floor(Math.random() * 200)

          // Create an array of timestamps for these views, all within the last 2 weeks
          const now = new Date()
          const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

          const timestamps = []
          for (let i = 0; i < viewCount; i++) {
            // Random time between now and two weeks ago
            const randomTime = new Date(
              twoWeeksAgo.getTime() + Math.random() * (now.getTime() - twoWeeksAgo.getTime()),
            ).toISOString()
            timestamps.push(randomTime)
          }

          acc[game.id] = timestamps
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

// Get all game views - only for admin
export async function getGameViews(): Promise<Record<number, number>> {
  try {
    if (!isAdmin()) {
      return {}
    }

    const viewsData = initViewsFile()
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    // Count views within the last 2 weeks for each game
    const recentViews: Record<number, number> = {}

    for (const [gameId, timestamps] of Object.entries(viewsData.games)) {
      const recentTimestamps = timestamps.filter((timestamp) => timestamp >= twoWeeksAgo)
      recentViews[Number(gameId)] = recentTimestamps.length
    }

    return recentViews
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

    // Only return the view count to admins
    if (isAdmin()) {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      const recentViews = viewsData.games[gameId].filter((timestamp) => timestamp >= twoWeeksAgo).length
      return recentViews
    }
    return 0
  } catch (error) {
    console.error("Error incrementing game view:", error)
    return 0
  }
}

// Get popular games based on view count in the last 2 weeks
export async function getPopularGames(limit = 20): Promise<number[]> {
  try {
    const viewsData = initViewsFile()
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    // Calculate recent views for each game
    const recentViews: [string, number][] = Object.entries(viewsData.games).map(([gameId, timestamps]) => {
      const recentCount = timestamps.filter((timestamp) => timestamp >= twoWeeksAgo).length
      return [gameId, recentCount]
    })

    // Sort by recent view count and filter for games with at least 100 views
    return recentViews
      .filter(([, count]) => count >= 100)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([id]) => Number(id))
      .slice(0, limit)
  } catch (error) {
    console.error("Error getting popular games:", error)
    return []
  }
}

// Check if a game is popular (has 100+ views in the last 2 weeks)
export async function isGamePopular(gameId: number): Promise<boolean> {
  try {
    const viewsData = initViewsFile()
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    if (!viewsData.games[gameId]) return false

    const recentViews = viewsData.games[gameId].filter((timestamp) => timestamp >= twoWeeksAgo).length
    return recentViews >= 100
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

export async function getAllGames() {
  return games
}
