"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitGameComplaint } from "@/actions/complaint-actions"
import { AlertCircle } from "lucide-react"

interface GameComplaintFormProps {
  gameId: number
  gameTitle: string
  onClose: () => void
}

export default function GameComplaintForm({ gameId, gameTitle, onClose }: GameComplaintFormProps) {
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      setError("Please describe the issue with the game")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const success = await submitGameComplaint(gameId, description, email)

      if (success) {
        setIsSubmitted(true)
      } else {
        setError("Failed to submit complaint. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <div className="text-center mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-900 mb-4">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
          <p className="text-gray-300">
            Your complaint about {gameTitle} has been submitted. We'll look into the issue as soon as possible.
          </p>
        </div>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Report an Issue with {gameTitle}</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Describe the issue
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's wrong with the game? Is it not loading, showing errors, or something else?"
            className="bg-gray-700 border-gray-600 min-h-[100px]"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Your email (optional)
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="We'll notify you when it's fixed"
            className="bg-gray-700 border-gray-600"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1 bg-red-600 hover:bg-red-700">
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
