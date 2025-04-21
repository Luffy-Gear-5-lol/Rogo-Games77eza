"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ThumbsUp,
  Share2,
  Maximize,
  AlertTriangle,
  X,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { games } from "@/data/games"
import { incrementGameView } from "@/actions/game-actions"
import { isAdmin } from "@/utils/admin-utils"
import GameComplaintForm from "@/components/game-complaint-form"
import { GameLoading } from "@/components/game-loading"

interface GamePlayProps {
  params: {
    id: string
  }
}

export default function GamePlay({ params }: GamePlayProps) {
  const gameId = Number.parseInt(params.id)
  const game = games.find((g) => g.id === gameId)
  const gameFrameRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 1000))
  const [viewCount, setViewCount] = useState(0)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const showViewCount = isAdmin()

  useEffect(() => {
    // Only show loading state after the play button is clicked
    if (gameStarted) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [gameStarted])

  useEffect(() => {
    // Increment view count when the page loads
    if (gameId) {
      incrementGameView(gameId).then((views) => {
        setViewCount(views)
      })
    }
  }, [gameId])

  const handleFullscreen = () => {
    if (gameFrameRef.current) {
      if (!isFullscreen) {
        if (gameFrameRef.current.requestFullscreen) {
          gameFrameRef.current.requestFullscreen()
          setIsFullscreen(true)
        }
      }
    }
  }

  useEffect(() => {
    const exitFullscreen = () => {
      if (document.fullscreenElement === null) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("fullscreenchange", exitFullscreen)
    return () => document.removeEventListener("fullscreenchange", exitFullscreen)
  }, [])

  // Fallback to placeholder if the game doesn't exist or doesn't have a playUrl
  const getGameUrl = () => {
    if (!game) return "/games/placeholder-game.html"

    // Check if the game has a valid playUrl, otherwise use the placeholder with game info
    if (game.playUrl) {
      return game.playUrl
    } else {
      return `/games/placeholder-game.html?title=${encodeURIComponent(game.title)}&description=${encodeURIComponent(
        game.description,
      )}&controls=${encodeURIComponent(game.controls)}`
    }
  }

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Game Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isGameWorking = game.isWorking !== false

  const handleStartGame = () => {
    setGameStarted(true)
  }

  // Get status indicator
  const getStatusIndicator = () => {
    if (game.isWorking === undefined) {
      return { color: "text-white", icon: <AlertCircle className="h-5 w-5 mr-2" />, text: "Status Unknown" }
    } else if (game.isWorking) {
      return { color: "text-green-400", icon: <CheckCircle className="h-5 w-5 mr-2" />, text: "Working" }
    } else {
      return { color: "text-red-400", icon: <XCircle className="h-5 w-5 mr-2" />, text: "Not Working" }
    }
  }

  const statusIndicator = getStatusIndicator()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
          <h1 className="text-xl font-bold">{game.title}</h1>
          <div className="flex items-center gap-2">
            {showViewCount && (
              <div className="flex items-center text-gray-400">
                <span>{viewCount.toLocaleString()}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => setLikes(likes + 1)}
            >
              <ThumbsUp className="mr-1 h-4 w-4" /> {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Share2 className="mr-1 h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <span className={`flex items-center ${statusIndicator.color}`}>
            {statusIndicator.icon}
            {statusIndicator.text}
          </span>
        </div>

        {!isGameWorking && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-300 flex-grow">
              This game is currently not working. We are fixing it right now. Please be patient.
            </p>
          </div>
        )}

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black">
          {isLoading && <GameLoading />}

          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{game.title}</h2>
                <p className="text-gray-400 max-w-md mb-8 px-4">{game.description}</p>
                {isGameWorking ? (
                  <Button size="lg" onClick={handleStartGame} className="bg-purple-600 hover:bg-purple-700">
                    <Play className="mr-2 h-5 w-5 fill-current" /> Play Game
                  </Button>
                ) : (
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Game Unavailable</h3>
                    <p className="text-gray-400 text-center max-w-md mb-6">
                      This game is currently not working. Our team is working on fixing it as soon as possible.
                    </p>
                    <Button onClick={() => setShowComplaintForm(true)} className="bg-red-600 hover:bg-red-700">
                      Report an Issue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {!isLoading && (
                <>
                  {isGameWorking ? (
                    <iframe ref={gameFrameRef} src={getGameUrl()} className="h-full w-full" allowFullScreen></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                      <h2 className="text-xl font-bold mb-2">Game Unavailable</h2>
                      <p className="text-gray-400 text-center max-w-md mb-6">
                        This game is currently not working. Our team is working on fixing it as soon as possible.
                      </p>
                      <Button onClick={() => setShowComplaintForm(true)} className="bg-red-600 hover:bg-red-700">
                        Report an Issue
                      </Button>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {isGameWorking && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleFullscreen}>
                        <Maximize className="mr-2 h-4 w-4" /> Fullscreen
                      </Button>
                    )}
                    {isGameWorking && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                        onClick={() => setShowComplaintForm(true)}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue
                      </Button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {showComplaintForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-md w-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-gray-400 hover:text-white z-10"
                onClick={() => setShowComplaintForm(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <GameComplaintForm gameId={game.id} gameTitle={game.title} onClose={() => setShowComplaintForm(false)} />
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">About {game.title}</h2>

            <p className="text-gray-300">{game.description}</p>

            {game.categories && game.categories.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-lg font-bold">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {game.categories.map((category) => (
                    <Link href={`/categories/${encodeURIComponent(category.toLowerCase())}`} key={category}>
                      <Badge className="bg-purple-600 hover:bg-purple-700">{category}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="mb-4 text-xl font-bold">How to Play</h3>
              <div className="rounded-lg bg-gray-800 p-4">
                <p className="text-gray-300">{game.controls}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Similar Games</h3>
            <div className="space-y-4">
              {games
                .filter((g) => {
                  // Find games with at least one matching category
                  if (!game.categories || !g.categories) return false
                  return (
                    g.id !== game.id &&
                    g.isWorking !== false &&
                    g.categories.some((cat) => game.categories.includes(cat))
                  )
                })
                .slice(0, 5)
                .map((similarGame) => {
                  const statusIndicator = similarGame.isWorking
                    ? { color: "text-green-400", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
                    : { color: "text-red-400", icon: <XCircle className="h-3 w-3 mr-1" /> }

                  return (
                    <Link key={similarGame.id} href={`/game/${similarGame.id}`} className="group flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center">
                        <span className="text-xs font-bold">{similarGame.title.substring(0, 2)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-purple-400">{similarGame.title}</h4>
                        <div className="flex items-center">
                          <span className={`flex items-center text-xs ${statusIndicator.color}`}>
                            {statusIndicator.icon}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            {similarGame.categories && similarGame.categories.length > 0
                              ? similarGame.categories[0]
                              : ""}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
