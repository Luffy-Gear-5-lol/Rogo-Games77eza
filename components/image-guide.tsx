export default function ImageGuide() {
  return (
    <div className="rounded-lg bg-gray-800 p-6 my-8">
      <h2 className="text-xl font-bold mb-4">How to Add High-Quality Game Images</h2>
      <p className="mb-4">To make your game site look professional, follow these steps to add high-quality images:</p>
      <ol className="list-decimal list-inside space-y-2 text-gray-300">
        <li>
          <strong>Find high-quality images:</strong> Search for "[Game Name] logo" or "[Game Name] cover art" on Google
          Images
        </li>
        <li>
          <strong>Select appropriate images:</strong> Choose square or rectangular images with good resolution (at least
          300x300 pixels)
        </li>
        <li>
          <strong>Save the images:</strong> Create a folder structure like{" "}
          <code className="bg-gray-700 px-2 py-1 rounded">/public/images/games/</code>
        </li>
        <li>
          <strong>Name consistently:</strong> Use the game's slug as the filename (e.g.,{" "}
          <code className="bg-gray-700 px-2 py-1 rounded">tetris.jpg</code>)
        </li>
        <li>
          <strong>Optimize if needed:</strong> Use a tool like TinyPNG to compress images without losing quality
        </li>
      </ol>
      <div className="mt-4 p-4 bg-purple-900/30 rounded-lg">
        <p className="text-sm">
          <strong>Note:</strong> Make sure you have the right to use the images. For a personal/educational site, using
          game cover art typically falls under fair use, but always include attribution to the original game creators.
        </p>
      </div>
    </div>
  )
}
