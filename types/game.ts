export interface Game {
  id: number
  title: string
  slug: string
  description: string
  image: string
  categories: string[] // Changed from single category to array of categories
  featured?: boolean
  popular?: boolean
  new?: boolean
  series?: string
  playUrl: string
  controls: string
  views?: number
  isWorking?: boolean
}
