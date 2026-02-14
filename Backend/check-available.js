import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔍 Checking available models for your API Key...");

async function listModels() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.error("❌ API Error:", data.error.message);
        return;
    }

    console.log("\n✅ SUCCESS! Here are the models you can use:");
    console.log("------------------------------------------------");
    
    // Filter only models that support 'generateContent' (chat/text generation)
    const chatModels = data.models.filter(m => 
        m.supportedGenerationMethods.includes("generateContent")
    );

    if (chatModels.length === 0) {
        console.log("⚠️ No chat models found. This is rare.");
    }

    chatModels.forEach(m => {
        // We only care about the "name" part, e.g., "models/gemini-pro"
        console.log(`Model Name: ${m.name.replace("models/", "")}`);
    });
    console.log("------------------------------------------------");

  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
}

listModels();