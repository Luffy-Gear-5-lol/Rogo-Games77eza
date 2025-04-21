import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ImageGuide from "@/components/image-guide"

export default function ImageGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Game Image Guide</h1>
          <p className="mt-2 text-gray-400">How to find and use high-quality images for your game site</p>
        </div>

        <ImageGuide />

        <div className="rounded-lg bg-gray-800 p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Recommended Image Sources</h2>
          <p className="mb-4 text-gray-300">Here are some reliable sources for high-quality game images:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Official game websites</li>
            <li>Steam store pages</li>
            <li>App Store / Google Play listings</li>
            <li>Wikipedia (often has high-quality logos)</li>
            <li>Game press kits (for newer games)</li>
          </ul>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Image Optimization Tips</h2>
          <p className="mb-4 text-gray-300">Follow these tips to ensure your game images load quickly:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Keep file sizes under 100KB when possible</li>
            <li>Use JPG for photos and PNG for logos with transparency</li>
            <li>Maintain consistent aspect ratios (square is ideal)</li>
            <li>Resize images to 300x300 or 400x400 pixels</li>
            <li>Use WebP format for better compression if supported</li>
          </ul>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Example Image Structure</h2>
          <p className="mb-4 text-gray-300">Here's how your image folder structure should look:</p>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
            {`public/
├── images/
│   ├── hero-bg.jpg
│   ├── games/
│   │   ├── tetris.jpg
│   │   ├── pacman.jpg
│   │   ├── minecraft.jpg
│   │   ├── among-us.jpg
│   │   └── ... (other game images)
│   └── icons/
│       └── ... (any icon images)
└── game-frame.html`}
          </pre>
        </div>
      </div>
    </div>
  )
}
