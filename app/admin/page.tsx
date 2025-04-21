import Link from "next/link"
import { ArrowLeft, BarChart2, Eye, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageGuide from "@/components/image-guide"
import { redirect } from "next/navigation"
import { isAdmin } from "@/utils/admin-utils"
import { getNextPopularReset } from "@/actions/game-actions"
import { getAllGames } from "@/actions/game-actions"
import { getNextPollChangeTime } from "@/actions/poll-actions"

export default async function AdminPage() {
  // Redirect if not admin
  if (!isAdmin()) {
    redirect("/")
  }

  const nextResetDate = await getNextPopularReset()
  const games = await getAllGames()
  const pollSchedule = await getNextPollChangeTime()

  // Format the next reset date
  const nextReset = new Date(nextResetDate)
  const formattedNextReset = nextReset.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Format poll dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-gray-400">Manage your game site content and settings</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4">Game Management</h2>
            <p className="mb-6 text-gray-300">
              Your site currently has {games.length} games. Here's how to manage them:
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span>Total Games</span>
                <span className="font-bold">{games.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span>Popular Games</span>
                <span className="font-bold">
                  <Eye className="inline h-4 w-4 mr-1" />
                  100+ views in 2 weeks
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span>Next Popular Reset</span>
                <span className="font-bold">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {formattedNextReset}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Manage Games</Button>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4">Poll Management</h2>
            <p className="mb-6 text-gray-300">View and manage weekly polls and user responses:</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span>Current Poll</span>
                <Link href="/poll">
                  <span className="font-bold text-purple-400 hover:underline">View</span>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span>Poll Results</span>
                <Link href="/admin/polls">
                  <span className="font-bold text-purple-400 hover:underline">
                    <BarChart2 className="inline h-4 w-4 mr-1" />
                    View Results
                  </span>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span>Current Poll Ends</span>
                <span className="font-bold">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {formatDate(pollSchedule.currentPollEnds)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span>Next Poll Starts</span>
                <span className="font-bold">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {formatDate(pollSchedule.nextPollStarts)}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/admin/polls">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">View Poll Results</Button>
              </Link>
            </div>
          </div>
        </div>

        <ImageGuide />

        <div className="rounded-lg bg-gray-800 p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Game Image Examples</h2>
          <p className="mb-6 text-gray-300">Here are examples of high-quality images for popular games:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="aspect-square bg-gray-700 rounded-lg mb-2 overflow-hidden">
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tetris_logo.svg/1200px-Tetris_logo.svg.png')] bg-contain bg-center bg-no-repeat"></div>
              </div>
              <span className="text-sm">Tetris</span>
            </div>
            <div className="text-center">
              <div className="aspect-square bg-gray-700 rounded-lg mb-2 overflow-hidden">
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/1200px-Pacman.svg.png')] bg-contain bg-center bg-no-repeat"></div>
              </div>
              <span className="text-sm">Pacman</span>
            </div>
            <div className="text-center">
              <div className="aspect-square bg-gray-700 rounded-lg mb-2 overflow-hidden">
                <div className="w-full h-full bg-[url('https://play-lh.googleusercontent.com/QJ-bZrYu9hzUiU4S0V4HXCm0YQh-Z0u8xt_VQKlkh-LGeCEYZqXQcwqQK-Hf_tEUPf0')] bg-contain bg-center bg-no-repeat"></div>
              </div>
              <span className="text-sm">Minecraft</span>
            </div>
            <div className="text-center">
              <div className="aspect-square bg-gray-700 rounded-lg mb-2 overflow-hidden">
                <div className="w-full h-full bg-[url('https://play-lh.googleusercontent.com/VHB9bVB8cTcnqwnu0nJqKYbiutRclnbGxTpwnayKB4vMxZj8pk1220Rg-6oQ68DwAkqO')] bg-contain bg-center bg-no-repeat"></div>
              </div>
              <span className="text-sm">Among Us</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
