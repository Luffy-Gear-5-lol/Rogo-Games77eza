"use client"

import { useCallback } from "react"
import useSWR from "swr"

interface ReadProgress {
  mangaId: number
  lastReadChapter: number
  readChapters: number[]
  lastReadAt: string | null
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  return data.data
}

export function useReadProgress(mangaId: number, userId = "anonymous") {
  const { data, mutate, error, isLoading } = useSWR<ReadProgress>(
    `/api/manga/read-progress?mangaId=${mangaId}&userId=${userId}`,
    fetcher,
    { revalidateOnFocus: false },
  )

  const markChapterAsRead = useCallback(
    async (chapterNumber: number) => {
      try {
        const response = await fetch("/api/manga/read-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mangaId,
            chapterNumber,
            userId,
          }),
        })

        if (!response.ok) throw new Error("Failed to mark chapter as read")

        const result = await response.json()
        mutate(result.data, false)
        return result.data
      } catch (error) {
        console.error("[v0] Error marking chapter as read:", error)
        throw error
      }
    },
    [mangaId, userId, mutate],
  )

  const clearProgress = useCallback(async () => {
    try {
      const response = await fetch(`/api/manga/read-progress?mangaId=${mangaId}&userId=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to clear progress")

      const emptyProgress: ReadProgress = {
        mangaId,
        lastReadChapter: 0,
        readChapters: [],
        lastReadAt: null,
      }

      mutate(emptyProgress, false)
      return emptyProgress
    } catch (error) {
      console.error("[v0] Error clearing progress:", error)
      throw error
    }
  }, [mangaId, userId, mutate])

  const isChapterRead = useCallback(
    (chapterNumber: number) => {
      return data?.readChapters.includes(chapterNumber) ?? false
    },
    [data],
  )

  return {
    progress: data,
    markChapterAsRead,
    clearProgress,
    isChapterRead,
    isLoading,
    error,
  }
}
