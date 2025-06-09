export function filterProfanity(text: string): string {
  let filteredText = text
  const profanities = [
    // Variations of "nigga"
    /\b(?:n(?:i|1)gg(?:a|@|er?))\b/gi,
    // Variations of "dick"
    /\b(?:d(?:i|!)ck(?:s)?)\b/gi,
    // Add more words as needed, e.g., /\b(?:f(?:u|u)ck(?:er)?)\b/gi
  ]

  for (const regex of profanities) {
    filteredText = filteredText.replace(regex, (match) => "*".repeat(match.length))
  }
  return filteredText
}
