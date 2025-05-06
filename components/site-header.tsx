"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, Grid, Gamepad2, Book, BarChart2, Bell, Smartphone, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Rogo Games</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600",
                pathname === "/" ? "text-purple-600" : "text-gray-400",
              )}
            >
              Home
            </Link>
            <Link
              href="/popular"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/popular" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Flame className="mr-1 h-4 w-4" />
              Popular
            </Link>
            <Link
              href="/categories"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/categories" || pathname.startsWith("/categories/") ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Grid className="mr-1 h-4 w-4" />
              Categories
            </Link>
            <Link
              href="/categories/fnf"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/categories/fnf" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Gamepad2 className="mr-1 h-4 w-4" />
              FNF Games
            </Link>
            <Link
              href="/manga"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/manga" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Book className="mr-1 h-4 w-4" />
              Manga
            </Link>
            <Link
              href="/poll"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/poll" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <BarChart2 className="mr-1 h-4 w-4" />
              Poll
            </Link>
            <Link
              href="/whats-new"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/whats-new" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Bell className="mr-1 h-4 w-4" />
              What's New
            </Link>
            <Link
              href="/apps"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/apps" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Smartphone className="mr-1 h-4 w-4" />
              Apps
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm items-center">
            <Input
              type="search"
              placeholder="Search games..."
              className="bg-gray-900 border-gray-700 focus-visible:ring-purple-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          <ThemeToggle />

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen)
              setIsMenuOpen(false)
            }}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen)
              setIsSearchOpen(false)
            }}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      {isSearchOpen && (
        <div className="container py-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search games..."
              className="bg-gray-900 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="container py-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600",
                pathname === "/" ? "text-purple-600" : "text-gray-400",
              )}
            >
              Home
            </Link>
            <Link
              href="/popular"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/popular" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Flame className="mr-2 h-4 w-4" />
              Popular
            </Link>
            <Link
              href="/categories"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/categories" || pathname.startsWith("/categories/") ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Grid className="mr-2 h-4 w-4" />
              Categories
            </Link>
            <Link
              href="/categories/fnf"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/categories/fnf" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Gamepad2 className="mr-2 h-4 w-4" />
              FNF Games
            </Link>
            <Link
              href="/manga"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/manga" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Book className="mr-2 h-4 w-4" />
              Manga
            </Link>
            <Link
              href="/poll"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/poll" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Poll
            </Link>
            <Link
              href="/whats-new"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/whats-new" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Bell className="mr-2 h-4 w-4" />
              What's New
            </Link>
            <Link
              href="/apps"
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-600 flex items-center",
                pathname === "/apps" ? "text-purple-600" : "text-gray-400",
              )}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Apps
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
