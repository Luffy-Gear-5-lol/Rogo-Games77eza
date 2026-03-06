import Link from "next/link"
import { ArrowLeft, Smartphone, Music, Play, MessageCircle, Video, Radio, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AppsPage() {
  const apps = [
    {
      id: 1,
      title: "Rogo Games Mobile",
      description: "Play your favorite games on the go with our mobile app.",
      icon: Smartphone,
      status: "Coming Soon",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "YouTube",
      description: "Watch videos, music, and more from YouTube.",
      icon: Play,
      status: "Coming Soon",
      color: "from-red-500 to-red-600",
    },
    {
      id: 3,
      title: "X (Twitter)",
      description: "Stay connected with the latest posts and trends.",
      icon: MessageCircle,
      status: "Coming Soon",
      color: "from-gray-700 to-gray-900",
    },
    {
      id: 4,
      title: "SoundCloud",
      description: "Discover and stream music from independent artists.",
      icon: Radio,
      status: "Coming Soon",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 5,
      title: "Music Player",
      description: "Listen to your favorite artists including Juice WRLD, NBA YoungBoy, Tyler the Creator.",
      icon: Headphones,
      status: "Coming Soon",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 6,
      title: "Video Player",
      description: "Watch videos without restrictions.",
      icon: Video,
      status: "Coming Soon",
      color: "from-blue-500 to-indigo-600",
    },
  ]

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
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Apps</h1>
          </div>
          <p className="text-muted-foreground">Discover apps and tools - more coming in future updates!</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => {
            const Icon = app.icon
            return (
              <div
                key={app.id}
                className="game-card rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-foreground">{app.title}</h2>
                <p className="mb-4 text-muted-foreground text-sm">{app.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-0">
                    {app.status}
                  </Badge>
                  <Button variant="outline" size="sm" disabled className="opacity-50">
                    Coming Soon
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Future updates section */}
        <div className="mt-12 p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Music className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Coming Soon: Music Section</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            We're working on a music section featuring artists like Juice WRLD, NBA YoungBoy, Tyler the Creator, and more. 
            This will help bypass school network restrictions so you can listen to your favorite music anywhere.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/20 text-primary border-0">Juice WRLD</Badge>
            <Badge className="bg-primary/20 text-primary border-0">NBA YoungBoy</Badge>
            <Badge className="bg-primary/20 text-primary border-0">Tyler the Creator</Badge>
            <Badge className="bg-primary/20 text-primary border-0">More Artists Coming</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
