// Simple admin check - in a real app, this would use authentication
export function isAdmin(): boolean {
  // For now, we're returning true for the specific email
  // In a real app, this would check user authentication and roles

  // The current admin email
  const adminEmail = "chandler.strickland-sutherlin@fwcsstudents.org"

  // In a real app, you would get the current user's email from authentication
  // For now, we'll just return true since we're simulating the admin user
  return true
}
