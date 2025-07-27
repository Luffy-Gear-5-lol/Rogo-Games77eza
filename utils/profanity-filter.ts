export enum FilterLevel {
  PG13 = "pg13",
  R = "r",
}

// Words that are filtered in PG-13 but allowed in R
const pg13BannedWords = [
  // Slurs - filtered in PG-13 only
  /\bn(?:i|1|l)gg(?:a|er|@|4|3r|r|ah)s?\b/gi, // Variations of the n-word
  /\bf(?:a|@)gg?(?:o|0)ts?\b/gi, // Homophobic slurs
  /\br(?:e|3)t(?:a|@)rds?\b/gi, // Ableist slurs
  /\btr(?:a|@)nn(?:y|ie)s?\b/gi, // Transphobic slurs
  /\bc(?:u|v)nts?\b/gi, // Extreme misogynistic slurs

  // Regular profanity is now allowed in both PG-13 and R
  // These lines are commented out to show what's now allowed
  // /\bf(?:u|v)cks?\b/gi, // F-word variations
  // /\bsh(?:i|1)ts?\b/gi, // S-word variations
  // /\bd(?:i|1)cks?\b/gi, // D-word variations
  // /\bb(?:i|1)tch(?:es)?\b/gi, // B-word variations
  // /\ba(?:s|5)(?:s|5)(?:hole|wipe)s?\b/gi, // A-hole variations
  // /\bp(?:u|v)ss(?:y|ies)\b/gi, // P-word variations
  // /\bc(?:o|0)cks?\b/gi, // C-word variations
]

export function filterProfanity(text: string, level: FilterLevel = FilterLevel.PG13): string {
  let filteredText = text

  // Only filter slurs in PG-13 mode
  // In R mode, nothing is filtered
  if (level === FilterLevel.PG13) {
    for (const regex of pg13BannedWords) {
      filteredText = filteredText.replace(regex, (match) => "●".repeat(match.length))
    }
  }

  return filteredText
}
