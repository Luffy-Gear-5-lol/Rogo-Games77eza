export interface Game {
  id: number
  title: string
  description: string
  imageUrl?: string
  categories?: string[]
  featured?: boolean
  popular?: boolean
  playUrl?: string
  controls: string
  isWorking?: boolean
  dateAdded?: string
  comingSoon?: boolean
  languages?: string[]
  languageIcons?: {
    [key: string]: string
  }
}
