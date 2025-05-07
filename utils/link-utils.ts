/**
 * Opens a URL in an about:blank page
 * This creates a clean browsing environment for external content
 */
export function openInAboutBlank(url: string): void {
  const newWindow = window.open("about:blank", "_blank")
  if (newWindow) {
    newWindow.document.write(`<script>window.location.href="${url}"</script>`)
    newWindow.document.close()
  }
}
