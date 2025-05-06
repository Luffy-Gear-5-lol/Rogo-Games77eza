interface GameLanguagesProps {
  languages?: string[]
}

export default function GameLanguages({ languages }: GameLanguagesProps) {
  if (!languages || languages.length === 0) return null

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-400 mb-2">Built with:</h4>
      <div className="flex flex-wrap gap-1.5">
        {languages.map((lang) => (
          <span
            key={lang}
            className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-300"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  )
}
