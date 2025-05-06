export default function LanguageCompatibility() {
  const codingLanguages = [
    "Java",
    "JavaScript",
    "HTML",
    "Shell",
    "Rust",
    "Ruby",
    "Lua",
    "Haxe",
    "C",
    "C++",
    "C#",
    "Python",
    "TypeScript",
    "CSS",
    "PHP",
    "Go",
    "Swift",
    "ActionScript",
  ]

  return (
    <div className="mt-12 bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Language Compatibility</h2>
      <p className="text-gray-300 mb-4">
        Our games are built with a wide variety of programming languages and technologies to ensure the best performance
        and compatibility across platforms.
      </p>
      <div className="flex flex-wrap gap-2">
        {codingLanguages.map((language) => (
          <div key={language} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
            {language}
          </div>
        ))}
      </div>
    </div>
  )
}
