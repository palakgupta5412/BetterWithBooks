import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --- 1. ALLOWED ORIGINS (CORS) ---
const allowedOrigins = [
    "http://localhost:5173",               // Your Local Frontend
    "https://better-with-books.vercel.app", // Your Vercel Frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// --- 2. IMPORT ROUTES (These were likely missing!) ---
import userRouter from './routes/user.router.js';
import bookRouter from './routes/book.router.js';
import quoteRouter from './routes/quotes.router.js';

// --- 3. DECLARE ROUTES ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/quotes", quoteRouter);

export { app };