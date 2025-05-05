import Link from "next/link"
import { ArrowLeft, Clock, Star, MessageSquare, Trophy, Users, Gamepad2 } from "lucide-react"

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Coming Soon</h1>
          <p className="mt-2 text-gray-400">Exciting new features we're working on for Rogo Games</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-900">
              <Star className="h-6 w-6 text-purple-300" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Game Ratings</h2>
            <p className="text-gray-300">
              Rate your favorite games and see what other players think. Our rating system will help you discover the
              best games on the site.
            </p>
            <div className="mt-4 text-sm text-purple-400">Coming in Summer 2023</div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900">
              <MessageSquare className="h-6 w-6 text-indigo-300" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Comments & Reviews</h2>
            <p className="text-gray-300">
              Share your thoughts about games and read what others have to say. Leave tips, strategies, and feedback for
              the community.
            </p>
            <div className="mt-4 text-sm text-purple-400">Coming in Fall 2023</div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-900">
              <Trophy className="h-6 w-6 text-pink-300" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Achievements</h2>
            <p className="text-gray-300">
              Earn badges and trophies for playing games and completing challenges. Show off your gaming skills with a
              personalized achievement showcase.
            </p>
            <div className="mt-4 text-sm text-purple-400">Coming in Winter 2023</div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-900">
              <Users className="h-6 w-6 text-green-300" />
            </div>
            <h2 className="mb-2 text-xl font-bold">User Profiles</h2>
            <p className="text-gray-300">
              Create your own gaming profile to track your favorite games, achievements, and stats. Connect with friends
              and share your gaming activity.
            </p>
            <div className="mt-4 text-sm text-purple-400">Coming in Spring 2024</div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-900">
              <Gamepad2 className="h-6 w-6 text-orange-300" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Game Tournaments</h2>
            <p className="text-gray-300">
              Compete against other players in organized tournaments for various games. Win prizes and earn recognition
              as a top player.
            </p>
            <div className="mt-4 text-sm text-purple-400">Coming in Summer 2024</div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900">
              <Clock className="h-6 w-6 text-blue-300" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Game History</h2>
            <p className="text-gray-300">
              Track your gaming sessions and see statistics about your playtime, favorite games, and progress over time.
            </p>
            <div className="mt-4 text-sm text-purple-400">Coming in Fall 2024</div>
          </div>
        </div>

        <div className="mt-12 rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-bold">Have a Feature Request?</h2>
          <p className="text-gray-300">
            We're always looking for ways to improve Rogo Games. If you have an idea for a new feature or improvement,
            let us know through our weekly polls or contact page!
          </p>
          <div className="mt-6 flex gap-4">
            <Link href="/poll">
              <button className="rounded-md bg-purple-600 px-4 py-2 font-medium hover:bg-purple-700">
                Weekly Poll
              </button>
            </Link>
            <Link href="/contact">
              <button className="rounded-md bg-gray-700 px-4 py-2 font-medium hover:bg-gray-600">Contact Us</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
