// Owner secret code - change this to your own secret
const OWNER_SECRET_CODE = "rogo-owner-2026"

// Check if user is the owner (admin) - client-side check
export function isAdmin(): boolean {
  if (typeof window === "undefined") return false
  
  // Check if owner session is active
  const ownerSession = localStorage.getItem("rogoOwnerSession")
  if (ownerSession) {
    try {
      const session = JSON.parse(ownerSession)
      // Session expires after 24 hours
      if (session.expires > Date.now()) {
        return true
      } else {
        localStorage.removeItem("rogoOwnerSession")
      }
    } catch {
      localStorage.removeItem("rogoOwnerSession")
    }
  }
  return false
}

// Verify owner secret code and create session
export function verifyOwnerCode(code: string): boolean {
  if (code === OWNER_SECRET_CODE) {
    if (typeof window !== "undefined") {
      // Create 24-hour session
      const session = {
        isOwner: true,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }
      localStorage.setItem("rogoOwnerSession", JSON.stringify(session))
    }
    return true
  }
  return false
}

// Clear owner session
export function clearOwnerSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("rogoOwnerSession")
  }
}

// Check if owner session exists (for components that need to know)
export function hasOwnerSession(): boolean {
  return isAdmin()
}
