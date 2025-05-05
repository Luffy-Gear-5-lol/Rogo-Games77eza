/**
 * Gets the image path for a game, supporting both PNG and JPEG formats
 * @param imagePath The original image path
 * @returns The processed image path
 */
export function getImagePath(imagePath: string | undefined): string {
  if (!imagePath) {
    return "/placeholder.svg?height=200&width=350"
  }

  // If the path already has an extension, return it as is
  if (imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg") || imagePath.endsWith(".png")) {
    return imagePath
  }

  // Try to add an extension if none exists
  return `${imagePath}.png`
}

/**
 * Checks if an image exists at the given path
 * @param path The image path to check
 * @returns Promise that resolves to true if the image exists, false otherwise
 */
export async function imageExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Gets the first available image from a list of possible formats
 * @param basePath The base path of the image without extension
 * @param formats Array of formats to try (e.g., ['png', 'jpg', 'jpeg'])
 * @returns The first available image path or a placeholder
 */
export async function getFirstAvailableImage(basePath: string, formats = ["png", "jpg", "jpeg"]): Promise<string> {
  for (const format of formats) {
    const path = `${basePath}.${format}`
    if (await imageExists(path)) {
      return path
    }
  }

  return "/placeholder.svg?height=200&width=350"
}
