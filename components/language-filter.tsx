"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import LanguageBadge from "./language-badge"

interface LanguageFilterProps {
  onFilterChange: (languages: string[]) => void
}

export default function LanguageFilter({ onFilterChange }: LanguageFilterProps) {
  const languages = [
    "JavaScript",
    "HTML",
    "Java",
    "Python",
    "C++",
    "C#",
    "TypeScript",
    "Rust",
    "Ruby",
    "Lua",
    "Haxe",
    "C",
    "CSS",
    "PHP",
    "Go",
    "Swift",
    "ActionScript",
    "Shell",
  ]

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const toggleLanguage = (language: string) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language]

    setSelectedLanguages(newSelection)
    onFilterChange(newSelection)
  }

  const clearFilters = () => {
    setSelectedLanguages([])
    onFilterChange([])
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Filter by Language</h3>
        {selectedLanguages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-gray-400">
            Clear filters
          </Button>
        )}
      </div>

      <ScrollArea className="h-16 pb-2">
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => toggleLanguage(language)}
              className={`transition-all ${
                selectedLanguages.includes(language)
                  ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-800"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <LanguageBadge language={language} />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
