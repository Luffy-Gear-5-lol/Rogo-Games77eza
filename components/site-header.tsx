import Link from "next/link"
import { Gamepad2, Search, FlameIcon as Fire, AppWindowIcon as Apps, Code } from "lucide-react"
import { Input } from "@/components/ui/input"
import ThemeToggle from "@/components/theme-toggle"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-6 w-6 text-purple-500" />
            <span className="hidden font-bold sm:inline-block">Rogo Games</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/popular"
              className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <Fire className="mr-1 h-4 w-4 text-orange-500" />
              Fire Popular
            </Link>
            <Link
              href="/categories"
              className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Categories
            </Link>
            <Link
              href="/categories/fnf"
              className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              FNF Games
            </Link>
            <Link
              href="/languages"
              className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <Code className="mr-1 h-4 w-4 text-blue-500" />
              Languages
            </Link>
            <Link
              href="/apps"
              className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <Apps className="mr-1 h-4 w-4" />
              Apps
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search games..."
                className="w-64 rounded-lg bg-gray-800 pl-8 text-sm text-white placeholder:text-gray-400 focus:ring-purple-500"
              />
            </div>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
