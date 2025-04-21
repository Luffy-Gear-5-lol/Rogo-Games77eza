"use server"

import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    const timestamp = new Date().toISOString()

    // Log the submission for debugging
    console.log("Contact form submission:", { name, email, subject, message, timestamp })

    // Create a JWT client using service account credentials
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // Initialize the Google Spreadsheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth)
    await doc.loadInfo()

    // Get the first sheet
    const sheet = doc.sheetsByIndex[0]

    // Add a row to the sheet
    await sheet.addRow({
      Name: name,
      Email: email,
      Subject: subject || "General Inquiry",
      Message: message,
      Timestamp: timestamp,
    })

    return {
      success: true,
      message: "Your message has been sent successfully!",
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again later.",
    }
  }
}
