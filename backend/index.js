const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config(); // To support .env usage

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // ✅ Use .env or directly input
});

// ✨ Route for Document Generation
app.post("/api/generate", async (req, res) => {
  const { docType, ...fields } = req.body;

  const prompt = `Generate a legal ${docType} document using the following info: ${JSON.stringify(
    fields
  )}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const generatedText = completion.choices[0].message.content;
    res.json({ generatedText });
  } catch (err) {
    console.error("Error generating:", err.message);
    res.status(500).json({ error: "Failed to generate document" });
  }
});

// 🧠 Route for General Chatbot
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ reply: "Prompt is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res
      .status(500)
      .json({ reply: "I'm sorry, I couldn't retrieve an answer. Please try again later." });
  }
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`AI backend running on http://localhost:${port}`);
});
