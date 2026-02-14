import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import { app } from "./app.js";

// Load Environment Variables
dotenv.config({ 
    path: path.resolve(process.cwd(), "./.env") 
});

// --- CORRECT DEBUG LOGS ---
console.log("DEBUG ENV CHECK:");
console.log("- PORT:", process.env.PORT || "MISSING ❌");
// Fix: Check 'MONGODB_URI', not 'MONGO'
console.log("- MONGO:", process.env.MONGODB_URI ? "LOADED ✅" : "MISSING ❌"); 
console.log("- GEMINI:", process.env.GEMINI_API_KEY ? "LOADED ✅" : "MISSING ❌");

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})