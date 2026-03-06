import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Sparkles, Gamepad2, Palette, Zap, Star, Music, Clock } from "lucide-react"

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <Link href="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-pink-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">What's New</h1>
          </div>
          <p className="text-muted-foreground">Stay up to date with the latest features and improvements</p>
        </div>

        <div className="space-y-6">
          {/* March 2026 Updates - Latest */}
          <Card className="bg-gradient-to-r from-primary/20 to-pink-500/20 border-primary/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">March 2026 Updates</CardTitle>
                </div>
                <Badge className="bg-gradient-to-r from-primary to-pink-500 text-white border-0">Latest</Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                Major UI overhaul and new features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">New Visual Design</h3>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Completely redesigned interface with vibrant colors</li>
                  <li>Better dark and light mode with distinct themes</li>
                  <li>Brighter, more readable game titles and text</li>
                  <li>New "Play Now" button appears when you hover over games</li>
                  <li>Purple accent color throughout the site</li>
                </ul>
              </div>
              <Separator className="bg-border/50" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="h-4 w-4 text-green-500" />
                  <h3 className="text-lg font-semibold text-foreground">Game Improvements</h3>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Recently played games now show for 2 weeks then reset</li>
                  <li>Popular games page shows top 15 most played games</li>
                  <li>Featured games now rotate daily</li>
                  <li>View counter shows on every game card</li>
                  <li>Like/dislike buttons work properly now</li>
                </ul>
              </div>
              <Separator className="bg-border/50" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-foreground">New Features</h3>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Daily polls with YouTube-style percentage results</li>
                  <li>Category cards on homepage for quick navigation</li>
                  <li>Owner/admin features for site management</li>
                  <li>Apps section with future YouTube, X, SoundCloud placeholders</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-foreground">Coming Soon</CardTitle>
                </div>
                <Badge className="bg-orange-500 text-white border-0">Upcoming</Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                Features we're working on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Music className="h-4 w-4 text-green-500" />
                  <h3 className="text-lg font-semibold text-foreground">Music Section</h3>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Juice WRLD - All released songs</li>
                  <li>NBA YoungBoy - Full discography</li>
                  <li>Tyler the Creator - Complete collection</li>
                  <li>Works even on school networks</li>
                </ul>
              </div>
              <Separator className="bg-border/50" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="h-4 w-4 text-blue-500" />
                  <h3 className="text-lg font-semibold text-foreground">More Apps</h3>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>YouTube - Watch videos anywhere</li>
                  <li>X (Twitter) - Stay connected</li>
                  <li>SoundCloud - Stream music</li>
                  <li>Video player for unrestricted content</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Previous Updates - Collapsed view */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-foreground">Previous Updates</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Earlier changes and improvements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-2">2025 Highlights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Poll system launch</li>
                    <li>Game rating feature</li>
                    <li>Recently played tracking</li>
                    <li>Category pages</li>
                    <li>Chat functionality</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-2">Original Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Game library with 200+ games</li>
                    <li>Search functionality</li>
                    <li>Mobile-responsive design</li>
                    <li>Dark mode support</li>
                    <li>Featured games section</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
