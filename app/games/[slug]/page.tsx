"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, AlertTriangle, ExternalLink, Maximize, Minimize, ThumbsUp, ThumbsDown, Eye, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { addToRecentlyPlayed } from "@/components/recently-played"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showComplaint, setShowComplaint] = useState(false)
  const [showAd, setShowAd] = useState(true)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null)
  const [viewCount, setViewCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

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
        try {
          const votesObj = JSON.parse(votes)
          if (votesObj[game.id]) {
            setUserVote(votesObj[game.id])
          }
        } catch (e) {
          console.error("Error parsing gameVotes from localStorage:", e)
          localStorage.removeItem("gameVotes") // Clear corrupted data
        }
      }

      // Add to recently played (with timestamp for 2-week expiration)
      addToRecentlyPlayed(game.id)
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
    const gameContainer = document.getElementById("game-container")
    if (!gameContainer) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      gameContainer.requestFullscreen()
      setIsFullscreen(true)
    }
  }
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center bg-card border border-border rounded-2xl p-8 max-w-md">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-foreground">Game Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the game you're looking for.</p>
          <Button onClick={() => router.push("/")} variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <Button onClick={() => router.push("/")} variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
          <div className="flex gap-2">
            <Button onClick={openInNewTab} variant="outline" className="rounded-xl">
              <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
            </Button>
            <Button onClick={() => setShowComplaint(!showComplaint)} variant="ghost" className="text-destructive rounded-xl">
              Report Issue
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center md:text-left text-foreground">{game.title}</h1>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
            {game.categories &&
              game.categories.map((category) => (
                <Badge key={category} className="bg-primary/20 text-primary border-0 px-3 py-1">
                  {category}
                </Badge>
              ))}
          </div>
          <p className="text-muted-foreground text-center md:text-left mb-4">{game.description}</p>

          {/* Game Credits integrated into main info section */}
          {credits && (
            <div className="mb-6 bg-card rounded-xl p-4 border border-border">
              <GameCredits
                modCredits={credits.modCredits}
                originalCredits={credits.originalCredits}
                additionalInfo={credits.additionalInfo}
                songs={credits.songs}
              />
            </div>
          )}

          {/* YouTube-style rating system */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
            <div className="flex items-center bg-muted rounded-full px-1 py-1">
              <button
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-l-full transition-all ${
                  userVote === "like"
                    ? "text-primary-foreground bg-primary font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
                aria-label="Like game"
              >
                <ThumbsUp size={18} className="mr-2" />
                <span className="text-sm font-medium">{formatNumber(likes)}</span>
              </button>

              <div className="h-5 w-px bg-border mx-1"></div>

              <button
                onClick={handleDislike}
                className={`flex items-center px-4 py-2 rounded-r-full transition-all ${
                  userVote === "dislike"
                    ? "text-primary-foreground bg-primary font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
                aria-label="Dislike game"
              >
                <ThumbsDown size={18} className="mr-2" />
                <span className="text-sm font-medium">{formatNumber(dislikes)}</span>
              </button>
            </div>
            <div className="bg-primary/20 text-primary font-bold text-sm px-4 py-2 rounded-full">
              {likePercentage}% liked
            </div>
            <div className="flex items-center text-muted-foreground">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatNumber(viewCount)} views</span>
            </div>
          </div>
        </div>

        {/* Game unavailable notification */}
        {!game.isWorking && (
          <div className="bg-gradient-to-r from-destructive/20 to-orange-500/10 border border-destructive/30 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="bg-destructive/20 p-2 rounded-full mr-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-destructive text-lg">Game Currently Unavailable</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  This game is currently not working. Our team is working to fix it. Please try another game or check
                  back later.
                </p>
              </div>
            </div>
            <div className="mt-3 pl-10">
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/50 hover:bg-destructive/10 rounded-xl"
                onClick={() => router.push("/")}
              >
                Browse Other Games
              </Button>
            </div>
          </div>
        )}

        {/* Game frame */}
        <div 
          id="game-container"
          className={`
            bg-card rounded-2xl overflow-hidden mb-8 relative shadow-xl shadow-primary/10 border border-border
            ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}
          `}
        >
          <div className={`${isFullscreen ? 'h-full' : 'aspect-video'} w-full`}>
            {!gameStarted ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-pink-500/20">
                <div className="text-center p-6">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{game.title}</h3>
                  <p className="text-muted-foreground mb-6">Click to start playing</p>
                  <Button 
                    onClick={() => {
                      setGameStarted(true)
                      setShowAd(true)
                    }}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 rounded-full px-8 font-bold"
                  >
                    <Play className="h-5 w-5 mr-2 fill-current" /> Play Game
                  </Button>
                </div>
              </div>
            ) : isLoading ? (
              showAd ? (
                <div className="relative w-full h-full">
                  <GameAd onComplete={handleAdComplete} />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card">
                  <div className="text-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Loading Game</h3>
                    <p className="text-muted-foreground">Please wait while the game loads...</p>
                  </div>
                </div>
              )
            ) : game.isWorking ? (
              <iframe src={game.playUrl} className="w-full h-full border-0" allowFullScreen title={game.title}></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-card">
                <div className="text-center p-6">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-foreground">Game Unavailable</h3>
                  <p className="text-muted-foreground max-w-md">
                    This game is currently not working. Our team is working to fix it.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Game controls - only show when game is loaded */}
          {gameStarted && !isLoading && game.isWorking && (
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2 text-white text-sm">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(viewCount)} views</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={toggleFullscreen} 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 rounded-full font-medium"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="h-4 w-4 mr-1" /> Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <Maximize className="h-4 w-4 mr-1" /> Fullscreen
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowComplaint(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" /> Report
                </Button>
              </div>
            </div>
          )}
        </div>

        {showComplaint && (
          <GameComplaintForm gameId={game.id} gameTitle={game.title} onClose={() => setShowComplaint(false)} />
        )}

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">How to Play</h2>
          <p className="text-muted-foreground">{game.controls}</p>
        </div>
      </div>
    </div>
  )
}
