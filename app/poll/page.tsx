import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react"
import { getCurrentPoll, voteOnPoll } from "@/actions/poll-actions"
import PollComponent from "@/components/poll-component"

async function PollContent() {
  const currentPoll = await getCurrentPoll()

  if (!currentPoll) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground font-medium">No active polls at the moment</p>
        <p className="text-muted-foreground text-sm mt-2">Check back soon for a new daily poll!</p>
      </div>
    )
  }

  return <PollComponent poll={currentPoll} voteAction={voteOnPoll} />
}

export default function PollPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-pink-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Daily Poll</h1>
          </div>
          <p className="text-muted-foreground">Share your opinion and see what other players think</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            }
          >
            <PollContent />
          </Suspense>
        </div>

        <div className="mt-12 max-w-2xl mx-auto rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">About Daily Polls</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Every day, we post a new poll to gather feedback from our gaming community. Your responses help us improve
            the site and understand what our players enjoy most.
          </p>
          <p className="text-muted-foreground">
            Polls are completely anonymous and refresh daily at midnight. Vote now to see what everyone else thinks!
          </p>
        </div>
      </div>
    </div>
  )
}
