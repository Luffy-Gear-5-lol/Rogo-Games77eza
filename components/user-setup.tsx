"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type User, generateUserId, generateAvatar, saveUser } from "@/utils/user-utils"

interface UserSetupProps {
  onUserCreated: (user: User) => void
}

export default function UserSetup({ onUserCreated }: UserSetupProps) {
  const [username, setUsername] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && username.length >= 3) {
      setIsCreating(true)
      const newUser: User = {
        id: generateUserId(),
        username: username.trim(),
        avatar: generateAvatar(),
        joinedAt: new Date().toISOString(),
      }
      saveUser(newUser)
      onUserCreated(newUser)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Rogo Chat</CardTitle>
          <p className="text-gray-400">Create your username to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 border-gray-600 focus:ring-purple-500"
                minLength={3}
                maxLength={20}
                required
              />
              <p className="text-xs text-gray-400 mt-1">Must be 3-20 characters long</p>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isCreating || username.length < 3}
            >
              {isCreating ? "Creating..." : "Join Chat"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
