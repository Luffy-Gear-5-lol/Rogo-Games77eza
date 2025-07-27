interface SongInfo {
  title: string
  composer?: string
  difficulty?: string
}

interface WeekSongs {
  week: string
  songs: SongInfo[]
}

export interface GameCredits {
  modCredits?: {
    developer?: string
    artist?: string
    composer?: string
    charter?: string
    additional?: string[]
  }
  originalCredits?: {
    developer?: string
    publisher?: string
    releaseYear?: string
    additional?: string[]
  }
  additionalInfo?: string[]
  songs?: SongInfo[] | WeekSongs[]
}

interface GameCreditsMap {
  [key: string]: GameCredits
}

const gameCredits: GameCreditsMap = {
  "fnf-vs-qt": {
    modCredits: {
      developer: "Hazard24",
      artist: "Hazard24, GenoX",
      composer: "GenoX",
      charter: "Hazard24",
      additional: ["Special thanks to the FNF community"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    additionalInfo: [
      "QT is a robot character created specifically for this mod.",
      "The mod features unique mechanics like sawblades and screen glitches.",
    ],
    songs: [
      {
        title: "Carefree",
        composer: "GenoX",
        difficulty: "Easy",
      },
      {
        title: "Careless",
        composer: "GenoX",
        difficulty: "Normal",
      },
      {
        title: "Censory-Overload",
        composer: "GenoX",
        difficulty: "Hard",
      },
      {
        title: "Termination",
        composer: "GenoX",
        difficulty: "Extreme",
      },
    ],
  },
  "fnf-vs-impostor-v3": {
    modCredits: {
      developer: "Clowfoe",
      artist: "Tenzubushi, Astro, Nasse",
      composer: "Rareblin, Atsuover, Clowfoe",
      charter: "Moro, Unholywanderer04",
      additional: ["Special thanks to the Among Us developers"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      {
        week: "Week 1",
        songs: [
          { title: "Sussus Moogus", composer: "Rareblin" },
          { title: "Sabotage", composer: "Rareblin" },
          { title: "Meltdown", composer: "Clowfoe" },
        ],
      },
      {
        week: "Week 2",
        songs: [
          { title: "Sussus Toogus", composer: "Atsuover" },
          { title: "Lights Down", composer: "Atsuover" },
          { title: "Reactor", composer: "Atsuover" },
          { title: "Ejected", composer: "Atsuover" },
        ],
      },
      {
        week: "Week 3",
        songs: [
          { title: "Sussy Bussy", composer: "Rareblin" },
          { title: "Rivals", composer: "Rareblin" },
          { title: "Chewmate", composer: "Rareblin" },
        ],
      },
      {
        week: "Week 4",
        songs: [
          { title: "Defeat", composer: "Rareblin" },
          { title: "Influence", composer: "Clowfoe" },
          { title: "Danger", composer: "Clowfoe" },
        ],
      },
      {
        week: "???",
        songs: [
          { title: "Double Kill", composer: "Rareblin" },
          { title: "Heartbeat", composer: "Clowfoe" },
          { title: "Pinkwave", composer: "Clowfoe" },
          { title: "Pretender", composer: "Rareblin" },
        ],
      },
    ],
  },
  "fnf-vs-shaggy": {
    modCredits: {
      developer: "SrPerez",
      artist: "SrPerez",
      composer: "Joan Atlas",
      charter: "SrPerez",
      additional: ["Based on the Ultra Instinct Shaggy meme"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Where Are You", composer: "Joan Atlas" },
      { title: "Eruption", composer: "Joan Atlas" },
      { title: "Kaio Ken", composer: "Joan Atlas" },
      { title: "Blast", composer: "Joan Atlas" },
      { title: "Super Saiyan", composer: "Joan Atlas" },
      { title: "God Eater", composer: "Joan Atlas" },
    ],
  },
  "fnf-vs-tricky": {
    modCredits: {
      developer: "Banbuds",
      artist: "Banbuds",
      composer: "Rozebud",
      charter: "KadeDev",
      additional: ["Based on Tricky from Madness Combat"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Improbable Outset", composer: "Rozebud" },
      { title: "Madness", composer: "Rozebud" },
      { title: "Hellclown", composer: "Rozebud" },
      { title: "Expurgation", composer: "Rozebud" },
    ],
  },
  "fnf-vs-whitty": {
    modCredits: {
      developer: "Sock.clip",
      artist: "Sock.clip",
      composer: "KuroaoTM",
      charter: "Sock.clip",
      additional: ["One of the first major FNF mods"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Lo-Fight", composer: "KuroaoTM" },
      { title: "Overhead", composer: "KuroaoTM" },
      { title: "Ballistic", composer: "KuroaoTM" },
    ],
  },
  "fnf-vs-zardy": {
    modCredits: {
      developer: "Swanky",
      artist: "Swanky",
      composer: "ROZEBUD",
      charter: "Swanky",
      additional: ["Based on the indie horror game Zardy's Maze"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Foolhardy", composer: "ROZEBUD" },
      { title: "Bushwhack", composer: "ROZEBUD" },
    ],
  },
  "fnf-vs-hex": {
    modCredits: {
      developer: "YingYang48",
      artist: "YingYang48",
      composer: "YingYang48",
      charter: "YingYang48",
      additional: ["Hex is a friendly basketball-playing robot"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Dunk", composer: "YingYang48" },
      { title: "Ram", composer: "YingYang48" },
      { title: "Hello World", composer: "YingYang48" },
      { title: "Glitcher", composer: "YingYang48" },
    ],
  },
  "fnf-vs-tabi": {
    modCredits: {
      developer: "Homskiy",
      artist: "Homskiy",
      composer: "Mike Geno",
      charter: "Homskiy",
      additional: ["Features unique mechanics and a dramatic storyline"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "My Battle", composer: "Mike Geno" },
      { title: "Last Chance", composer: "Mike Geno" },
      { title: "Genocide", composer: "Mike Geno" },
    ],
  },
  "fnf-vs-agoti": {
    modCredits: {
      developer: "SugarRatio",
      artist: "SugarRatio",
      composer: "AGOTI",
      charter: "SugarRatio",
      additional: ["Features unique void-like visuals"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Screenplay", composer: "AGOTI" },
      { title: "Parasite", composer: "AGOTI" },
      { title: "AGOTI", composer: "AGOTI" },
      { title: "A.G.O.T.I", composer: "AGOTI" },
    ],
  },
  "fnf-vs-kapi": {
    modCredits: {
      developer: "Paperkitty",
      artist: "Paperkitty",
      composer: "Mike Geno",
      charter: "Paperkitty",
      additional: ["Features DDR-style gameplay"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Wocky", composer: "Mike Geno" },
      { title: "Beathoven", composer: "Mike Geno" },
      { title: "Hairball", composer: "Mike Geno" },
      { title: "Nyaw", composer: "Mike Geno" },
    ],
  },
  "fnf-vs-garcello": {
    modCredits: {
      developer: "Atsuover",
      artist: "Atsuover",
      composer: "Atsuover",
      charter: "Atsuover",
      additional: ["Features a touching storyline"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Headache", composer: "Atsuover" },
      { title: "Nerves", composer: "Atsuover" },
      { title: "Release", composer: "Atsuover" },
      { title: "Fading", composer: "Atsuover" },
    ],
  },
  "fnf-vs-bob": {
    modCredits: {
      developer: "Wildythomas",
      artist: "Phlox",
      composer: "Phlox",
      charter: "Phlox",
      additional: ["A parody mod with intentionally bad art"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Bob's Onslaught", composer: "Phlox" },
      { title: "Ron", composer: "Phlox" },
      { title: "Trouble", composer: "Phlox" },
      { title: "Onslaught", composer: "Phlox" },
    ],
  },
  "fnf-vs-sky": {
    modCredits: {
      developer: "bbpanzu",
      artist: "bbpanzu",
      composer: "bbpanzu",
      charter: "bbpanzu",
      additional: ["Based on a character who is obsessed with Boyfriend"],
    },
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Original FNF by ninjamuffin99, PhantomArcade, evilsk8r, and KawaiSprite"],
    },
    songs: [
      { title: "Wife Forever", composer: "bbpanzu" },
      { title: "Sky", composer: "bbpanzu" },
      { title: "Manifest", composer: "bbpanzu" },
    ],
  },
  "fnf-original": {
    originalCredits: {
      developer: "ninjamuffin99",
      publisher: "Newgrounds",
      releaseYear: "2020",
      additional: ["Art by PhantomArcade and evilsk8r", "Music by KawaiSprite"],
    },
    songs: [
      {
        week: "Week 1 - Daddy Dearest",
        songs: [
          { title: "Bopeebo", composer: "KawaiSprite" },
          { title: "Fresh", composer: "KawaiSprite" },
          { title: "Dad Battle", composer: "KawaiSprite" },
        ],
      },
      {
        week: "Week 2 - Spooky Month",
        songs: [
          { title: "Spookeez", composer: "KawaiSprite" },
          { title: "South", composer: "KawaiSprite" },
          { title: "Monster", composer: "KawaiSprite" },
        ],
      },
      {
        week: "Week 3 - Pico",
        songs: [
          { title: "Pico", composer: "KawaiSprite" },
          { title: "Philly Nice", composer: "KawaiSprite" },
          { title: "Blammed", composer: "KawaiSprite" },
        ],
      },
      {
        week: "Week 4 - Mommy Mearest",
        songs: [
          { title: "Satin Panties", composer: "KawaiSprite" },
          { title: "High", composer: "KawaiSprite" },
          { title: "MILF", composer: "KawaiSprite" },
        ],
      },
      {
        week: "Week 5 - Christmas",
        songs: [
          { title: "Cocoa", composer: "KawaiSprite" },
          { title: "Eggnog", composer: "KawaiSprite" },
          { title: "Winter Horrorland", composer: "KawaiSprite" },
        ],
      },
      {
        week: "Week 6 - Senpai",
        songs: [
          { title: "Senpai", composer: "KawaiSprite" },
          { title: "Roses", composer: "KawaiSprite" },
          { title: "Thorns", composer: "KawaiSprite" },
        ],
      },
      {
        week: "Week 7 - Tankman",
        songs: [
          { title: "Ugh", composer: "KawaiSprite" },
          { title: "Guns", composer: "KawaiSprite" },
          { title: "Stress", composer: "KawaiSprite" },
        ],
      },
    ],
  },
}

export function getGameCredits(slug: string): GameCredits | undefined {
  return gameCredits[slug]
}
