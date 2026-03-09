"use server"

import { Redis } from "@upstash/redis"
import { v4 as uuidv4 } from "uuid"
import type { Poll } from "@/types/poll"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Redis keys
const CURRENT_POLL_KEY = "rogo:current_poll"
const POLL_DATE_KEY = "rogo:poll_date"

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

// Get today's date as string (YYYY-MM-DD) for daily poll tracking
function getTodayDateString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

// Get poll expiration for current day (end of day)
function getEndOfDay(): Date {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay
}

// Create a new poll with a random question based on date
function createNewPoll(previousQuestion?: string): Poll {
  // Use date-based index for consistent daily poll
  const today = getTodayDateString()
  const dateHash = today.split("-").reduce((acc, val) => acc + parseInt(val), 0)
  let randomIndex = dateHash % pollQuestions.length

  // If this matches the previous question, shift by 1
  if (previousQuestion && pollQuestions[randomIndex].question === previousQuestion) {
    randomIndex = (randomIndex + 1) % pollQuestions.length
  }

  const { question, options } = pollQuestions[randomIndex]
  const expiresAt = getEndOfDay()

  return {
    id: `poll-${today}`,
    question,
    options: options.map((text, index) => ({
      id: `option-${today}-${index}`,
      text,
      votes: 0,
    })),
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
}

// Get the current active poll
export async function getCurrentPoll(): Promise<Poll | null> {
  try {
    const today = getTodayDateString()
    
    // Check if we have a poll for today
    const storedDate = await redis.get<string>(POLL_DATE_KEY)
    const storedPoll = await redis.get<Poll>(CURRENT_POLL_KEY)
    
    // If we have a poll for today, return it
    if (storedDate === today && storedPoll) {
      return storedPoll
    }
    
    // Create a new poll for today
    const previousQuestion = storedPoll?.question
    const newPoll = createNewPoll(previousQuestion)
    
    // Store the new poll
    await redis.set(CURRENT_POLL_KEY, newPoll)
    await redis.set(POLL_DATE_KEY, today)
    
    return newPoll
  } catch (error) {
    console.error("Error getting current poll:", error)
    // Return a fallback poll
    return createNewPoll()
  }
}

// Vote on a poll option
export async function voteOnPoll(pollId: string, optionId: string): Promise<boolean> {
  try {
    const poll = await redis.get<Poll>(CURRENT_POLL_KEY)
    
    if (!poll || poll.id !== pollId) {
      return false
    }
    
    const optionIndex = poll.options.findIndex((o) => o.id === optionId)
    
    if (optionIndex === -1) {
      return false
    }
    
    // Increment vote count
    poll.options[optionIndex].votes = (poll.options[optionIndex].votes || 0) + 1
    
    // Save updated poll
    await redis.set(CURRENT_POLL_KEY, poll)
    
    return true
  } catch (error) {
    console.error("Error voting on poll:", error)
    return false
  }
}

// Get the next poll change time (daily)
export async function getNextPollChangeTime(): Promise<{
  currentPollEnds: string
  nextPollStarts: string
}> {
  const endOfDay = getEndOfDay()
  const nextDay = new Date(endOfDay)
  nextDay.setDate(nextDay.getDate() + 1)
  nextDay.setHours(0, 0, 0, 0)

  return {
    currentPollEnds: endOfDay.toISOString(),
    nextPollStarts: nextDay.toISOString(),
  }
}
