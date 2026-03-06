"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar, Users, Check, BarChart3 } from "lucide-react"
import type { Poll } from "@/types/poll"

interface PollComponentProps {
  poll: Poll
  voteAction: (pollId: string, optionId: string) => Promise<boolean>
}

export default function PollComponent({ poll, voteAction }: PollComponentProps) {
  if (!poll || !poll.options || !Array.isArray(poll.options)) {
    return (
      <div className="rounded-2xl bg-card border border-border p-8 text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground font-medium">Poll data is currently unavailable</p>
        <p className="text-muted-foreground text-sm mt-2">Please try again later.</p>
      </div>
    )
  }

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pollResults, setPollResults] = useState<Poll>(poll)
  const [userVotedOption, setUserVotedOption] = useState<string | null>(null)

  useEffect(() => {
    const votedPolls = localStorage.getItem("votedPolls") ? JSON.parse(localStorage.getItem("votedPolls") || "{}") : {}
    if (votedPolls[poll.id]) {
      setHasVoted(true)
      setUserVotedOption(votedPolls[poll.id])
    }
  }, [poll.id])

  const totalVotes = pollResults.options.reduce((sum, option) => sum + (option.votes || 0), 0)

  const formatEndDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = date.getTime() - now.getTime()
      
      if (diff < 0) return "Ended"
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(hours / 24)
      
      if (days > 0) return `${days}d ${hours % 24}h left`
      if (hours > 0) return `${hours}h left`
      return "Ending soon"
    } catch {
      return "Date unavailable"
    }
  }

  const handleVote = async () => {
    if (!selectedOption || !poll.id) return

    setIsSubmitting(true)
    try {
      const success = await voteAction(poll.id, selectedOption)

      if (success) {
        setPollResults((prev) => {
          const updatedOptions = prev.options.map((option) => {
            if (option.id === selectedOption) {
              return { ...option, votes: (option.votes || 0) + 1 }
            }
            return option
          })
          return { ...prev, options: updatedOptions }
        })

        setHasVoted(true)
        setUserVotedOption(selectedOption)

        const votedPolls = localStorage.getItem("votedPolls")
          ? JSON.parse(localStorage.getItem("votedPolls") || "{}")
          : {}
        votedPolls[poll.id] = selectedOption
        localStorage.setItem("votedPolls", JSON.stringify(votedPolls))
      }
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sort options by votes for results display
  const sortedOptions = hasVoted 
    ? [...pollResults.options].sort((a, b) => (b.votes || 0) - (a.votes || 0))
    : pollResults.options

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-pink-500/10 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{poll.question}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {poll.expiresAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatEndDate(poll.expiresAt)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {totalVotes.toLocaleString()} vote{totalVotes !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          {hasVoted && (
            <div className="flex items-center gap-1 bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-medium">
              <Check className="h-4 w-4" />
              Voted
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {!hasVoted ? (
          <>
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-3 mb-6">
              {poll.options.map((option) => (
                <div 
                  key={option.id} 
                  className={`
                    flex items-center space-x-3 rounded-xl p-4 border-2 transition-all cursor-pointer
                    ${selectedOption === option.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="border-2" />
                  <Label htmlFor={option.id} className="flex-grow cursor-pointer text-foreground font-medium">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button
              onClick={handleVote}
              disabled={!selectedOption || isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl text-lg"
            >
              {isSubmitting ? "Submitting..." : "Vote"}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            {sortedOptions.map((option, index) => {
              const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0
              const isUserVote = option.id === userVotedOption
              const isWinning = index === 0 && (option.votes || 0) > 0

              return (
                <div 
                  key={option.id} 
                  className={`
                    relative rounded-xl overflow-hidden border-2 transition-all
                    ${isUserVote ? 'border-primary' : 'border-border'}
                  `}
                >
                  {/* Background progress bar */}
                  <div 
                    className={`absolute inset-0 transition-all duration-500 ${
                      isWinning 
                        ? 'bg-gradient-to-r from-primary/30 to-pink-500/30' 
                        : 'bg-muted/50'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                  
                  {/* Content */}
                  <div className="relative flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {isUserVote && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      <span className={`font-medium ${isUserVote ? 'text-primary' : 'text-foreground'}`}>
                        {option.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {(option.votes || 0).toLocaleString()} vote{(option.votes || 0) !== 1 ? "s" : ""}
                      </span>
                      <span className={`font-bold text-lg ${isWinning ? 'text-primary' : 'text-foreground'}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Poll updates daily with new questions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
