"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { games } from "@/data/games"

interface CategoryFilterProps {
  onCategorySelect?: (category: string | null) => void
  selectedCategory?: string | null
}

export default function CategoryFilter({
  onCategorySelect,
  selectedCategory: propSelectedCategory,
}: CategoryFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(propSelectedCategory || null)

  // Get all unique categories from games
  const allCategories = new Set<string>()

  if (games && Array.isArray(games)) {
    games.forEach((game) => {
      if (game && game.categories && Array.isArray(game.categories)) {
        game.categories.forEach((category) => {
          if (category) allCategories.add(category)
        })
      }
    })
  }

  // Convert to array and sort alphabetically
  const categories = Array.from(allCategories).sort()

  // Update internal state when prop changes
  useEffect(() => {
    if (propSelectedCategory !== undefined) {
      setSelectedCategory(propSelectedCategory)
    }
  }, [propSelectedCategory])

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white w-full md:w-[200px] mb-4"
        >
          {selectedCategory ? selectedCategory : "All Categories"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-gray-800 border-gray-700 text-white w-[200px] max-h-[500px] overflow-auto">
        <Command>
          <CommandInput placeholder="Search categories..." className="bg-gray-800 text-white" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => handleCategorySelect(null)} className="hover:bg-gray-700">
                <Check className={`mr-2 h-4 w-4 ${selectedCategory === null ? "opacity-100" : "opacity-0"}`} />
                All Categories
              </CommandItem>
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => handleCategorySelect(category)}
                  className="hover:bg-gray-700"
                >
                  <Check className={`mr-2 h-4 w-4 ${selectedCategory === category ? "opacity-100" : "opacity-0"}`} />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
