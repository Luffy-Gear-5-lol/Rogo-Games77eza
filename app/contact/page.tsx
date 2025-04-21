"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitContactForm } from "@/actions/contact-actions"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("name", formState.name)
      formData.append("email", formState.email)
      formData.append("subject", formState.subject)
      formData.append("message", formState.message)

      // Submit the form
      const response = await submitContactForm(formData)

      if (response.success) {
        setIsSubmitted(true)
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setError(response.message)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center mb-8 text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
            <p className="text-gray-300">Have questions or feedback? We'd love to hear from you!</p>
          </div>

          {isSubmitted ? (
            <div className="rounded-xl bg-gray-800 p-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-bold">Message Sent!</h2>
              <p className="mb-6 text-gray-300">
                Thank you for reaching out. We'll get back to you as soon as possible.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl bg-gray-800 p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Your Email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                  Subject
                </label>
                <Select value={formState.subject} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="feedback">Game Feedback</SelectItem>
                    <SelectItem value="suggestion">Game Suggestion</SelectItem>
                    <SelectItem value="broken">Report Broken Game</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="min-h-[150px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="Type your message here..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              <div className="mt-3 p-2 bg-gray-700 rounded-md">
                <p className="text-sm text-center">Your message will be sent directly to our Google Sheet</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
