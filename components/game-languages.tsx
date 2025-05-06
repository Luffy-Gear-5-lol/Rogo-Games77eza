import LanguageBadge from "./language-badge"

interface GameLanguagesProps {
  languages?: string[]
}

export default function GameLanguages({ languages }: GameLanguagesProps) {
  if (!languages || languages.length === 0) return null

  return (
    <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h4 className="text-lg font-medium mb-3">Built with:</h4>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <LanguageBadge key={lang} language={lang} size="md" />
        ))}
      </div>

      {languages.length > 1 && (
        <p className="mt-3 text-sm text-gray-400">
          This game uses multiple programming languages to provide the best gaming experience across different
          platforms.
        </p>
      )}
    </div>
  )
}
