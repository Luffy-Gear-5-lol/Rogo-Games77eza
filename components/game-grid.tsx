import Link from "next/link"
import type { Game } from "@/types/game"
import GameCard from "@/components/game-card"

interface GameGridProps {
  games: Game[]
  showCategories?: boolean
  showNewBadge?: boolean
}

export default function GameGrid({ games, showCategories = true, showNewBadge = false }: GameGridProps) {
  // Consider games added within the last 7 days as "new" if showNewBadge is true
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {games.map((game) => (
        <Link key={game.id} href={`/game/${game.id}`} className="group">
          <GameCard
            game={game}
            isNew={showNewBadge && game.dateAdded ? new Date(game.dateAdded) > sevenDaysAgo : false}
          />
        </Link>
      ))}
    </div>
  )
}
