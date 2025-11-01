"use client"

import { useReadProgress } from "@/hooks/use-read-progress"
import { CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ChapterProgressIndicatorProps {
  mangaId: number
  totalChapters: number
  userId?: string
}

export function ChapterProgressIndicator({
  mangaId,
  totalChapters,
  userId = "anonymous",
}: ChapterProgressIndicatorProps) {
  const { progress, markChapterAsRead, isLoading, isChapterRead } = useReadProgress(mangaId, userId)

  if (isLoading) return null

  const readCount = progress?.readChapters.length ?? 0
  const progressPercentage = (readCount / totalChapters) * 100

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Reading Progress</span>
          <span className="text-sm font-normal text-muted-foreground">
            {readCount} / {totalChapters}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground text-right">{Math.round(progressPercentage)}% complete</p>
        </div>

        {progress?.lastReadAt && (
          <p className="text-xs text-muted-foreground">
            Last read: {new Date(progress.lastReadAt).toLocaleDateString()}
          </p>
        )}

        <div className="space-y-2">
          <div className="text-sm font-semibold">Quick Mark as Read</div>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
            {Array.from({ length: Math.min(totalChapters, 48) }).map((_, i) => {
              const chapterNum = i + 1
              const isRead = isChapterRead(chapterNum)
              return (
                <Button
                  key={chapterNum}
                  size="sm"
                  variant="ghost"
                  className={`p-0 h-8 w-8 ${
                    isRead
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                  onClick={() => markChapterAsRead(chapterNum)}
                  title={`Chapter ${chapterNum}`}
                >
                  {isRead ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </Button>
              )
            })}
          </div>
          {totalChapters > 48 && <p className="text-xs text-muted-foreground mt-2">Showing first 48 chapters</p>}
        </div>
      </CardContent>
    </Card>
  )
}
