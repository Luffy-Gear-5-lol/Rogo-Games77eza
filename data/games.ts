import type { Game } from "@/types/game"
import { gamesPart1 } from "./games-part-1"
import { gamesPart2 } from "./games-part-2"
import { gamesPart3 } from "./games-part-3"

export const games: Game[] = [...gamesPart1, ...gamesPart2, ...gamesPart3]

import { manga } from "./manga"

export { manga }
