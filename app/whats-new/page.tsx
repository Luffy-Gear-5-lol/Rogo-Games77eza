import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function WhatsNewPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold mb-6">What's New</h1>
      <p className="text-lg mb-8">Stay up to date with all the latest changes and improvements to Rogo Games.</p>

      <div className="space-y-8">
        {/* May 2025 Updates - Latest */}
        <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>May 2025 Updates</CardTitle>
              <Badge className="bg-pink-600 hover:bg-pink-700">Latest</Badge>
            </div>
            <CardDescription className="text-gray-300">Major site improvements and bug fixes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Bug Fixes & Improvements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fixed poll functionality - now works properly for all users</li>
                <li>Fixed game views counter - now starts at 0 and increments by 1 for each visit</li>
                <li>Fixed likes/dislikes system - now toggles on/off when clicked</li>
                <li>Made view counts visible to all users, not just admins</li>
                <li>Simplified the UI by removing the "Browse by Category" section</li>
                <li>Removed Categories link from the main navigation for a cleaner interface</li>
                <li>Added new admin access for improved site management</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">User Experience Improvements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Improved game rating system with better toggle functionality</li>
                <li>Enhanced manga reading experience with consistent button styling</li>
                <li>Added "Recently Played" section on homepage showing your last 5 played games</li>
                <li>Implemented game rating system with thumbs up/down functionality</li>
                <li>Created dedicated category pages for Mario, Sonic, and Friday Night Funkin' games</li>
                <li>Added a Proxy page for anonymous web browsing</li>
                <li>Improved search functionality with better results and filtering</li>
                <li>Added "Open in New Tab" feature that hides the game URL</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">Content Updates</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fixed metadata for games with IDs 154-230</li>
                <li>Added more detailed descriptions and controls for all games</li>
                <li>Removed Coming Soon page and integrated features directly</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* April 2025 Updates */}
        <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 border-gray-700">
          <CardHeader>
            <CardTitle>April 2025 Updates</CardTitle>
            <CardDescription className="text-gray-300">Major improvements to game clarity and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Privacy Enhancements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Enhanced privacy by hiding email recipients in all contact forms</li>
                <li>Updated contact form to maintain user privacy</li>
                <li>Improved game complaint system with better privacy controls</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">Game Catalog Improvements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Removed generic Pokémon entry and improved specific Pokémon game titles</li>
                <li>Enhanced Pokémon game descriptions to clearly indicate which version players are accessing</li>
                <li>Renamed "Pokémon Fusion" to "Pokémon Fusion Generator" for clarity</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">New Pages</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Added this "What's New" page to keep users informed of site changes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* March 2025 Updates */}
        <Card className="bg-gradient-to-r from-cyan-900 to-blue-900 border-gray-700">
          <CardHeader>
            <CardTitle>March 2025 Updates</CardTitle>
            <CardDescription className="text-gray-300">
              Game loading improvements and poll system enhancements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Game Experience Improvements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Added play button requirement before loading games to improve performance</li>
                <li>Games now require a click to load, reducing unnecessary resource usage</li>
                <li>Improved game loading experience with clearer loading indicators</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">Poll System Updates</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>New polls now start with zero votes for more accurate results</li>
                <li>Added detailed console logging for form submissions</li>
                <li>Implemented simulated email sending with logs for development</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">Bug Fixes</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fixed "Report Issue" button functionality near game fullscreen</li>
                <li>Improved contact form with clearer submission feedback</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* February 2025 Updates */}
        <Card className="bg-gradient-to-r from-teal-900 to-cyan-900 border-gray-700">
          <CardHeader>
            <CardTitle>February 2025 Updates</CardTitle>
            <CardDescription className="text-gray-300">Poll scheduling and UI improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Poll System Enhancements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Implemented scheduled poll rotation (ends Mondays at 6:30 AM, new polls at 7:00 AM)</li>
                <li>Added poll end time display to inform users when current poll closes</li>
                <li>Improved poll question rotation to avoid repeats</li>
                <li>Updated admin polls page to display poll schedule information</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">Admin Dashboard Improvements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Enhanced admin dashboard with better poll management tools</li>
                <li>Added poll scheduling visualization</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* January 2025 Updates */}
        <Card className="bg-gradient-to-r from-green-900 to-teal-900 border-gray-700">
          <CardHeader>
            <CardTitle>January 2025 Updates</CardTitle>
            <CardDescription className="text-gray-300">Major feature additions and UI improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">New Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Implemented game complaint system for reporting broken games</li>
                <li>Added functionality to temporarily disable reported games</li>
                <li>Created persistent poll system that maintains votes across page reloads</li>
                <li>Improved contact form with better validation and feedback</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">UI Improvements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Removed "Open in New Tab" button for cleaner game interface</li>
                <li>Updated game URLs to ensure correct linking</li>
                <li>Improved mobile responsiveness across the site</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">Game Catalog</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Added new games across multiple categories</li>
                <li>Improved game thumbnails and descriptions</li>
                <li>Enhanced game categorization system</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Site Launch */}
        <Card className="bg-gradient-to-r from-yellow-900 to-green-900 border-gray-700">
          <CardHeader>
            <CardTitle>Site Launch</CardTitle>
            <CardDescription className="text-gray-300">Welcome to Rogo Games!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Initial Features</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Game library with popular titles across multiple categories</li>
                <li>Category filtering and search functionality</li>
                <li>Featured games section on homepage</li>
                <li>Mobile-responsive design</li>
                <li>Dark mode support</li>
                <li>Game series pages for related games</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
