import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "Only give water related question answers",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post("/aquabot", async (req, res) => {
  try {
    const message = req.body.message;
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text:
                "You are AquaBot, a friendly and knowledgeable assistant on water conservation...",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(3000, () => console.log("✅ AquaBot backend running at http://localhost:3000"));
