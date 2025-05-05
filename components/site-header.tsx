"use client"

import Link from "next/link"
import { Gamepad2, Menu, X, Grid, Flame, Smartphone, BookOpen, BarChart3, Bell } from "lucide-react"
import { useState } from "react"
import SearchBar from "./search-bar"

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold">Rogo Games</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/categories" className="flex items-center gap-1 transition-colors hover:text-purple-400">
              <Grid className="h-4 w-4" />
              <span>Categories</span>
            </Link>
            <Link href="/popular" className="flex items-center gap-1 transition-colors hover:text-purple-400">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Popular</span>
            </Link>
            <Link href="/categories/fnf" className="flex items-center gap-1 transition-colors hover:text-purple-400">
              <Gamepad2 className="h-4 w-4" />
              <span>FNF Games</span>
            </Link>
            <Link href="/apps" className="flex items-center gap-1 transition-colors hover:text-purple-400">
              <Smartphone className="h-4 w-4" />
              <span>Apps</span>
            </Link>
            <Link href="/manga" className="flex items-center gap-1 transition-colors hover:text-purple-400">
              <BookOpen className="h-4 w-4" />
              <span>Manga</span>
            </Link>
            <Link href="/poll" className="flex items-center gap-1 transition-colors hover:text-purple-400">
              <BarChart3 className="h-4 w-4" />
              <span>Poll</span>
            </Link>
            <Link href="/whats-new" className="flex items-center gap-1 transition-colors hover:text-purple-400">
              <Bell className="h-4 w-4" />
              <span>What's New</span>
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex relative">
          <SearchBar />
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="p-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/categories"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Grid className="h-4 w-4" />
              Categories
            </Link>
            <Link
              href="/popular"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Flame className="h-4 w-4 text-orange-500" />
              Popular
            </Link>
            <Link
              href="/categories/fnf"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Gamepad2 className="h-4 w-4" />
              FNF Games
            </Link>
            <Link
              href="/apps"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Smartphone className="h-4 w-4" />
              Apps
            </Link>
            <Link
              href="/manga"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Manga
            </Link>
            <Link
              href="/poll"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              Poll
            </Link>
            <Link
              href="/whats-new"
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4" />
              What's New
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
