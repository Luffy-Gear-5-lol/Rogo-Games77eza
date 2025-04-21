"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const categories = ["All", "Action", "Adventure", "Arcade", "Puzzle", "Racing", "Sports", "Strategy"]

export default function GameCategories() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">
          {selectedCategory} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="hover:bg-gray-700 focus:bg-gray-700"
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
