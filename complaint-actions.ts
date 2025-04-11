"use server"

import fs from "fs"
import path from "path"
import { games } from "@/data/games"
import type { GameComplaint } from "@/types/complaint"

// Path to a JSON file that will store complaints
const complaintsFilePath = path.join(process.cwd(), "data", "complaints.json")
const adminEmail = "chandler.strickland-sutherlin@fwcsstudents.org"

// Initialize the complaints file if it doesn't exist
const initComplaintsFile = () => {
  if (!fs.existsSync(path.dirname(complaintsFilePath))) {
    fs.mkdirSync(path.dirname(complaintsFilePath), { recursive: true })
  }

  if (!fs.existsSync(complaintsFilePath)) {
    fs.writeFileSync(complaintsFilePath, JSON.stringify({ complaints: [] }, null, 2))
    return { complaints: [] }
  }

  return JSON.parse(fs.readFileSync(complaintsFilePath, "utf-8"))
}

// Submit a complaint about a game
export async function submitGameComplaint(gameId: number, description: string, email?: string): Promise<boolean> {
  try {
    const complaintsData = initComplaintsFile()
    const game = games.find((g) => g.id === gameId)

    if (!game) return false

    // Create a new complaint
    const newComplaint: GameComplaint = {
      gameId,
      gameTitle: game.title,
      description,
      email,
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    // Add the complaint to the list
    complaintsData.complaints.push(newComplaint)

    // Save updated complaints
    fs.writeFileSync(complaintsFilePath, JSON.stringify(complaintsData, null, 2))

    // In a real production environment, you would use a proper email service like SendGrid, Mailgun, etc.
    // For now, we'll simulate sending an email with more detailed logging
    console.log("==========================================")
    console.log(`SENDING EMAIL TO: ${adminEmail}`)
    console.log(`SUBJECT: Game Complaint: ${game.title}`)
    console.log(`CONTENT:`)
    console.log(`Game: ${game.title} (ID: ${gameId})`)
    console.log(`Issue: ${description}`)
    if (email) console.log(`From: ${email} (Reply to this address)`)
    console.log(`Timestamp: ${new Date().toLocaleString()}`)
    console.log("==========================================")

    // In a production environment, you would add code like this:
    // await sendEmail({
    //   to: adminEmail,
    //   from: "noreply@rogogames.com",
    //   subject: `Game Complaint: ${game.title}`,
    //   text: `Game: ${game.title} (ID: ${gameId})\nIssue: ${description}\nFrom: ${email || "Anonymous"}\nTimestamp: ${new Date().toLocaleString()}`,
    // });

    // Mark the game as not working in a real app
    // This would update the database or file storage
    // For now, we'll just log it
    console.log(`Game ${game.title} marked as not working`)

    return true
  } catch (error) {
    console.error("Error submitting game complaint:", error)
    return false
  }
}

// Get all complaints (for admin)
export async function getAllComplaints(): Promise<GameComplaint[]> {
  try {
    const { complaints } = initComplaintsFile()
    return complaints
  } catch (error) {
    console.error("Error getting complaints:", error)
    return []
  }
}

// Mark a complaint as resolved
export async function resolveComplaint(gameId: number, timestamp: string): Promise<boolean> {
  try {
    const complaintsData = initComplaintsFile()

    // Find the complaint
    const complaintIndex = complaintsData.complaints.findIndex((c) => c.gameId === gameId && c.timestamp === timestamp)

    if (complaintIndex === -1) return false

    // Mark as resolved
    complaintsData.complaints[complaintIndex].resolved = true

    // Save updated complaints
    fs.writeFileSync(complaintsFilePath, JSON.stringify(complaintsData, null, 2))

    return true
  } catch (error) {
    console.error("Error resolving complaint:", error)
    return false
  }
}
