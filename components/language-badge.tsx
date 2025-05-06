interface LanguageBadgeProps {
  language: string
  size?: "sm" | "md" | "lg"
}

export default function LanguageBadge({ language, size = "sm" }: LanguageBadgeProps) {
  // Map languages to colors
  const colorMap: Record<string, string> = {
    JavaScript: "bg-yellow-600",
    HTML: "bg-orange-600",
    Java: "bg-red-600",
    Python: "bg-blue-600",
    "C++": "bg-purple-600",
    "C#": "bg-green-600",
    TypeScript: "bg-blue-500",
    Rust: "bg-orange-700",
    Ruby: "bg-red-500",
    Lua: "bg-blue-400",
    Haxe: "bg-orange-500",
    C: "bg-gray-600",
    CSS: "bg-pink-600",
    PHP: "bg-indigo-600",
    Go: "bg-cyan-600",
    Swift: "bg-orange-600",
    ActionScript: "bg-red-700",
    Shell: "bg-green-700",
    default: "bg-gray-600",
  }

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  }

  const bgColor = colorMap[language] || colorMap.default

  return (
    <span className={`${bgColor} ${sizeClasses[size]} rounded-md text-white font-medium inline-block`}>{language}</span>
  )
}
