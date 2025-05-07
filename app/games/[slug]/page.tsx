"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle, ExternalLink, Maximize, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { games } from "@/data/games"
import {
  incrementGameView,
  likeGame,
  dislikeGame,
  getGameLikes,
  unlikeGame,
  undislikeGame,
} from "@/actions/game-actions"
import GameComplaintForm from "@/components/game-complaint-form"
import GameAd from "@/components/game-ad"
import { ThumbsUp, ThumbsDown } from "lucide-react"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showComplaint, setShowComplaint] = useState(false)
  const [showAd, setShowAd] = useState(true)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null)
  const [recentlyPlayed, setRecentlyPlayed] = useState<number[]>([])
  const [viewCount, setViewCount] = useState(0)

  const slug = params?.slug as string
  const game = games.find((g) => g.slug === slug)

  useEffect(() => {
    if (game) {
      // Record the view
      incrementGameView(game.id).then((count) => {
        setViewCount(count)
      })

      // Get likes/dislikes
      getGameLikes(game.id).then((data) => {
        setLikes(data.likes || 0)
        setDislikes(data.dislikes || 0)
      })

      // Check if user has voted before
      const votes = localStorage.getItem("gameVotes")
      if (votes) {
        const votesObj = JSON.parse(votes)
        if (votesObj[game.id]) {
          setUserVote(votesObj[game.id])
        }
      }

      // Add to recently played
      const recent = localStorage.getItem("recentlyPlayed")
      let recentGames: number[] = recent ? JSON.parse(recent) : []

      // Remove this game if it exists already
      recentGames = recentGames.filter((id) => id !== game.id)

      // Add to front of array
      recentGames.unshift(game.id)

      // Keep only last 5
      if (recentGames.length > 5) {
        recentGames = recentGames.slice(0, 5)
      }

      localStorage.setItem("recentlyPlayed", JSON.stringify(recentGames))
      setRecentlyPlayed(recentGames)
    }
  }, [game])

  const handleAdComplete = () => {
    setShowAd(false)
    setIsLoading(false)
  }

  const handleSkipAd = () => {
    setShowAd(false)
    setIsLoading(false)
  }

  const handleLike = async () => {
    if (!game) return

    try {
      // If user already liked, unlike
      if (userVote === "like") {
        const newLikes = await unlikeGame(game.id)
        setLikes(newLikes)
        setUserVote(null)

        // Update localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        delete votesObj[game.id]
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      } else {
        // If user previously disliked, remove that first
        if (userVote === "dislike") {
          const newDislikes = await undislikeGame(game.id)
          setDislikes(newDislikes)
        }

        // Like the game
        const newLikes = await likeGame(game.id)
        setLikes(newLikes)
        setUserVote("like")

        // Save vote to localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        votesObj[game.id] = "like"
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      }
    } catch (error) {
      console.error("Error handling like:", error)
    }
  }

  const handleDislike = async () => {
    if (!game) return

    try {
      // If user already disliked, undislike
      if (userVote === "dislike") {
        const newDislikes = await undislikeGame(game.id)
        setDislikes(newDislikes)
        setUserVote(null)

        // Update localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        delete votesObj[game.id]
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      } else {
        // If user previously liked, remove that first
        if (userVote === "like") {
          const newLikes = await unlikeGame(game.id)
          setLikes(newLikes)
        }

        // Dislike the game
        const newDislikes = await dislikeGame(game.id)
        setDislikes(newDislikes)
        setUserVote("dislike")

        // Save vote to localStorage
        const votes = localStorage.getItem("gameVotes") || "{}"
        const votesObj = JSON.parse(votes)
        votesObj[game.id] = "dislike"
        localStorage.setItem("gameVotes", JSON.stringify(votesObj))
      }
    } catch (error) {
      console.error("Error handling dislike:", error)
    }
  }

  const openInNewTab = () => {
    if (!game) return

    const newWindow = window.open("about:blank", "_blank")
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${game.title}</title>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${game.playUrl}" allowfullscreen></iframe>
        </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  const toggleFullscreen = () => {
    const gameFrame = document.querySelector("iframe")
    if (!gameFrame) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      gameFrame.requestFullscreen()
    }
  }

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => router.push("/")} variant="outline" className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
          <div className="flex gap-2">
            <Button onClick={openInNewTab} variant="outline" className="text-sm">
              <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
            </Button>
            <Button onClick={() => setShowComplaint(!showComplaint)} variant="ghost" className="text-sm text-red-400">
              Report Issue
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {game.categories &&
              game.categories.map((category) => (
                <span key={category} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              ))}
          </div>
          <p className="text-gray-400">{game.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${userVote === "like" ? "text-green-400" : "text-gray-400"}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" /> {likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${userVote === "dislike" ? "text-red-400" : "text-gray-400"}`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" /> {dislikes}
            </Button>
            <span className="text-xs text-gray-500">{viewCount} views</span>
          </div>
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

        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 relative">
          <div className="aspect-video w-full">
            {isLoading ? (
              showAd ? (
                <>
                  <GameAd onComplete={handleAdComplete} />
                  <Button
                    onClick={handleSkipAd}
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 left-4 bg-black/70 hover:bg-black/90 text-white"
                  >
                    <SkipForward className="h-4 w-4 mr-1" /> Skip Ad
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold mb-2">Loading Game</h3>
                    <p className="text-gray-400">Please wait while the game loads...</p>
                  </div>
                </div>
              )
            ) : game.isWorking ? (
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

          {/* Game controls at the bottom */}
          {!isLoading && game.isWorking && (
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between bg-black/50">
              <Button onClick={handleSkipAd} variant="ghost" size="sm" className="text-white hover:bg-black/30">
                <SkipForward className="h-4 w-4 mr-1" /> Skip Ad
              </Button>
              <div className="flex gap-2">
                <Button onClick={toggleFullscreen} variant="ghost" size="sm" className="text-white hover:bg-black/30">
                  <Maximize className="h-4 w-4 mr-1" /> Fullscreen
                </Button>
                <Button
                  onClick={() => setShowComplaint(true)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-black/30"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" /> Report Issue
                </Button>
              </div>
            </div>
          )}
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
