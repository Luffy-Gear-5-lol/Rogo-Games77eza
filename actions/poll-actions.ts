"use server"

import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { isAdmin } from "@/utils/admin-utils"
import type { Poll } from "@/types/poll"

// Path to a JSON file that will store polls
const pollsFilePath = path.join(process.cwd(), "data", "polls.json")

// Teen-friendly poll questions about the site
const pollQuestions = [
  {
    question: "What's your favorite game category on our site?",
    options: ["Action", "Adventure", "Arcade", "Puzzle", "Racing", "Sports", "Strategy", "Simulation"],
  },
  {
    question: "How often do you visit Rogo Games?",
    options: ["Daily", "Several times a week", "Weekly", "Monthly", "First time here"],
  },
  {
    question: "What feature would you like to see added to Rogo Games?",
    options: ["Game ratings", "Comments", "Achievements", "Multiplayer", "Game recommendations", "More categories"],
  },
  {
    question: "What device do you usually use to play our games?",
    options: ["Desktop", "Laptop", "Tablet", "Smartphone"],
  },
  {
    question: "How did you discover Rogo Games?",
    options: ["Search engine", "Social media", "Friend recommendation", "School", "Other"],
  },
  {
    question: "What time of day do you usually play games on our site?",
    options: ["Morning", "Afternoon", "Evening", "Late night"],
  },
  {
    question: "Which game series on our site is your favorite?",
    options: ["Papa's Games", "FNAF", "Minecraft", "Racing Games", "Puzzle Games", "Sports Games"],
  },
  {
    question: "How long do you typically play games on our site in one session?",
    options: ["Less than 15 minutes", "15-30 minutes", "30-60 minutes", "1-2 hours", "More than 2 hours"],
  },
  {
    question: "What's most important to you when choosing a game to play?",
    options: ["Graphics", "Gameplay", "Difficulty level", "Game length", "Popularity", "Category"],
  },
  {
    question: "Which new game category would you like to see more of?",
    options: ["Educational", "Music/Rhythm", "Platformer", "Tower Defense", "Idle/Clicker", "Multiplayer"],
  },
  {
    question: "How would you rate the game selection on Rogo Games?",
    options: ["Excellent", "Good", "Average", "Needs improvement", "Poor"],
  },
  {
    question: "What's your age group?",
    options: ["Under 13", "13-15", "16-18", "19-24", "25+"],
  },
  {
    question: "Would you recommend Rogo Games to your friends?",
    options: ["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"],
  },
  {
    question: "What would make you visit Rogo Games more often?",
    options: ["More games", "Better game quality", "Rewards system", "Tournaments", "Social features"],
  },
]

// Get the next day at midnight for daily poll expiration
function getNextDayMidnight(): Date {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

// Get poll expiration for current day (end of day)
function getEndOfDay(): Date {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay
}

// Initialize the polls file if it doesn't exist
const initPollsFile = () => {
  try {
    if (!fs.existsSync(path.dirname(pollsFilePath))) {
      fs.mkdirSync(path.dirname(pollsFilePath), { recursive: true })
    }

    if (!fs.existsSync(pollsFilePath)) {
      const initialPoll = createNewPoll()
      fs.writeFileSync(pollsFilePath, JSON.stringify({ polls: [initialPoll] }, null, 2))
      return { polls: [initialPoll] }
    }

    const pollsData = JSON.parse(fs.readFileSync(pollsFilePath, "utf-8"))

    // Check if the current poll has expired
    const currentPoll = pollsData.polls[0]
    if (currentPoll) {
      const expirationDate = new Date(currentPoll.expiresAt)
      const now = new Date()

      if (now >= expirationDate) {
        // Current poll has expired, create a new one
        const newPoll = createNewPoll()
        pollsData.polls.unshift(newPoll)

        // Keep only the last 10 polls
        if (pollsData.polls.length > 10) {
          pollsData.polls = pollsData.polls.slice(0, 10)
        }

        fs.writeFileSync(pollsFilePath, JSON.stringify(pollsData, null, 2))
      }
    }

    return pollsData
  } catch (error) {
    console.error("Error initializing polls file:", error)
    // Return a default structure with a fallback poll
    return {
      polls: [createNewPoll()],
    }
  }
}

// Create a new poll with a random question
function createNewPoll(): Poll {
  try {
    // Use a different question than the previous poll if possible
    const previousPolls = fs.existsSync(pollsFilePath) ? JSON.parse(fs.readFileSync(pollsFilePath, "utf-8")).polls : []

    let randomIndex = Math.floor(Math.random() * pollQuestions.length)

    // Try to avoid repeating the most recent question if there are multiple options
    if (previousPolls.length > 0 && pollQuestions.length > 1) {
      const lastQuestion = previousPolls[0].question
      let attempts = 0

      while (pollQuestions[randomIndex].question === lastQuestion && attempts < 5) {
        randomIndex = Math.floor(Math.random() * pollQuestions.length)
        attempts++
      }
    }

    const { question, options } = pollQuestions[randomIndex]

    // Set expiration to end of day (daily polls)
    const expiresAt = getEndOfDay()
    const now = new Date()
    const createdAt = now

    return {
      id: uuidv4(),
      question,
      options: options.map((text) => ({
        id: uuidv4(),
        text,
        votes: 0, // Always start with zero votes
      })),
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }
  } catch (error) {
    console.error("Error creating new poll:", error)
    // Return a fallback poll
    return {
      id: uuidv4(),
      question: "What's your favorite game on our site?",
      options: [
        { id: uuidv4(), text: "Flappy Bird", votes: 0 },
        { id: uuidv4(), text: "Minecraft", votes: 0 },
        { id: uuidv4(), text: "Among Us", votes: 0 },
        { id: uuidv4(), text: "FNAF", votes: 0 },
      ],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    }
  }
}

// Get the current active poll (question only for non-admins)
export async function getCurrentPoll(): Promise<Poll | null> {
  try {
    const { polls } = initPollsFile()
    const currentPoll = polls[0] || null

    // If not admin, return the poll without vote counts
    if (!isAdmin() && currentPoll) {
      return {
        ...currentPoll,
        options: currentPoll.options.map((option) => ({
          ...option,
          // Keep votes visible for everyone
        })),
      }
    }

    return currentPoll
  } catch (error) {
    console.error("Error getting current poll:", error)
    return null
  }
}

// Get all polls (for admin only)
export async function getAllPolls(): Promise<Poll[]> {
  try {
    if (!isAdmin()) {
      return []
    }
    const { polls } = initPollsFile()
    return polls
  } catch (error) {
    console.error("Error getting all polls:", error)
    return []
  }
}

// Vote on a poll option
export async function voteOnPoll(pollId: string, optionId: string): Promise<boolean> {
  try {
    const pollsData = initPollsFile()
    const pollIndex = pollsData.polls.findIndex((p: Poll) => p.id === pollId)

    if (pollIndex === -1) return false

    const poll = pollsData.polls[pollIndex]
    const optionIndex = poll.options.findIndex((o) => o.id === optionId)

    if (optionIndex === -1) return false

    // Increment vote count
    if (!poll.options[optionIndex].votes) {
      poll.options[optionIndex].votes = 0
    }
    poll.options[optionIndex].votes += 1

    // Save updated polls
    fs.writeFileSync(pollsFilePath, JSON.stringify(pollsData, null, 2))

    return true
  } catch (error) {
    console.error("Error voting on poll:", error)
    return false
  }
}

// Get the next poll change time (daily now)
export async function getNextPollChangeTime(): Promise<{
  currentPollEnds: string
  nextPollStarts: string
}> {
  try {
    const endOfDay = getEndOfDay()
    const nextDay = getNextDayMidnight()

    return {
      currentPollEnds: endOfDay.toISOString(),
      nextPollStarts: nextDay.toISOString(),
    }
  } catch (error) {
    console.error("Error getting next poll change time:", error)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return {
      currentPollEnds: tomorrow.toISOString(),
      nextPollStarts: tomorrow.toISOString(),
    }
  }
}
