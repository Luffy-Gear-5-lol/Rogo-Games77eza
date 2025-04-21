import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          404
        </h1>
        <h2 className="mb-6 text-3xl font-bold">Page Not Found</h2>
        <p className="mb-8 text-gray-400">Oops! The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
