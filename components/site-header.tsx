"use client"

import Link from "next/link"
import { Gamepad2, Menu, X } from "lucide-react"
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
            <Link href="/categories" className="transition-colors hover:text-purple-400">
              Categories
            </Link>
            <Link href="/popular" className="transition-colors hover:text-purple-400">
              Popular
            </Link>
            <Link href="/categories/fnf" className="transition-colors hover:text-purple-400">
              FNF Games
            </Link>
            <Link href="/apps" className="transition-colors hover:text-purple-400">
              Apps
            </Link>
            <Link href="/manga" className="transition-colors hover:text-purple-400">
              Manga
            </Link>
            <Link href="/poll" className="transition-colors hover:text-purple-400">
              Poll
            </Link>
            <Link href="/whats-new" className="transition-colors hover:text-purple-400">
              What's New
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
              className="p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link href="/popular" className="p-2 hover:bg-gray-800 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Popular
            </Link>
            <Link
              href="/categories/fnf"
              className="p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              FNF Games
            </Link>
            <Link href="/apps" className="p-2 hover:bg-gray-800 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Apps
            </Link>
            <Link href="/manga" className="p-2 hover:bg-gray-800 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Manga
            </Link>
            <Link href="/poll" className="p-2 hover:bg-gray-800 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Poll
            </Link>
            <Link
              href="/whats-new"
              className="p-2 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              What's New
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
