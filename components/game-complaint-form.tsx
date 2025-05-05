"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

interface GameComplaintFormProps {
  gameId: number
  gameTitle: string
  onClose: () => void
}

export default function GameComplaintForm({ gameId, gameTitle, onClose }: GameComplaintFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [issueType, setIssueType] = useState("")
  const [description, setDescription] = useState("")
  const [browserInfo, setBrowserInfo] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // List of programming languages for the compatibility section
  const programmingLanguages = [
    "JavaScript",
    "HTML5",
    "ActionScript",
    "Unity WebGL",
    "Java",
    "C#",
    "Python",
    "TypeScript",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would send this data to your server
    console.log({
      gameId,
      gameTitle,
      name,
      email,
      issueType,
      description,
      browserInfo,
      submittedAt: new Date().toISOString(),
    })

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-gray-800 p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-500/20 p-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold">Thank You!</h2>
        <p className="mb-6 text-gray-400">
          Your report has been submitted. We appreciate your feedback and will review the issue as soon as possible.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-2 text-xl font-bold">Report an Issue</h2>
      <p className="mb-6 text-gray-400">Help us improve {gameTitle} by reporting any issues you encounter.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 border-gray-600"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 border-gray-600"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="issueType">Issue Type</Label>
          <Select value={issueType} onValueChange={setIssueType} required>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="game_not_loading">Game Not Loading</SelectItem>
              <SelectItem value="game_freezing">Game Freezing or Crashing</SelectItem>
              <SelectItem value="controls_not_working">Controls Not Working</SelectItem>
              <SelectItem value="audio_issues">Audio Issues</SelectItem>
              <SelectItem value="visual_bugs">Visual Bugs</SelectItem>
              <SelectItem value="gameplay_issues">Gameplay Issues</SelectItem>
              <SelectItem value="compatibility">Compatibility Issues</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {issueType === "compatibility" && (
          <div className="grid gap-2">
            <Label htmlFor="programmingLanguage">Related Programming Language</Label>
            <Select onValueChange={(val) => setBrowserInfo((prev) => `${prev} - Language: ${val}`)}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {programmingLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400">
              Our games support multiple programming languages including Java, JavaScript, HTML, Rust, Ruby, Lua, Haxe,
              C, C++, C#, Python, TypeScript, CSS, PHP, Go, Swift, and ActionScript.
            </p>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] bg-gray-700 border-gray-600"
            placeholder="Please describe the issue in detail..."
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="browserInfo">Browser & Device Information</Label>
          <Input
            id="browserInfo"
            value={browserInfo}
            onChange={(e) => setBrowserInfo(e.target.value)}
            className="bg-gray-700 border-gray-600"
            placeholder="e.g. Chrome 98 on Windows 10"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </div>
  )
}
