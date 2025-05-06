import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function LanguageCompatibility() {
  const programmingLanguages = [
    { name: "JavaScript", color: "bg-yellow-600" },
    { name: "HTML", color: "bg-orange-600" },
    { name: "Java", color: "bg-red-600" },
    { name: "Python", color: "bg-blue-600" },
    { name: "C++", color: "bg-purple-600" },
    { name: "C#", color: "bg-green-600" },
    { name: "TypeScript", color: "bg-blue-500" },
    { name: "Rust", color: "bg-orange-700" },
    { name: "Ruby", color: "bg-red-500" },
    { name: "Lua", color: "bg-blue-400" },
    { name: "Haxe", color: "bg-orange-500" },
    { name: "C", color: "bg-gray-600" },
    { name: "CSS", color: "bg-pink-600" },
    { name: "PHP", color: "bg-indigo-600" },
    { name: "Go", color: "bg-cyan-600" },
    { name: "Swift", color: "bg-orange-600" },
    { name: "ActionScript", color: "bg-red-700" },
    { name: "Shell", color: "bg-green-700" },
  ]

  return (
    <div className="mt-12 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Multi-Language Support</h2>
      <p className="text-gray-300 mb-6">
        Our platform supports games built with a wide variety of programming languages and technologies, ensuring the
        best gaming experience across all devices and browsers.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {programmingLanguages.map((language) => (
          <Link href={`/languages/${language.name.toLowerCase()}`} key={language.name} className="group">
            <div className={`${language.color} p-4 rounded-lg text-center transition-transform group-hover:scale-105`}>
              <div className="text-white font-bold mb-1">{language.name}</div>
              <div className="text-xs text-white/80">{Math.floor(Math.random() * 50) + 10} Games</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/languages">
          <Badge className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-base">Browse Games By Language</Badge>
        </Link>
      </div>
    </div>
  )
}
