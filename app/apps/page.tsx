import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample apps data
const appsList = [
  {
    id: 1,
    title: "Photo Editor Pro",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Creative Apps Inc.",
    category: "Photography",
    rating: 4.7,
    downloads: "10M+",
    price: "Free",
    description:
      "A powerful photo editor with advanced tools for adjusting, filtering, and enhancing your photos. Includes hundreds of filters, stickers, and effects.",
  },
  {
    id: 2,
    title: "Fitness Tracker",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "HealthTech Solutions",
    category: "Health & Fitness",
    rating: 4.8,
    downloads: "5M+",
    price: "Free",
    description:
      "Track your workouts, monitor your progress, and achieve your fitness goals. Features include workout plans, calorie counter, and activity tracking.",
  },
  {
    id: 3,
    title: "Weather Forecast",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Weather Apps Co.",
    category: "Weather",
    rating: 4.6,
    downloads: "50M+",
    price: "Free",
    description:
      "Get accurate weather forecasts with hourly updates, radar maps, and severe weather alerts. Plan your day with confidence.",
  },
  {
    id: 4,
    title: "Meditation & Sleep",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Mindfulness Studio",
    category: "Health & Fitness",
    rating: 4.9,
    downloads: "20M+",
    price: "Free",
    description:
      "Improve your sleep and reduce stress with guided meditations, sleep stories, and calming sounds. Perfect for relaxation and mindfulness.",
  },
  {
    id: 5,
    title: "Language Learning",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Education Apps Ltd.",
    category: "Education",
    rating: 4.8,
    downloads: "100M+",
    price: "Free",
    description:
      "Learn new languages through interactive lessons, games, and speech recognition. Supports over 30 languages with personalized learning paths.",
  },
  {
    id: 6,
    title: "Budget Planner",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Financial Tools Inc.",
    category: "Finance",
    rating: 4.7,
    downloads: "15M+",
    price: "Free",
    description:
      "Take control of your finances with this easy-to-use budget planner. Track expenses, set savings goals, and get insights into your spending habits.",
  },
  {
    id: 7,
    title: "Recipe Book",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Cooking Apps",
    category: "Food & Drink",
    rating: 4.6,
    downloads: "25M+",
    price: "Free",
    description:
      "Discover thousands of recipes from around the world. Create shopping lists, plan meals, and follow step-by-step cooking instructions.",
  },
  {
    id: 8,
    title: "Music Player",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Audio Apps",
    category: "Music",
    rating: 4.8,
    downloads: "500M+",
    price: "Free",
    description:
      "A feature-rich music player with equalizer, playlists, and lyrics support. Enjoy your music with high-quality audio and customizable themes.",
  },
  {
    id: 9,
    title: "Puzzle Games",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Brain Games Studio",
    category: "Games",
    rating: 4.7,
    downloads: "30M+",
    price: "Free",
    description:
      "Challenge your brain with hundreds of puzzles, from easy to expert level. Includes sudoku, crosswords, word search, and logic puzzles.",
  },
  {
    id: 10,
    title: "Navigation & Maps",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Travel Tech",
    category: "Travel",
    rating: 4.9,
    downloads: "1B+",
    price: "Free",
    description:
      "Navigate with confidence using real-time traffic updates, offline maps, and voice-guided directions. Find the fastest routes to your destination.",
  },
  {
    id: 11,
    title: "Video Editor",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Creative Studio Apps",
    category: "Video & Photo",
    rating: 4.6,
    downloads: "50M+",
    price: "Free",
    description:
      "Create professional-looking videos with this easy-to-use editor. Add effects, transitions, music, and text to your videos with just a few taps.",
  },
  {
    id: 12,
    title: "Messaging App",
    icon: "/placeholder.svg?height=100&width=100",
    developer: "Communication Tools",
    category: "Communication",
    rating: 4.8,
    downloads: "2B+",
    price: "Free",
    description:
      "Stay connected with friends and family through text messages, voice calls, and video chats. Features include group conversations and file sharing.",
  },
]

// Featured apps
const featuredApps = appsList.slice(0, 3)

// Top apps
const topApps = [appsList[3], appsList[4], appsList[5], appsList[6]]

// New releases
const newReleases = [appsList[7], appsList[8], appsList[9], appsList[10]]

function AppCard({ app }: { app: (typeof appsList)[0] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-gray-800 border border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-500/20">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
            <Image src={app.icon || "/placeholder.svg"} alt={app.title} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold hover:text-purple-400">{app.title}</h3>
            <p className="text-xs text-gray-400">{app.developer}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="bg-gray-700 text-xs">
                {app.category}
              </Badge>
              <div className="flex items-center text-xs">
                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                {app.rating}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-300 line-clamp-2">{app.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">{app.downloads} downloads</span>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Download className="mr-1 h-3 w-3" /> {app.price}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeaturedApp({ app }: { app: (typeof appsList)[0] }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
      <div className="relative aspect-[21/9] w-full bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32">
          <Image src={app.icon || "/placeholder.svg"} alt={app.title} fill className="object-contain" />
        </div>
      </div>
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="px-6 py-4 sm:px-10 sm:py-6 md:max-w-2xl">
          <Badge className="mb-2 bg-purple-600 hover:bg-purple-700">{app.category}</Badge>
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl">{app.title}</h2>
          <div className="mb-4 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(app.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-300">{app.rating.toFixed(1)}</span>
            <span className="ml-4 text-sm text-gray-300">{app.downloads} downloads</span>
          </div>
          <p className="mb-6 text-gray-300 line-clamp-3">{app.description}</p>
          <div className="flex gap-4">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Download className="mr-2 h-4 w-4" /> Download Now
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mobile Apps</h1>
          <p className="mt-2 text-gray-400">Discover and download the best mobile applications</p>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Featured Apps</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredApps.map((app) => (
              <FeaturedApp key={app.id} app={app} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Top Apps</h2>
            <Button variant="link" className="text-purple-400 hover:text-purple-300">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {topApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">New Releases</h2>
            <Button variant="link" className="text-purple-400 hover:text-purple-300">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {newReleases.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {[
              "Games",
              "Education",
              "Productivity",
              "Entertainment",
              "Social",
              "Health & Fitness",
              "Photography",
              "Music",
              "Finance",
              "Travel",
              "Food & Drink",
              "Shopping",
            ].map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900 p-4 text-center font-medium transition-transform hover:scale-105"
              >
                {category}
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Apps</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select className="rounded-md bg-gray-800 border-gray-700 text-white text-sm">
                <option>Popularity</option>
                <option>Newest</option>
                <option>Rating</option>
                <option>Alphabetical</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {appsList.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
