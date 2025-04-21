import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { redirect } from "next/navigation"
import { getAllPolls, getNextPollChangeTime } from "@/actions/poll-actions"
import { isAdmin } from "@/utils/admin-utils"

async function PollResultsContent() {
  // Redirect if not admin
  if (!isAdmin()) {
    redirect("/")
  }

  const polls = await getAllPolls()
  const pollSchedule = await getNextPollChangeTime()

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No polls have been created yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Poll Schedule</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-purple-400" /> Current Poll Ends
            </span>
            <span className="font-bold">{formatDate(pollSchedule.currentPollEnds)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-green-400" /> Next Poll Starts
            </span>
            <span className="font-bold">{formatDate(pollSchedule.nextPollStarts)}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Polls automatically change every Monday. The current poll ends at 6:30 AM and a new poll starts at 7:00 AM.
        </p>
      </div>

      {polls.map((poll) => {
        const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
        const createdDate = new Date(poll.createdAt).toLocaleDateString()
        const expiresDate = new Date(poll.expiresAt).toLocaleDateString()

        return (
          <div key={poll.id} className="rounded-lg bg-gray-800 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold">{poll.question}</h3>
              <p className="text-sm text-gray-400">
                Created: {createdDate} | Expires: {expiresDate}
              </p>
            </div>

            <div className="space-y-4">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0

                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option.text}</span>
                      <span>
                        {option.votes} vote{option.votes !== 1 ? "s" : ""} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-right text-sm text-gray-400 mt-4">Total votes: {totalVotes}</p>
          </div>
        )
      })}
    </div>
  )
}

export default function AdminPollsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Poll Results</h1>
          <p className="mt-2 text-gray-400">View all poll results and statistics</p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            </div>
          }
        >
          <PollResultsContent />
        </Suspense>
      </div>
    </div>
  )
}
