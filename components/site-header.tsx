import { games } from "@/data/games"

export default function SiteHeader() {
  return (
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-gray-800">
            My Awesome Site
          </a>

          {/* Add this in the header, perhaps next to the logo */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">{games.length}</span>
            <span>Games</span>
          </div>

          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-800">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-800">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-gray-800">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
