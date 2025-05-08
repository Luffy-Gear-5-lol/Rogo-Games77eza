"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle, ExternalLink, Maximize, SkipForward, ThumbsUp, ThumbsDown, Eye } from "lucide-react"
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
import GameCredits from "@/components/game-credits"
import { getGameCredits } from "@/data/game-credits"

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
  const credits = getGameCredits(slug)

  // Calculate like percentage
  const totalVotes = likes + dislikes
  const likePercentage = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : 0

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

  // Format numbers with k for thousands
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + " k"
    }
    return num.toString()
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

        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">{game.title}</h1>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
            {game.categories &&
              game.categories.map((category) => (
                <span key={category} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              ))}
          </div>
          <p className="text-gray-400 text-center md:text-left">{game.description}</p>

          {/* YouTube-style rating system */}
          <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
            <div className="flex items-center bg-gray-800/80 rounded-full px-1 py-1">
              <button
                onClick={handleLike}
                className={`flex items-center px-3 py-1 rounded-l-full ${userVote === "like" ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
                aria-label="Like game"
              >
                <ThumbsUp size={18} className="mr-2" />
                <span className="text-sm font-medium">{formatNumber(likes)}</span>
              </button>

              <div className="h-5 w-px bg-gray-700 mx-1"></div>

              <button
                onClick={handleDislike}
                className={`flex items-center px-3 py-1 rounded-r-full ${userVote === "dislike" ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
                aria-label="Dislike game"
              >
                <ThumbsDown size={18} className="mr-2" />
                <span className="text-sm font-medium">{formatNumber(dislikes)}</span>
              </button>
            </div>

            <div className="bg-gray-800/80 text-white font-medium text-sm px-3 py-1 rounded-full">
              {likePercentage}%
            </div>

            <div className="ml-auto flex items-center text-gray-400">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatNumber(viewCount)} views</span>
            </div>
          </div>
        </div>

        {/* Game unavailable notification */}
        {!game.isWorking && (
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="bg-red-500/20 p-2 rounded-full mr-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-red-400 text-lg">Game Currently Unavailable</h3>
                <p className="text-gray-300 text-sm mt-1">
                  This game is currently not working. Our team is working to fix it. Please try another game or check
                  back later.
                </p>
              </div>
            </div>
            <div className="mt-3 pl-10">
              <Button
                variant="outline"
                size="sm"
                className="text-red-400 border-red-700/50 hover:bg-red-900/30"
                onClick={() => router.push("/")}
              >
                Browse Other Games
              </Button>
            </div>
          </div>
        )}

        {/* Game frame */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-8 relative shadow-xl shadow-purple-900/10 border border-gray-700">
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
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-sm">
              <Button onClick={handleSkipAd} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <SkipForward className="h-4 w-4 mr-1" /> Skip Ad
              </Button>
              <div className="flex gap-2">
                <Button onClick={toggleFullscreen} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Maximize className="h-4 w-4 mr-1" /> Fullscreen
                </Button>
                <Button
                  onClick={() => setShowComplaint(true)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <p className="text-gray-300">{game.controls}</p>
          </div>

          {credits && (
            <div>
              <GameCredits
                modCredits={credits.modCredits}
                originalCredits={credits.originalCredits}
                additionalInfo={credits.additionalInfo}
                songs={credits.songs}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
