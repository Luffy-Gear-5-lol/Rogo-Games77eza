import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AppsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold mb-6">Apps</h1>
      <p className="text-lg mb-8">Useful applications and tools you can use right in your browser.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
            <CardDescription className="text-gray-400">Basic and scientific calculator</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Perform basic arithmetic and complex scientific calculations right in your browser.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Open Calculator</Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Notepad</CardTitle>
            <CardDescription className="text-gray-400">Simple text editor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Take notes, write down ideas, or create simple text documents with this online notepad.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Open Notepad</Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Clock</CardTitle>
            <CardDescription className="text-gray-400">World clock and timer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check the time in different time zones, set timers, and use the stopwatch feature.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Open Clock</Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Drawing Tool</CardTitle>
            <CardDescription className="text-gray-400">Simple drawing application</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create simple drawings and sketches with this easy-to-use drawing tool.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Open Drawing Tool</Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Weather</CardTitle>
            <CardDescription className="text-gray-400">Current weather and forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check the current weather conditions and forecast for your location.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Open Weather App</Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription className="text-gray-400">Simple calendar application</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View calendar, add events, and set reminders with this simple calendar app.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Open Calendar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
