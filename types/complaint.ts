export interface GameComplaint {
  gameId: number
  gameTitle: string
  description: string
  email?: string
  timestamp: string
  resolved: boolean
}
