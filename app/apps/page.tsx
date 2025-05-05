import Link from "next/link"
import { ArrowLeft, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppsPage() {
  const apps = [
    {
      id: 1,
      title: "Rogo Games Mobile",
      description: "Play your favorite games on the go with our mobile app.",
      icon: "📱",
      status: "Coming Soon",
    },
    {
      id: 2,
      title: "Game Creator",
      description: "Create and share your own games with our easy-to-use game creator.",
      icon: "🎮",
      status: "Coming Soon",
    },
    {
      id: 3,
      title: "Rogo Chat",
      description: "Chat with other gamers and make new friends.",
      icon: "💬",
      status: "Coming Soon",
    },
  ]

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
          <p className="mt-2 text-gray-400">Discover our mobile apps and tools</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-lg transition-all hover:shadow-purple-500/10"
            >
              <div className="mb-4 text-4xl">{app.icon}</div>
              <h2 className="mb-2 text-xl font-bold">{app.title}</h2>
              <p className="mb-4 text-gray-400">{app.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-500">{app.status}</span>
                <Button variant="outline" size="sm" disabled>
                  Get App
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
