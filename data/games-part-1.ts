import type { Game } from "@/types/game"

// Games 1-100
export const gamesPart1: Game[] = [
  {
    id: 1,
    title: "Flappy Bird",
    slug: "flappy-bird",
    description:
      "Navigate a bird through a series of pipes without touching them. Tap or click to make the bird flap its wings and gain height. This addictive game requires precise timing and patience to master.",
    image: "/images/games/flappy-bird-icon.png",
    categories: ["Arcade", "Casual", "Endless Runner"],
    featured: true,
    popular: true,
    playUrl: "https://seraph-eight-omega.vercel.app/games/flappy/index.html",
    controls: "Tap, click, or press spacebar to flap wings and gain height. Avoid hitting pipes or the ground.",
    isWorking: true,
  },
  {
    id: 100,
    title: "That's Not My Neighbor",
    slug: "thats-not-my-neighbor",
    description:
      "A horror game where you must identify which of your neighbors has been replaced by an impostor. Observe their behavior and make your decision carefully.",
    image: "/images/games/thats-not-my-neighbor.jpg",
    categories: ["Horror", "Mystery", "Observation"],
    playUrl: "/games/thats-not-my-neighbor/index.html",
    controls: "Mouse to interact with objects and make choices. WASD to move around.",
    isWorking: false,
  },
]
