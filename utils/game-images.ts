/**
 * Comprehensive mapping of games to their cover art images
 * Uses placeholder generation for games without custom images
 */

export const gameImageMap: Record<number, { title: string; query: string }> = {
  1: { title: "Flappy Bird", query: "flappy bird arcade game icon" },
  2: { title: "2048", query: "2048 puzzle game tiles" },
  3: { title: "Snake", query: "classic snake game retro" },
  4: { title: "Tetris", query: "tetris block puzzle game" },
  5: { title: "Pac-Man", query: "pacman arcade maze game" },
  6: { title: "Space Invaders", query: "space invaders arcade shooter" },
  7: { title: "Breakout", query: "breakout brick breaker arcade" },
  8: { title: "Asteroids", query: "asteroids arcade space game" },
  9: { title: "Pong", query: "pong classic arcade paddle" },
  10: { title: "Donkey Kong", query: "donkey kong arcade game" },
  11: { title: "Mario Bros", query: "mario brothers arcade classic" },
  12: { title: "Dig Dug", query: "dig dug arcade game" },
  13: { title: "Galaga", query: "galaga arcade shooter space" },
  14: { title: "Q*bert", query: "qbert arcade pyramid game" },
  15: { title: "Centipede", query: "centipede arcade game" },
  16: { title: "Missile Command", query: "missile command arcade defense" },
  17: { title: "Tempest", query: "tempest arcade game" },
  18: { title: "Defender", query: "defender arcade game space" },
  19: { title: "Scramble", query: "scramble arcade game" },
  20: { title: "Robotron", query: "robotron arcade game" },
  21: { title: "Joust", query: "joust arcade game" },
  22: { title: "Frogger", query: "frogger arcade game" },
  23: { title: "Burgertime", query: "burgertime arcade game" },
  24: { title: "Sinistar", query: "sinistar arcade game" },
  25: { title: "Zaxxon", query: "zaxxon arcade game" },
  26: { title: "Gyruss", query: "gyruss arcade game" },
  27: { title: "Demon Attack", query: "demon attack arcade game" },
  28: { title: "Commando", query: "commando arcade game" },
  29: { title: "Moon Patrol", query: "moon patrol arcade game" },
  30: { title: "Jungle Hunt", query: "jungle hunt arcade game" },
  31: { title: "Pengo", query: "pengo arcade game" },
  32: { title: "Lady Bug", query: "lady bug arcade game" },
  33: { title: "Mouse Trap", query: "mouse trap arcade game" },
  34: { title: "Battlezone", query: "battlezone arcade game" },
  35: { title: "Red Baron", query: "red baron arcade game" },
  36: { title: "Berzerk", query: "berzerk arcade game" },
  37: { title: "Robotank", query: "robotank arcade game" },
  38: { title: "Qix", query: "qix arcade game" },
  39: { title: "Warlords", query: "warlords arcade game" },
  40: { title: "Kangaroo", query: "kangaroo arcade game" },
  100: { title: "That's Not My Neighbor", query: "thats not my neighbor horror game" },
}

// Fill in remaining games with generic game queries
for (let i = 41; i <= 231; i++) {
  if (!gameImageMap[i]) {
    gameImageMap[i] = { title: `Game ${i}`, query: `online game video game` }
  }
}

/**
 * Get the appropriate image URL for a game
 * Falls back to placeholder with game-specific query if no custom image exists
 */
export function getGameImageUrl(gameId: number, customImage?: string): string {
  // If custom image is provided and is not a placeholder, use it
  if (customImage && !customImage.includes("placeholder.svg")) {
    return customImage
  }

  const gameInfo = gameImageMap[gameId]
  if (gameInfo) {
    return `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(gameInfo.query)}`
  }

  return `/placeholder.svg?height=300&width=400&query=game`
}

/**
 * Get image URL for featured sections
 */
export function getGameFeaturedImageUrl(gameId: number, customImage?: string): string {
  if (customImage && !customImage.includes("placeholder.svg")) {
    return customImage
  }

  const gameInfo = gameImageMap[gameId]
  if (gameInfo) {
    return `/placeholder.svg?height=600&width=1400&query=${encodeURIComponent(gameInfo.query)}`
  }

  return `/placeholder.svg?height=600&width=1400&query=game`
}

/**
 * Get all games with their proper image URLs
 */
export function enrichGameWithImage(game: any): any {
  return {
    ...game,
    image: getGameImageUrl(game.id, game.image),
  }
}
