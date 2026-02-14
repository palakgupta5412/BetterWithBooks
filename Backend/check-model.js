import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  console.log("Checking available models...");
  try {
    // Note: The JS SDK doesn't have a simple listModels() function yet, 
    // so we test the most popular one directly.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test connection");
    console.log("✅ SUCCESS! 'gemini-1.5-flash' is working.");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.log("❌ ERROR:");
    console.log(error.message);
  }
}

list();