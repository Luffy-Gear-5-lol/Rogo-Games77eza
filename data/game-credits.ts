export interface GameCredit {
  name: string
  role: string
}

export interface GameSong {
  title: string
  week?: string | number
}

export interface GameCreditsData {
  modCredits?: GameCredit[]
  originalCredits?: GameCredit[]
  additionalInfo?: string
  songs?: GameSong[] | Record<string, GameSong[]>
}

// Original FNF credits that are common to all FNF mods
export const originalFnfCredits: GameCredit[] = [
  { name: "ninja_muffin99", role: "Programming" },
  { name: "KadeDev", role: "Programming" },
  { name: "PhantomArcade3k and evilsk8r", role: "ARTISTS" },
  { name: "kawaisprite", role: "TASTY ASS MUSIC" },
]

// Credits for specific games
export const gameCredits: Record<string, GameCreditsData> = {
  // FNF Mods
  "fnf-vs-sky": {
    modCredits: [{ name: "bbpanzu", role: "Programmer, Musician, Animator and Artist" }],
    originalCredits: originalFnfCredits,
    additionalInfo: "Optimized for Chromebook.",
    songs: [
      { title: "Wife Forever", week: 1 },
      { title: "Sky", week: 1 },
      { title: "Manifest", week: 1 },
    ],
  },
  "fnf-vs-imposter-v3": {
    modCredits: [
      { name: "Clowfoe", role: "Director" },
      { name: "Tenzubushi", role: "Programmer" },
      { name: "Moro", role: "Artist" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Sussus Moogus" }, { title: "Sabotage" }, { title: "Meltdown" }],
      "Week 2": [{ title: "Sussus Toogus" }, { title: "Lights Down" }, { title: "Reactor" }, { title: "Ejected" }],
      "Week 3": [{ title: "Sussy Bussy" }, { title: "Rivals" }, { title: "Chewmate" }],
      "???": [{ title: "Defeat" }],
    },
  },
  "fnf-vs-shaggy": {
    modCredits: [
      { name: "SrPerez", role: "Creator and Programmer" },
      { name: "TheZoroForce240", role: "Additional Programming" },
    ],
    originalCredits: originalFnfCredits,
    songs: [
      { title: "God Eater", week: 1 },
      { title: "Blast", week: 1 },
      { title: "Super Saiyan", week: 1 },
    ],
  },
  "fnf-vs-zardy": {
    modCredits: [
      { name: "Kade Dev", role: "Creator and Programmer" },
      { name: "SwankyBox", role: "Original Character Creator" },
    ],
    originalCredits: originalFnfCredits,
    songs: [{ title: "Foolhardy", week: 1 }],
  },
  "fnf-vs-qt": {
    modCredits: [
      { name: "Hazard24", role: "Creator and Programmer" },
      { name: "Springy", role: "Character Design" },
    ],
    originalCredits: originalFnfCredits,
    songs: [
      { title: "Carefree", week: 1 },
      { title: "Careless", week: 1 },
      { title: "Censory-Overload", week: 1 },
      { title: "Termination", week: 1 },
    ],
  },
  "fnf-vs-tricky": {
    modCredits: [
      { name: "BanbudsCS", role: "Art and Animation" },
      { name: "Rozebud", role: "Music" },
      { name: "KadeDev", role: "Programming" },
    ],
    originalCredits: originalFnfCredits,
    songs: [
      { title: "Improbable Outset", week: 1 },
      { title: "Madness", week: 1 },
      { title: "Hellclown", week: 1 },
      { title: "Expurgation", week: 1 },
    ],
  },
  "fnf-doki-doki-takeover": {
    modCredits: [
      { name: "Jorge_SunSpirit", role: "Director" },
      { name: "CelShader", role: "Programmer" },
      { name: "Monika Team", role: "Art and Animation" },
    ],
    originalCredits: originalFnfCredits,
    songs: [
      { title: "High School Conflict", week: 1 },
      { title: "Bara No Yume", week: 1 },
      { title: "Your Demise", week: 1 },
      { title: "Glitcher", week: 2 },
      { title: "Erb", week: 2 },
      { title: "Hashire", week: 2 },
    ],
  },

  // Other games
  minecraft: {
    modCredits: [
      { name: "Mojang Studios", role: "Original Game Developer" },
      { name: "Eaglercraft Team", role: "Web Port Developers" },
    ],
  },
  "among-us": {
    modCredits: [
      { name: "InnerSloth", role: "Original Game Developer" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  "flappy-bird": {
    modCredits: [
      { name: "Dong Nguyen", role: "Original Game Developer" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
}

// Function to get credits for a specific game
export function getGameCredits(slug: string): GameCreditsData | null {
  // If we have specific credits for this game, return them
  if (gameCredits[slug]) {
    return gameCredits[slug]
  }

  // For any FNF mod without specific credits, return generic FNF credits
  if (slug.startsWith("fnf-")) {
    return {
      originalCredits: originalFnfCredits,
    }
  }

  // Return null if no credits are available
  return null
}
