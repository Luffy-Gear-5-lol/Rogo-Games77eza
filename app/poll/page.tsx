import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCurrentPoll, voteOnPoll } from "@/actions/poll-actions"
import PollComponent from "@/components/poll-component"

async function PollContent() {
  const currentPoll = await getCurrentPoll()

  if (!currentPoll) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No active polls at the moment. Check back soon!</p>
      </div>
    )
  }

  return <PollComponent poll={currentPoll} voteAction={voteOnPoll} />
}

export default function PollPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Weekly Poll</h1>
          <p className="mt-2 text-gray-400">Share your opinion and see what other players think</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              </div>
            }
          >
            <PollContent />
          </Suspense>
        </div>

        <div className="mt-12 max-w-2xl mx-auto rounded-lg bg-gray-800 p-6">
          <h2 className="text-xl font-bold mb-4">About Our Weekly Polls</h2>
          <p className="text-gray-300 mb-4">
            Every week, we post a new poll to gather feedback from our gaming community. Your responses help us improve
            the site and understand what our players enjoy most.
          </p>
          <p className="text-gray-300">
            Polls are completely anonymous and the results are used to guide our decisions about new features, game
            selections, and site improvements. Check back each week for a new question!
          </p>
        </div>
      </div>
    </div>
  )
}
