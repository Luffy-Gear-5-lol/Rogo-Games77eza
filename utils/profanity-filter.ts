export enum FilterLevel {
  PG13 = "pg13",
  R = "r",
}

// Words that are filtered in PG-13 but allowed in R
const pg13BannedWords = [
  // N-word variations - comprehensive patterns
  /\bn(?:i|1|l|!|\|)(?:g|6)(?:g|6)(?:a|@|4)(?:h|r|s)?\b/gi,
  /\bn(?:i|1|l|!|\|)(?:g|6)(?:g|6)(?:e|3)(?:r|s)?\b/gi,
  /\bn(?:i|1|l|!|\|)(?:g|6)(?:g|6)(?:u|v)(?:h|r|s)?\b/gi,
  /\bn(?:i|1|l|!|\|)(?:g|6){2,}(?:a|@|4|e|3|u|v)(?:h|r|s)?\b/gi,
  /\bn(?:i|1|l|!|\|)(?:q|9)(?:q|9)(?:a|@|4|e|3|u|v)(?:h|r|s)?\b/gi,
  /\bn(?:i|1|l|!|\|)(?:b|8)(?:b|8)(?:a|@|4|e|3|u|v)(?:h|r|s)?\b/gi,

  // Homophobic slurs - comprehensive patterns
  /\bf(?:a|@|4)(?:g|6)(?:g|6)(?:o|0)(?:t|7)s?\b/gi,
  /\bf(?:a|@|4)(?:g|6)(?:g|6)(?:i|1|l|!)(?:t|7)s?\b/gi,
  /\bf(?:a|@|4)(?:q|9)(?:q|9)(?:o|0)(?:t|7)s?\b/gi,
  /\bf(?:a|@|4)(?:b|8)(?:b|8)(?:o|0)(?:t|7)s?\b/gi,
  /\bf(?:4|@|a)(?:6|g){1,2}(?:0|o)(?:7|t)s?\b/gi,

  // Ableist slurs - comprehensive patterns
  /\br(?:e|3)(?:t|7)(?:a|@|4)(?:r|2)(?:d|6)s?\b/gi,
  /\br(?:e|3)(?:t|7)(?:4|@|a)(?:2|r)(?:6|d)s?\b/gi,
  /\br(?:3|e)(?:7|t)(?:@|4|a)(?:2|r)(?:6|d)(?:3|e)(?:6|d)s?\b/gi,
  /\bm(?:o|0)(?:r|2)(?:o|0)(?:n|m)s?\b/gi,
  /\b(?:s|5)(?:p|9)(?:a|@|4)(?:s|5)(?:t|7)(?:i|1|l|!)(?:c|k)s?\b/gi,

  // Transphobic slurs - comprehensive patterns
  /\bt(?:r|2)(?:a|@|4)(?:n|m)(?:n|m)(?:y|ie)s?\b/gi,
  /\bt(?:r|2)(?:@|4|a)(?:m|n){1,2}(?:y|ie)s?\b/gi,
  /\bt(?:2|r)(?:4|@|a)(?:m|n)(?:m|n)(?:i|1|l|!)(?:e|3)s?\b/gi,
  /\bs(?:h|#)(?:e|3)(?:m|n)(?:a|@|4)(?:l|1)(?:e|3)s?\b/gi,

  // Extreme misogynistic slurs - comprehensive patterns
  /\bc(?:u|v)(?:n|m)(?:t|7)s?\b/gi,
  /\bc(?:v|u)(?:m|n)(?:7|t)s?\b/gi,
  /\bc(?:u|v)(?:n|m)(?:t|7)(?:s|5)?\b/gi,
  /\b(?:c|k)(?:u|v)(?:n|m)(?:t|7)(?:s|5)?\b/gi,

  // Racial slurs - comprehensive patterns
  /\bc(?:h|#)(?:i|1|l|!)(?:n|m)(?:k|c)s?\b/gi,
  /\bc(?:#|h)(?:1|i|l|!)(?:m|n)(?:c|k)s?\b/gi,
  /\bs(?:p|9)(?:i|1|l|!)(?:c|k)s?\b/gi,
  /\bw(?:e|3)(?:t|7)(?:b|8)(?:a|@|4)(?:c|k)(?:k|c)s?\b/gi,
  /\bg(?:o|0)(?:o|0)(?:k|c)s?\b/gi,
  /\bt(?:o|0)(?:w|vv)(?:e|3)(?:l|1)(?:h|#)(?:e|3)(?:a|@|4)(?:d|6)s?\b/gi,

  // Additional comprehensive patterns with special characters
  /\bn[*\-_.\s]*(?:i|1|l|!)[*\-_.\s]*(?:g|6)[*\-_.\s]*(?:g|6)[*\-_.\s]*(?:a|@|4|e|3|u|v)[*\-_.\s]*(?:h|r|s)?\b/gi,
  /\bf[*\-_.\s]*(?:a|@|4)[*\-_.\s]*(?:g|6)[*\-_.\s]*(?:g|6)[*\-_.\s]*(?:o|0)[*\-_.\s]*(?:t|7)[*\-_.\s]*s?\b/gi,
  /\br[*\-_.\s]*(?:e|3)[*\-_.\s]*(?:t|7)[*\-_.\s]*(?:a|@|4)[*\-_.\s]*(?:r|2)[*\-_.\s]*(?:d|6)[*\-_.\s]*s?\b/gi,
  /\bt[*\-_.\s]*(?:r|2)[*\-_.\s]*(?:a|@|4)[*\-_.\s]*(?:n|m)[*\-_.\s]*(?:n|m)[*\-_.\s]*(?:y|ie)[*\-_.\s]*s?\b/gi,
  /\bc[*\-_.\s]*(?:u|v)[*\-_.\s]*(?:n|m)[*\-_.\s]*(?:t|7)[*\-_.\s]*s?\b/gi,
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
