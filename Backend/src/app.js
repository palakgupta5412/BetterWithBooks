import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",               // Your Local Frontend
    "https://better-with-books.vercel.app", // Your Vercel Frontend
    // Add any other domains here if needed
];

// --- 2. DYNAMIC CORS CONFIG ---
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            // If the origin is NOT in the list, block it
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        
        // If it IS in the list, allow it
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.router.js";
import bookRouter from "./routes/book.router.js";
import quotesRouter from "./routes/quotes.router.js";

app.use("/users" , userRouter);
app.use("/books" , bookRouter);
app.use('/quotes' , quotesRouter);

export {app} ;