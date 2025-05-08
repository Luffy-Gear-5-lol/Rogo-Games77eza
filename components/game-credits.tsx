import type { GameCredit, GameSong } from "@/data/game-credits"

interface GameCreditsProps {
  modCredits?: GameCredit[]
  originalCredits?: GameCredit[]
  additionalInfo?: string
  songs?: GameSong[] | Record<string, GameSong[]>
}

export default function GameCredits({ modCredits, originalCredits, additionalInfo, songs }: GameCreditsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Credits</h2>

      {modCredits && modCredits.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Mod Credits:</h3>
          <p className="text-gray-400 text-sm mb-2">
            Make sure to support mod creators on their social media by subscribing, following, liking, etc.
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {modCredits.map((credit, index) => (
              <li key={index}>
                <span className="font-medium">{credit.name}</span>: {credit.role}
              </li>
            ))}
          </ul>
        </div>
      )}

      {originalCredits && originalCredits.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Original FNF Credits:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {originalCredits.map((credit, index) => (
              <li key={index}>
                <span className="font-medium">{credit.name}</span> – {credit.role}
              </li>
            ))}
          </ul>
        </div>
      )}

      {songs && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Songs:</h3>
          {Array.isArray(songs) ? (
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {songs.map((song, index) => (
                <li key={index}>
                  {song.title} {song.week && `(Week ${song.week})`}
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              {Object.entries(songs).map(([week, weekSongs]) => (
                <div key={week}>
                  <h4 className="font-medium text-white">{week}</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                    {weekSongs.map((song, index) => (
                      <li key={index}>{song.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {additionalInfo && <div className="text-gray-400 text-sm mt-4">{additionalInfo}</div>}
    </div>
  )
}
