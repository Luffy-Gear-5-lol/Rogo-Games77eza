import type { Game } from "@/types/game"

// Games 101-200
export const gamesPart2: Game[] = [
  {
    id: 101,
    title: "Backrooms",
    slug: "backrooms",
    description:
      "Explore the eerie and seemingly endless yellow rooms known as the Backrooms. Navigate through this liminal space while avoiding mysterious entities that lurk within.",
    image: "/images/games/backrooms.jpg",
    categories: ["Horror", "Exploration", "Survival"],
    playUrl: "/games/backrooms/index.html",
    controls: "WASD to move, Shift to run, E to interact, F for flashlight.",
    isWorking: false,
  },
  {
    id: 200,
    title: "FNF vs Garcello (DFJK controls + arrow keys)",
    slug: "fnf-vs-garcello",
    description:
      "A Friday Night Funkin' mod featuring Garcello with unique songs and relatively easy patterns. Supports both DFJK and arrow key controls.",
    image: "/images/games/fnf-garcello.jpg",
    categories: ["Music", "Rhythm", "FNF"],
    playUrl: "https://hjjhjkj.vercel.app/",
    controls: "Arrow keys or DFJK to hit notes in time with the music.",
    isWorking: true,
  },
]
