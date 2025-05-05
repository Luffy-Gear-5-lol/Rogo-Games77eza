import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FlameIcon as Fire, BarChart2, Clock, BookOpen, Smartphone, Mail } from "lucide-react"

export default function SiteHeader() {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold text-white">Rogo Games</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/popular" className="text-white hover:text-purple-400 transition-colors">
              <span className="flex items-center">
                <Fire className="mr-1 h-4 w-4 text-orange-500" /> Popular Games
              </span>
            </Link>
            <Link href="/manga" className="text-white hover:text-purple-400 transition-colors">
              <span className="flex items-center">
                <BookOpen className="mr-1 h-4 w-4 text-pink-500" /> Manga
              </span>
            </Link>
            <Link href="/apps" className="text-white hover:text-purple-400 transition-colors">
              <span className="flex items-center">
                <Smartphone className="mr-1 h-4 w-4 text-green-500" /> Apps
              </span>
            </Link>
            <Link href="/poll" className="text-white hover:text-purple-400 transition-colors">
              <span className="flex items-center">
                <BarChart2 className="mr-1 h-4 w-4 text-blue-500" /> Weekly Poll
              </span>
            </Link>
            <Link href="/coming-soon" className="text-white hover:text-purple-400 transition-colors">
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-purple-500" /> Coming Soon
              </span>
            </Link>
            <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
              <span className="flex items-center">
                <Mail className="mr-1 h-4 w-4 text-yellow-500" /> Contact
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                Search
              </Button>
            </Link>
            <Link href="/whats-new">
              <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600/20">
                What's New
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
