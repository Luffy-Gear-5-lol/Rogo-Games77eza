"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OpenInNewTabProps {
  url: string
  className?: string
}

export default function OpenInNewTab({ url, className }: OpenInNewTabProps) {
  const handleClick = () => {
    // Open about:blank in a new tab
    const newTab = window.open("about:blank", "_blank")

    if (newTab) {
      // Write HTML to the new tab that will redirect to the game URL
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Loading Game...</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                height: 100vh;
                width: 100vw;
              }
              iframe {
                border: none;
                height: 100%;
                width: 100%;
              }
            </style>
          </head>
          <body>
            <iframe src="${url}" allowfullscreen></iframe>
          </body>
        </html>
      `)
      newTab.document.close()
    }
  }

  return (
    <Button onClick={handleClick} className={className} variant="outline">
      <ExternalLink className="mr-2" size={16} />
      Open in New Tab
    </Button>
  )
}
