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
  // FNF Mods - Complete song lists
  "fnf-vs-sky": {
    modCredits: [{ name: "bbpanzu", role: "Programmer, Musician, Animator and Artist" }],
    originalCredits: originalFnfCredits,
    additionalInfo: "Optimized for Chromebook.",
    songs: {
      "Week 1": [{ title: "Wife Forever" }, { title: "Sky" }, { title: "Manifest" }],
    },
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
    songs: {
      "Week 1": [{ title: "God Eater" }, { title: "Blast" }, { title: "Super Saiyan" }],
    },
  },
  "fnf-vs-zardy": {
    modCredits: [
      { name: "Kade Dev", role: "Creator and Programmer" },
      { name: "SwankyBox", role: "Original Character Creator" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Foolhardy" }],
    },
  },
  "fnf-vs-qt": {
    modCredits: [
      { name: "Hazard24", role: "Creator and Programmer" },
      { name: "Springy", role: "Character Design" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Carefree" }, { title: "Careless" }, { title: "Censory-Overload" }, { title: "Termination" }],
    },
  },
  "fnf-vs-tricky": {
    modCredits: [
      { name: "BanbudsCS", role: "Art and Animation" },
      { name: "Rozebud", role: "Music" },
      { name: "KadeDev", role: "Programming" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [
        { title: "Improbable Outset" },
        { title: "Madness" },
        { title: "Hellclown" },
        { title: "Expurgation" },
      ],
    },
  },
  "fnf-doki-doki-takeover": {
    modCredits: [
      { name: "Jorge_SunSpirit", role: "Director" },
      { name: "CelShader", role: "Programmer" },
      { name: "Monika Team", role: "Art and Animation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "High School Conflict" }, { title: "Bara No Yume" }, { title: "Your Demise" }],
      "Week 2": [{ title: "Glitcher" }, { title: "Erb" }, { title: "Hashire" }],
    },
  },
  "fnf-cheeky": {
    modCredits: [
      { name: "Cheeky", role: "Character Creator" },
      { name: "Various Artists", role: "Music and Art" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Cheeky" }, { title: "Cheekier" }],
      "Week 2": [{ title: "Cheekiest" }],
    },
  },
  "fnf-agoti": {
    modCredits: [
      { name: "SugarRatio", role: "Director and Artist" },
      { name: "Agoti", role: "Character Creator" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Screenplay" }, { title: "Parasite" }, { title: "A.G.O.T.I" }],
    },
  },
  "fnf-witty-v2": {
    modCredits: [
      { name: "Witty", role: "Character Creator" },
      { name: "Various Artists", role: "Music and Programming" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Witty" }, { title: "Pressure" }, { title: "Neuroses" }],
    },
  },
  "fnf-sonic-exe": {
    modCredits: [
      { name: "RightBurstUltra", role: "Director" },
      { name: "MarStarBro", role: "Programmer" },
      { name: "Comgaming_Nz", role: "Artist" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Too Slow" }, { title: "You Can't Run" }, { title: "Triple Trouble" }],
      Encore: [{ title: "Endless" }, { title: "Cycles" }, { title: "Sunshine" }],
    },
  },
  "fnf-corrupted-spongebob": {
    modCredits: [
      { name: "Sandi_Clubhouse", role: "Director" },
      { name: "Various Artists", role: "Music and Art" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Ready or Not" }, { title: "Burning" }, { title: "Suffering Siblings" }],
    },
  },
  "fnf-bob": {
    modCredits: [
      { name: "phlox", role: "Creator" },
      { name: "amor", role: "Programmer" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Sunshine" }, { title: "Withered" }, { title: "Run" }],
    },
  },
  "fnf-sans-undertale": {
    modCredits: [
      { name: "Toby Fox", role: "Original Undertale Creator" },
      { name: "Various Artists", role: "FNF Adaptation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Whoopee" }, { title: "Sansational" }, { title: "Final Stretch" }],
    },
  },
  "fnf-sans": {
    modCredits: [
      { name: "Toby Fox", role: "Original Undertale Creator" },
      { name: "Various Artists", role: "FNF Adaptation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Megalovania" }, { title: "Bad Time" }],
    },
  },
  "fnf-qt-more-keys": {
    modCredits: [
      { name: "Hazard24", role: "Creator and Programmer" },
      { name: "Springy", role: "Character Design" },
    ],
    originalCredits: originalFnfCredits,
    additionalInfo: "Extended version with additional key mechanics.",
    songs: {
      "Week 1": [
        { title: "Carefree (9K)" },
        { title: "Careless (9K)" },
        { title: "Censory-Overload (9K)" },
        { title: "Termination (9K)" },
      ],
    },
  },
  "fnf-matt-3-0": {
    modCredits: [
      { name: "bbpanzu", role: "Creator" },
      { name: "Nintendo", role: "Original Wii Sports" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Target Practice" }, { title: "Sporting" }, { title: "Boxing Match" }],
      "Week 2": [{ title: "Ringing" }, { title: "Final Destination" }],
    },
  },
  "fnf-marios-madness": {
    modCredits: [
      { name: "Marco Antonio", role: "Director" },
      { name: "Various Artists", role: "Music and Art" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "It's a Me" }, { title: "Starman Slaughter" }, { title: "So Cool" }],
      "Week 2": [{ title: "Nourishing Blood" }, { title: "Bad Day" }, { title: "Day Out" }],
    },
  },
  "fnf-slenderman": {
    modCredits: [
      { name: "Various Artists", role: "Mod Creation" },
      { name: "Eric Knudsen", role: "Original Slenderman Creator" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Followed" }, { title: "Stalked" }, { title: "Prey" }],
    },
  },
  "fnf-indie-cross-nightmare": {
    modCredits: [
      { name: "MORØ", role: "Director" },
      { name: "Jacobe", role: "Programmer" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Cuphead Week": [{ title: "Snake Eyes" }, { title: "Technicolor Tussle" }, { title: "Knockout" }],
      "Sans Week": [{ title: "Sansational" }, { title: "Burning in Hell" }],
      "Bendy Week": [{ title: "Imminent Demise" }, { title: "Terrible Sin" }, { title: "Last Reel" }],
    },
  },
  "fnf-tabi": {
    modCredits: [
      { name: "Homskiy", role: "Creator and Artist" },
      { name: "Various Artists", role: "Music" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "My Battle" }, { title: "Last Chance" }, { title: "Genocide" }],
    },
  },
  "fnf-dusttale": {
    modCredits: [
      { name: "Toby Fox", role: "Original Undertale Creator" },
      { name: "Various Artists", role: "Dusttale Adaptation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "DustTale" }, { title: "Lovania" }, { title: "Gaster" }],
    },
  },
  "fnf-super-idol": {
    modCredits: [{ name: "Various Artists", role: "Mod Creation" }],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Super Idol" }],
    },
  },
  "fnf-huggy-wuggy": {
    modCredits: [
      { name: "MOB Games", role: "Original Poppy Playtime Creator" },
      { name: "Various Artists", role: "FNF Adaptation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Playtime" }, { title: "Huggy" }],
    },
  },
  "fnf-neo": {
    modCredits: [
      { name: "YingYang48", role: "Director" },
      { name: "Various Artists", role: "Neon Remixes" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Bopeebo (Neo Mix)" }, { title: "Fresh (Neo Mix)" }, { title: "Dad Battle (Neo Mix)" }],
      "Week 2": [{ title: "Spookeez (Neo Mix)" }, { title: "South (Neo Mix)" }, { title: "Monster (Neo Mix)" }],
    },
  },
  "fnf-vs-trollface": {
    modCredits: [{ name: "Various Artists", role: "Mod Creation" }],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Trolling" }, { title: "Incident" }, { title: "Rage" }],
    },
  },
  "fnf-vs-steve": {
    modCredits: [
      { name: "Mojang Studios", role: "Original Minecraft Creator" },
      { name: "Various Artists", role: "FNF Adaptation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Mining" }, { title: "Crafting" }, { title: "Survival" }],
    },
  },
  "fnf-soft-mod": {
    modCredits: [
      { name: "tama", role: "Director" },
      { name: "Various Artists", role: "Soft Remixes" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Bopeebo (Soft)" }, { title: "Fresh (Soft)" }, { title: "Dad Battle (Soft)" }],
      "Week 2": [{ title: "Spookeez (Soft)" }, { title: "South (Soft)" }],
    },
  },
  "fnf-vs-camellia": {
    modCredits: [
      { name: "Camellia", role: "Original Music Artist" },
      { name: "Various Artists", role: "FNF Adaptation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "First Town" }, { title: "Liquated" }, { title: "Why Do You Hate Me" }, { title: "Ghost" }],
    },
  },
  "fnf-vs-8bitryan": {
    modCredits: [
      { name: "8BitRyan", role: "YouTuber" },
      { name: "Various Artists", role: "Mod Creation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Gamer Time" }, { title: "Glitched Out" }],
    },
  },
  "fnf-vs-nonsense": {
    modCredits: [
      { name: "NonsenseHumor", role: "Character Creator" },
      { name: "Various Artists", role: "Music and Art" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Common Sense" }, { title: "Nonsensical" }, { title: "Cringe" }],
    },
  },
  "fnf-vs-garcello": {
    modCredits: [
      { name: "atsuover", role: "Creator and Artist" },
      { name: "bbpanzu", role: "Programming" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Headache" }, { title: "Nerves" }, { title: "Release" }, { title: "Fading" }],
    },
  },

  // Classic Games
  "flappy-bird": {
    modCredits: [
      { name: "Dong Nguyen", role: "Original Game Developer" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  tetris: {
    modCredits: [
      { name: "Alexey Pajitnov", role: "Original Game Creator" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  pacman: {
    modCredits: [
      { name: "Namco", role: "Original Game Developer" },
      { name: "Toru Iwatani", role: "Game Designer" },
    ],
  },
  snake: {
    modCredits: [
      { name: "Nokia", role: "Original Mobile Version" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  "run-3": {
    modCredits: [
      { name: "Player 03", role: "Game Developer" },
      { name: "Kongregate", role: "Publisher" },
    ],
  },
  chess: {
    modCredits: [
      { name: "Ancient Game", role: "Traditional Board Game" },
      { name: "Web Implementation Team", role: "Digital Version" },
    ],
  },
  "impossible-quiz": {
    modCredits: [
      { name: "Splapp-me-do", role: "Game Creator" },
      { name: "Newgrounds", role: "Original Platform" },
    ],
  },
  wordle: {
    modCredits: [
      { name: "Josh Wardle", role: "Original Game Creator" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  "angry-birds": {
    modCredits: [
      { name: "Rovio Entertainment", role: "Original Game Developer" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  "2048": {
    modCredits: [
      { name: "Gabriele Cirulli", role: "Game Creator" },
      { name: "Threes! Team", role: "Original Inspiration" },
    ],
  },
  "fireboy-and-watergirl": {
    modCredits: [
      { name: "Oslo Albet", role: "Game Developer" },
      { name: "Jan Villanueva", role: "Game Developer" },
    ],
  },
  "tower-of-hell": {
    modCredits: [
      { name: "YXCeptional Studios", role: "Original Roblox Developer" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  "drift-hunters": {
    modCredits: [{ name: "Studionum43", role: "Game Developer" }],
  },
  bloxorz: {
    modCredits: [
      { name: "Damien Clarke", role: "Game Creator" },
      { name: "CoolMath Games", role: "Publisher" },
    ],
  },
  "cluster-rush": {
    modCredits: [{ name: "Landfall Games", role: "Game Developer" }],
  },
  fnaf: {
    modCredits: [{ name: "Scott Cawthon", role: "Game Creator and Developer" }],
  },
  "fnaf-2": {
    modCredits: [{ name: "Scott Cawthon", role: "Game Creator and Developer" }],
  },
  "fnaf-3": {
    modCredits: [{ name: "Scott Cawthon", role: "Game Creator and Developer" }],
  },
  minecraft: {
    modCredits: [
      { name: "Mojang Studios", role: "Original Game Developer" },
      { name: "Notch (Markus Persson)", role: "Original Creator" },
      { name: "Eaglercraft Team", role: "Web Port Developers" },
    ],
  },
  "among-us": {
    modCredits: [
      { name: "InnerSloth", role: "Game Developer" },
      { name: "Marcus Bromander", role: "Programmer" },
      { name: "Forest Willard", role: "Artist" },
    ],
  },
  "subway-surfers": {
    modCredits: [
      { name: "SYBO", role: "Game Developer" },
      { name: "Kiloo", role: "Co-Developer" },
    ],
  },
  uno: {
    modCredits: [
      { name: "Merle Robbins", role: "Original Card Game Creator" },
      { name: "Mattel", role: "Current Rights Holder" },
    ],
  },
  "geometry-dash": {
    modCredits: [{ name: "Robert Topala (RobTop)", role: "Game Creator and Developer" }],
  },
  "the-sims-3": {
    modCredits: [
      { name: "Maxis", role: "Game Developer" },
      { name: "Electronic Arts", role: "Publisher" },
    ],
  },
  roblox: {
    modCredits: [
      { name: "Roblox Corporation", role: "Platform Developer" },
      { name: "David Baszucki", role: "CEO and Co-Founder" },
    ],
  },
  "slither-io": {
    modCredits: [{ name: "Steve Howse", role: "Game Developer" }],
  },
  "cookie-clicker": {
    modCredits: [{ name: "Julien Thiennot (Orteil)", role: "Game Creator" }],
  },

  // Additional games
  "vex-5": {
    modCredits: [{ name: "Amazing Adam", role: "Game Developer" }],
  },
  "random-basket": {
    modCredits: [{ name: "RHM Interactive", role: "Game Developer" }],
  },
  "basket-bros": {
    modCredits: [{ name: "Blue Wizard Digital", role: "Game Developer" }],
  },
  "a-small-world-cup": {
    modCredits: [{ name: "Rujo Games", role: "Game Developer" }],
  },
  "super-mario-64": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Shigeru Miyamoto", role: "Producer" },
      { name: "Web Port Team", role: "Web Port Developers" },
    ],
  },
  "house-of-hazards": {
    modCredits: [{ name: "NewEich Games", role: "Game Developer" }],
  },
  bitlife: {
    modCredits: [{ name: "Candywriter", role: "Game Developer" }],
  },
  "monkey-mart": {
    modCredits: [{ name: "TinyDobbins", role: "Game Developer" }],
  },
  "tiny-fishing": {
    modCredits: [{ name: "Mad Buffer", role: "Game Developer" }],
  },
  "basketball-stars": {
    modCredits: [{ name: "Madpuffers", role: "Game Developer" }],
  },
  "bacon-may-die": {
    modCredits: [{ name: "Snoutup Games", role: "Game Developer" }],
  },
  "bad-time-simulator": {
    modCredits: [
      { name: "Toby Fox", role: "Original Undertale Creator" },
      { name: "jcw87", role: "Simulator Creator" },
    ],
  },
  "n-gon": {
    modCredits: [{ name: "landgreen", role: "Game Developer" }],
  },
  "fnf-vs-kapi": {
    modCredits: [
      { name: "PaperKitty", role: "Creator and Artist" },
      { name: "Various Artists", role: "Music" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Wocky" }, { title: "Beathoven" }, { title: "Hairball" }, { title: "Nyaw" }],
    },
  },
  "baldis-basics": {
    modCredits: [{ name: "Micah McGonigal", role: "Game Creator" }],
  },
  "iron-snout": {
    modCredits: [{ name: "SnoutUp Games", role: "Game Developer" }],
  },
  "getting-over-it": {
    modCredits: [{ name: "Bennett Foddy", role: "Game Creator" }],
  },
  "friday-night-funkin": {
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Bopeebo" }, { title: "Fresh" }, { title: "Dad Battle" }],
      "Week 2": [{ title: "Spookeez" }, { title: "South" }, { title: "Monster" }],
      "Week 3": [{ title: "Pico" }, { title: "Philly Nice" }, { title: "Blammed" }],
      "Week 4": [{ title: "Satin Panties" }, { title: "High" }, { title: "M.I.L.F" }],
      "Week 5": [{ title: "Cocoa" }, { title: "Eggnog" }, { title: "Winter Horrorland" }],
      "Week 6": [{ title: "Senpai" }, { title: "Roses" }, { title: "Thorns" }],
      "Week 7": [{ title: "Ugh" }, { title: "Guns" }, { title: "Stress" }],
    },
  },
  "paper-io-2": {
    modCredits: [{ name: "Voodoo", role: "Game Developer" }],
  },
  "drive-mad": {
    modCredits: [{ name: "Martin Magni", role: "Game Developer" }],
  },
  "doge-miner-2": {
    modCredits: [{ name: "rkn", role: "Game Developer" }],
  },
  "doge-miner": {
    modCredits: [{ name: "rkn", role: "Game Developer" }],
  },
  "idle-breakout": {
    modCredits: [{ name: "Kodiqi", role: "Game Developer" }],
  },
  "stickman-hook": {
    modCredits: [{ name: "Madbox", role: "Game Developer" }],
  },
  "doodle-jump": {
    modCredits: [{ name: "Lima Sky", role: "Game Developer" }],
  },
  "getaway-shootout": {
    modCredits: [{ name: "New Eich Games", role: "Game Developer" }],
  },
  "moto-x3m-winter": {
    modCredits: [{ name: "Madpuffers", role: "Game Developer" }],
  },
  "moto-x3m-pool-party": {
    modCredits: [{ name: "Madpuffers", role: "Game Developer" }],
  },
  "moto-x3m": {
    modCredits: [{ name: "Madpuffers", role: "Game Developer" }],
  },
  "clicker-heroes": {
    modCredits: [{ name: "Playsaurus", role: "Game Developer" }],
  },
  "monster-tracks": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "infinite-craft": {
    modCredits: [{ name: "Neal Agarwal", role: "Game Creator" }],
  },
  "genshin-impact": {
    modCredits: [
      { name: "miHoYo", role: "Original Game Developer" },
      { name: "Web Port Team", role: "Fan-made Web Version" },
    ],
  },
  ovo: {
    modCredits: [{ name: "Dedra Games", role: "Game Developer" }],
  },
  "pokemon-emerald": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "pokemon-sapphire": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "idle-dice": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "pico-8": {
    modCredits: [
      { name: "Lexaloffle Games", role: "Console Creator" },
      { name: "Various Developers", role: "Game Collection" },
    ],
  },
  "neon-blasters": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "the-final-earth-2": {
    modCredits: [{ name: "Florian van Strien", role: "Game Developer" }],
  },
  "pokemon-ruby": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "pokemon-fusion-generator": {
    modCredits: [
      { name: "Alex Onsager", role: "Fusion Generator Creator" },
      { name: "Game Freak", role: "Original Pokémon Creator" },
    ],
  },
  "kirby-and-the-amazing-mirror": {
    modCredits: [
      { name: "HAL Laboratory", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "gun-mayhem-2": {
    modCredits: [{ name: "Kevin Gu", role: "Game Developer" }],
  },
  "fnf-vs-chara": {
    modCredits: [
      { name: "Toby Fox", role: "Original Undertale Creator" },
      { name: "Various Artists", role: "FNF Adaptation" },
    ],
    originalCredits: originalFnfCredits,
    songs: {
      "Week 1": [{ title: "Megalo Strike Back" }, { title: "Burning in Hell" }],
    },
  },
  "bob-the-robber": {
    modCredits: [{ name: "Flazm", role: "Game Developer" }],
  },
  "snow-rider-3d": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "off-brand-mario": {
    modCredits: [
      { name: "Nintendo", role: "Original Mario Creator" },
      { name: "Fan Developers", role: "Fan-made Version" },
    ],
  },
  "1v1-lol": {
    modCredits: [{ name: "JustPlay.LOL", role: "Game Developer" }],
  },
  "time-shooter-3-swat": {
    modCredits: [{ name: "GoGoMan", role: "Game Developer" }],
  },
  "twisted-cooking-mama": {
    modCredits: [
      { name: "Office Create", role: "Original Cooking Mama Creator" },
      { name: "Fan Developers", role: "Parody Version" },
    ],
  },
  "rooftop-snipers": {
    modCredits: [{ name: "New Eich Games", role: "Game Developer" }],
  },
  terraria: {
    modCredits: [
      { name: "Re-Logic", role: "Game Developer" },
      { name: "Andrew Spinks", role: "Creator" },
    ],
  },
  "pixel-shooter": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "bob-the-robber-2": {
    modCredits: [{ name: "Flazm", role: "Game Developer" }],
  },
  "retro-bowl": {
    modCredits: [{ name: "New Star Games", role: "Game Developer" }],
  },
  "last-wood": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "fairy-tail-vs-one-piece": {
    modCredits: [
      { name: "Fan Developers", role: "Fan-made Fighting Game" },
      { name: "Hiro Mashima", role: "Fairy Tail Creator" },
      { name: "Eiichiro Oda", role: "One Piece Creator" },
    ],
  },
  "pokemon-firered": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "snowball-io": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "fnaf-4": {
    modCredits: [{ name: "Scott Cawthon", role: "Game Creator and Developer" }],
  },
  "fnaf-sister-location": {
    modCredits: [{ name: "Scott Cawthon", role: "Game Creator and Developer" }],
  },
  "fnaf-ultimate-custom-night": {
    modCredits: [{ name: "Scott Cawthon", role: "Game Creator and Developer" }],
  },
  "fnaf-security-breach": {
    modCredits: [
      { name: "Scott Cawthon", role: "Original Creator" },
      { name: "Steel Wool Studios", role: "Game Developer" },
    ],
  },
  "amanda-the-adventurer": {
    modCredits: [{ name: "MANGLEDmaw Games", role: "Game Developer" }],
  },
  "ragdoll-archers": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  granny: {
    modCredits: [{ name: "DVloper", role: "Game Developer" }],
  },
  "crusher-clicker": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "amanda-the-adventurer-2": {
    modCredits: [{ name: "MANGLEDmaw Games", role: "Game Developer" }],
  },
  "golf-orbit": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  slope: {
    modCredits: [{ name: "Rob Kay", role: "Game Developer" }],
  },
  "thats-not-my-neighbor": {
    modCredits: [{ name: "Nacho Sama", role: "Game Developer" }],
  },
  backrooms: {
    modCredits: [
      { name: "Various Developers", role: "Game Development" },
      { name: "Kane Pixels", role: "Backrooms Concept" },
    ],
  },
  "toss-the-turtle": {
    modCredits: [
      { name: "Armor Games", role: "Publisher" },
      { name: "Gonzossm", role: "Game Developer" },
    ],
  },
  "rainbow-six-siege": {
    modCredits: [
      { name: "Ubisoft Montreal", role: "Original Game Developer" },
      { name: "Web Port Team", role: "Fan-made Web Version" },
    ],
  },
  "totally-accurate-battle-simulator": {
    modCredits: [{ name: "Landfall Games", role: "Game Developer" }],
  },
  "hunted-school": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "house-of-celestina": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  ravenfield: {
    modCredits: [{ name: "SteelRaven7", role: "Game Developer" }],
  },
  "kick-the-buddy": {
    modCredits: [{ name: "Playgendary", role: "Game Developer" }],
  },
  "burger-and-frights": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "iron-friend": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "horror-tale-2": {
    modCredits: [{ name: "Euphoria Horror Games", role: "Game Developer" }],
  },
  "horror-tale": {
    modCredits: [{ name: "Euphoria Horror Games", role: "Game Developer" }],
  },
  "isles-of-mists": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "red-ball-4": {
    modCredits: [{ name: "FDG Entertainment", role: "Game Developer" }],
  },
  spades: {
    modCredits: [
      { name: "Traditional Card Game", role: "Classic Game" },
      { name: "Web Implementation Team", role: "Digital Version" },
    ],
  },
  "block-blast": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "tunnel-rush": {
    modCredits: [{ name: "Deer Cat", role: "Game Developer" }],
  },
  "swords-and-sandals": {
    modCredits: [{ name: "3RDsense", role: "Game Developer" }],
  },
  rezizer: {
    modCredits: [{ name: "Hooda Math", role: "Game Developer" }],
  },
  "legend-of-zelda-ocarina-of-time": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Shigeru Miyamoto", role: "Producer" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "worlds-hardest-game": {
    modCredits: [{ name: "Stephen Critoph", role: "Game Creator" }],
  },
  "territorial-io": {
    modCredits: [{ name: "David Tschacher", role: "Game Developer" }],
  },
  "eggy-car": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "age-of-war": {
    modCredits: [{ name: "Louissi", role: "Game Developer" }],
  },
  "mr-mine": {
    modCredits: [{ name: "Playsaurus", role: "Game Developer" }],
  },
  "skibi-toilet-attack": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "drift-boss": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  recoil: {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "football-legends": {
    modCredits: [{ name: "Madpuffers", role: "Game Developer" }],
  },
  "tunnel-rush-mania": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "room-clicker": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "skibidi-toilet-io": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "funny-shooter-2": {
    modCredits: [{ name: "GoGoMan", role: "Game Developer" }],
  },
  "idle-ants": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  swingo: {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  coreball: {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  circloo: {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "astro-survivors": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "archery-world-tour": {
    modCredits: [{ name: "Various Developers", role: "Game Development" }],
  },
  "swords-and-sandals-2": {
    modCredits: [{ name: "3RDsense", role: "Game Developer" }],
  },
  "legend-of-zelda-majoras-mask": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Eiji Aonuma", role: "Director" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "tomb-of-the-mask": {
    modCredits: [{ name: "Playgendary", role: "Game Developer" }],
  },
  "bad-piggies": {
    modCredits: [{ name: "Rovio Entertainment", role: "Game Developer" }],
  },
  "red-ball-4-vol-2": {
    modCredits: [{ name: "FDG Entertainment", role: "Game Developer" }],
  },
  "red-ball-4-vol-3": {
    modCredits: [{ name: "FDG Entertainment", role: "Game Developer" }],
  },
  "the-binding-of-isaac": {
    modCredits: [
      { name: "Edmund McMillen", role: "Designer" },
      { name: "Florian Himsl", role: "Programmer" },
    ],
  },
  "crossy-road": {
    modCredits: [{ name: "Hipster Whale", role: "Game Developer" }],
  },
  "super-mario-world": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Shigeru Miyamoto", role: "Producer" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "sonic-3": {
    modCredits: [
      { name: "Sonic Team", role: "Original Game Developer" },
      { name: "Sega", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "sonic-2": {
    modCredits: [
      { name: "Sonic Team", role: "Original Game Developer" },
      { name: "Sega", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "sonic-1": {
    modCredits: [
      { name: "Sonic Team", role: "Original Game Developer" },
      { name: "Sega", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "sonic-and-knuckles": {
    modCredits: [
      { name: "Sonic Team", role: "Original Game Developer" },
      { name: "Sega", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "super-mario-bros": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Shigeru Miyamoto", role: "Creator" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "super-mario-64-ds": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Shigeru Miyamoto", role: "Producer" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "new-super-mario-bros": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Shigeru Miyamoto", role: "Producer" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "pokemon-leaf-green": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "mario-kart-super-circuit": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Intelligent Systems", role: "Co-Developer" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "mario-party-ds": {
    modCredits: [
      { name: "Hudson Soft", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "mario-kart-64": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Shigeru Miyamoto", role: "Producer" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "mario-kart-ds": {
    modCredits: [
      { name: "Nintendo EAD", role: "Original Game Developer" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "pokemon-platinum": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "pokemon-diamond": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "age-of-war-2": {
    modCredits: [{ name: "Louissi", role: "Game Developer" }],
  },
  "buckshot-roulette": {
    modCredits: [{ name: "Mike Klubnika", role: "Game Developer" }],
  },
  "pokemon-soulsilver": {
    modCredits: [
      { name: "Game Freak", role: "Original Game Developer" },
      { name: "Nintendo", role: "Publisher" },
      { name: "Web Emulation Team", role: "Web Port" },
    ],
  },
  "pizza-tower": {
    modCredits: [{ name: "Tour De Pizza", role: "Game Developer" }],
  },
  "plants-vs-zombies-random-gamemode": {
    modCredits: [
      { name: "PopCap Games", role: "Original Game Developer" },
      { name: "Fan Developers", role: "Random Mode Creator" },
    ],
  },
  rammerhead: {
    modCredits: [{ name: "Various Developers", role: "Proxy Service" }],
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
