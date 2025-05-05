export function GameLoading() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
      <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      <p className="text-lg font-medium">Loading Game...</p>
      <p className="mt-2 text-center text-sm text-gray-400 max-w-sm">
        This may take a moment depending on your internet connection speed.
      </p>
    </div>
  )
}
