export interface Game {
  id: number
  title: string
  description: string
  image?: string
  controls?: string
  playUrl?: string
  featured?: boolean
  popular?: boolean
  categories?: string[]
  isWorking?: boolean
  views?: number
  dateAdded?: string // ISO date string when the game was added
  series?: string
  slug?: string
  languages?: string[] // Programming languages used in game
  comingSoon?: boolean // Whether the game is coming soon
}
