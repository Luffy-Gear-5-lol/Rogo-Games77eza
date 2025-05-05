"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { games } from "@/data/games"
import { incrementGameView } from "@/actions/game-actions"
import { GameLoading } from "@/components/game-loading"
import GameComplaintForm from "@/components/game-complaint-form"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showComplaint, setShowComplaint] = useState(false)

  const slug = params?.slug as string
  const game = games.find((g) => g.slug === slug)

  useEffect(() => {
    if (game) {
      // Record the view
      incrementGameView(game.id)

      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [game])

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-gray-400 mb-8">Sorry, we couldn't find the game you're looking for.</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {isLoading && <GameLoading />}

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => router.push("/")} variant="outline" className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
          <Button onClick={() => setShowComplaint(!showComplaint)} variant="ghost" className="text-sm text-red-400">
            Report Issue
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {game.categories.map((category) => (
              <span key={category} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>
          <p className="text-gray-400">{game.description}</p>
        </div>

        {!game.isWorking && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-400">Game Currently Unavailable</h3>
              <p className="text-gray-300 text-sm">
                This game is currently not working. Our team is working to fix it. Please try another game or check back
                later.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <div className="aspect-video w-full">
            {game.isWorking ? (
              <iframe src={game.playUrl} className="w-full h-full border-0" allowFullScreen title={game.title}></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center p-6">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Game Unavailable</h3>
                  <p className="text-gray-400 max-w-md">
                    This game is currently not working. Our team is working to fix it. Please try another game or check
                    back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {showComplaint && (
          <GameComplaintForm gameId={game.id} gameTitle={game.title} onClose={() => setShowComplaint(false)} />
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">How to Play</h2>
          <p className="text-gray-300 mb-4">{game.controls}</p>
        </div>
      </div>
    </div>
  )
}
