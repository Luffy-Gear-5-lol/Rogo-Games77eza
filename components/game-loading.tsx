export function GameLoading() {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mb-4"></div>
      <div className="text-white text-xl font-bold">Loading Game...</div>
      <div className="text-gray-400 mt-2">This may take a few moments</div>
      <div className="mt-8 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-progress"></div>
      </div>
    </div>
  )
}
