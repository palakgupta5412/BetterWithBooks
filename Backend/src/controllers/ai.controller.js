import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getRecommendations = asyncHandler(async (req, res) => {
    const { favoriteBooks } = req.body;

    if (!favoriteBooks || favoriteBooks.length === 0) {
        throw new ApiError(400, "Please provide at least one book name.");
    }

    try {
        // Initialize Gemini with the API Key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // --- FIX: USE 'gemini-1.5-flash' ---
        // This is the current supported model for v1beta
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            I like these books: ${favoriteBooks.join(", ")}.
            Recommend 4 other books I might like. 
            For each book, provide:
            1. Title
            2. Author
            3. A short, one-sentence reason why (based on the books I liked).
            
            IMPORTANT: Return the result ONLY as a raw JSON array. Do not wrap it in markdown ticks or use the word json. 
            Example format:
            [
                { "title": "Book Name", "author": "Author Name", "reason": "Because you like X..." }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("AI Raw Response:", text); // Debug log to see what AI sent

        // Cleanup: AI sometimes adds \`\`\`json at the start. We remove it.
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const recommendations = JSON.parse(cleanedText);

        return res.status(200).json(
            new ApiResponse(200, recommendations, "AI Recommendations fetched successfully")
        );

    } catch (error) {
        console.error("AI Error:", error);
        throw new ApiError(500, "Failed to generate recommendations. The AI is tired.");
    }
});

export { getRecommendations };