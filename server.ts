import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";
import dotenv from "dotenv";
import { generatePost, type PostInput } from "./lib/generator.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function gemini(prompt: string): Promise<string> {
  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text || "";
}

// API Routes
app.post("/api/generate-post", async (req, res) => {
  try {
    const input = req.body as PostInput;
    const { post } = await generatePost(input, gemini);
    if (!post) {
      return res.json({ post: "Failed to generate post." });
    }
    res.json({ post });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate post. Please try again." });
  }
});

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

app.post("/api/submit-post", async (req, res) => {
  const { fullName, email, company, title, postUrl } = req.body;
  const timestamp = new Date().toISOString();

  console.log("Form Submission Received:", req.body);

  try {
    await appendToSheet([timestamp, fullName, email, company, title, postUrl]);
  } catch (err) {
    console.error("Google Sheets write failed:", err);
  }

  res.json({ success: true, message: "Post submitted successfully! We'll review it within 2 business days." });
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
