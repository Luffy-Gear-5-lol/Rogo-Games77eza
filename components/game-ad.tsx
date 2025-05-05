"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GameAdProps {
  onComplete: () => void
}

export default function GameAd({ onComplete }: GameAdProps) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [canSkip, setCanSkip] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete()
          return 0
        }
        return prev - 1
      })

      if (timeLeft <= 25) {
        setCanSkip(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onComplete])

  const handleSkip = () => {
    if (canSkip) {
      onComplete()
    }
  }

  return (
    <div className="relative w-full h-full bg-gray-900 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-sm text-gray-300">Ad: {timeLeft}s</span>
        {canSkip && (
          <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleSkip}>
            <X className="h-3 w-3" /> Skip
          </Button>
        )}
      </div>

      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-center">Advertisement</h3>
        <div className="aspect-video bg-gray-700 mb-4 flex items-center justify-center">
          <p className="text-gray-400">Ad Content</p>
        </div>
        <p className="text-sm text-gray-400 text-center">
          This is a sample advertisement. In a real implementation, this would be replaced with actual ad content.
        </p>
      </div>
    </div>
  )
}
