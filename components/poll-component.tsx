"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import { isAdmin } from "@/utils/admin-utils"
import type { Poll } from "@/types/poll"

interface PollComponentProps {
  poll: Poll
  voteAction: (pollId: string, optionId: string) => Promise<boolean>
}

export default function PollComponent({ poll, voteAction }: PollComponentProps) {
  // Safety check - if poll is undefined or doesn't have options, show a fallback
  if (!poll || !poll.options || !Array.isArray(poll.options)) {
    return (
      <div className="rounded-lg bg-gray-800 p-6 text-center">
        <p>Sorry, the poll data is currently unavailable. Please try again later.</p>
      </div>
    )
  }

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const showResults = isAdmin() // Only admins can see results

  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0)

  // Format the poll end date
  const formatEndDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      return "Date unavailable"
    }
  }

  const handleVote = async () => {
    if (!selectedOption || !poll.id) return

    setIsSubmitting(true)
    const success = await voteAction(poll.id, selectedOption)
    setIsSubmitting(false)

    if (success) {
      setHasVoted(true)
    }
  }

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{poll.question}</h2>
        {poll.expiresAt && (
          <p className="text-sm text-gray-400 flex items-center">
            <Calendar className="mr-1 h-3 w-3" /> Poll ends: {formatEndDate(poll.expiresAt)}
          </p>
        )}
      </div>

      {!hasVoted ? (
        <>
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-3 mb-6">
            {poll.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-700">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? "Submitting..." : "Vote"}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          {showResults ? (
            <>
              <p className="font-medium text-center mb-4">Thanks for voting! Here are the current results:</p>

              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0

                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option.text}</span>
                      <span>
                        {option.votes || 0} vote{(option.votes || 0) !== 1 ? "s" : ""} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}

              <p className="text-center text-sm text-gray-400 mt-4">Total votes: {totalVotes}</p>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="font-medium">Thanks for voting!</p>
              <p className="text-gray-400 mt-2">Your vote has been recorded.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
