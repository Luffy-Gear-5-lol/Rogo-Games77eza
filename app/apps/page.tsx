import Link from "next/link"
import { ArrowLeft, Smartphone } from "lucide-react"

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Smartphone className="mr-2 h-6 w-6" />
            Apps
          </h1>
          <p className="mt-2 text-gray-400">Useful applications and tools</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <div className="p-4">
              <h3 className="mb-2 font-bold">Coming Soon</h3>
              <p className="text-sm text-gray-400">We're working on adding useful applications. Check back later!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
