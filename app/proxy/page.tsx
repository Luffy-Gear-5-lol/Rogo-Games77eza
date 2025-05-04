"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProxyPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL")
      return
    }

    // Make sure URL has protocol
    let processedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = "https://" + url
    }

    setLoading(true)

    try {
      // Open in about:blank to hide the URL
      const newWindow = window.open("about:blank", "_blank")
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Web Proxy</title>
            <style>
              body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${processedUrl}" allowfullscreen></iframe>
          </body>
          </html>
        `)
        newWindow.document.close()
      } else {
        setError("Popup blocked. Please allow popups for this site.")
      }
    } catch (err) {
      setError("Failed to open proxy. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Web Proxy</CardTitle>
              <CardDescription className="text-gray-400">Browse websites anonymously through our proxy</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium">
                    Enter Website URL
                  </label>
                  <Input
                    id="url"
                    placeholder="example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Open in Proxy"}
                </Button>
              </form>

              <div className="mt-6 text-sm text-gray-400">
                <p className="font-medium mb-2">Popular Proxies:</p>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-purple-400"
                      onClick={() => {
                        setUrl("https://rammerhead.org")
                        handleSubmit(new Event("submit") as any)
                      }}
                    >
                      Rammerhead
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-purple-400"
                      onClick={() => {
                        setUrl("https://holy-unblocker.com")
                        handleSubmit(new Event("submit") as any)
                      }}
                    >
                      Holy Unblocker
                    </Button>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
