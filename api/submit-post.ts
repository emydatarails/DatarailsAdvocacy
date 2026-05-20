import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

async function appendToSheet(row: string[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fullName, email, company, title, postUrl } = req.body;
  const timestamp = new Date().toISOString();

  try {
    await appendToSheet([timestamp, fullName, email, company, title, postUrl]);
  } catch (err) {
    console.error("Google Sheets write failed:", err);
  }

  res.json({ success: true, message: "Post submitted successfully! We'll review it within 2 business days." });
}
