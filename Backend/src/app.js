import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // <--- HARDCODE THIS (No trailing slash!)
    credentials: true
}));

app.use(express.json({limit: "16kb"})); // Accept JSON data
app.use(express.urlencoded({extended: true, limit: "16kb"})); // Accept URL data
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.router.js";
import bookRouter from "./routes/book.router.js";
import quotesRouter from "./routes/quotes.router.js";

app.use("/users" , userRouter);
app.use("/books" , bookRouter);
app.use('/quotes' , quotesRouter);

export {app} ;