import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">About Rogo Games</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">Your ultimate destination for free online games</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-12 rounded-xl bg-gray-800 p-8">
            <h2 className="mb-4 text-2xl font-bold">Our Story</h2>
            <p className="mb-4 text-gray-300">
              Rogo Games was created with a simple mission: to provide high-quality, fun, and free games that anyone can
              enjoy. What started as a small project has grown into a platform with a wide variety of games across
              multiple categories.
            </p>
            <p className="text-gray-300">
              We believe that gaming should be accessible to everyone, which is why all our games are free to play and
              optimized to run on various devices. Our team is constantly working to add new games and improve existing
              ones based on player feedback.
            </p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-gray-800 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Fun First</h3>
              <p className="text-gray-300">
                We prioritize creating games that are enjoyable and engaging for players of all ages.
              </p>
            </div>

            <div className="rounded-xl bg-gray-800 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-600">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Free to Play</h3>
              <p className="text-gray-300">
                All our games are completely free with no hidden costs or pay-to-win mechanics.
              </p>
            </div>

            <div className="rounded-xl bg-gray-800 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Variety</h3>
              <p className="text-gray-300">
                We offer a diverse collection of games across multiple genres to suit different preferences.
              </p>
            </div>
          </div>

          <div className="mb-12 rounded-xl bg-gray-800 p-8">
            <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
            <p className="mb-6 text-gray-300">
              Have questions, suggestions, or feedback? We'd love to hear from you! Reach out to us using the contact
              information below.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-700 p-4">
                <h3 className="mb-2 font-bold">Email</h3>
                <p className="text-purple-400">contact@rogogames.com</p>
              </div>
              <div className="rounded-lg bg-gray-700 p-4">
                <h3 className="mb-2 font-bold">Social Media</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Discord
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
