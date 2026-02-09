import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Quote } from "../models/quotes.model.js";

// 1. Create Quote
const createQuote = asyncHandler(async(req, res) => {
    const { content, author, bookId, theme } = req.body; // theme is a string like "midnight-ink"
    const userId = req.user._id;

    if (!content || !author) {
        throw new ApiError(400, "Content and Author are required");
    }

    const quote = await Quote.create({
        content,
        author,
        user: userId,
        book: bookId || null,
        theme: theme || "classic-paper" // Save the theme ID
    });

    return res.status(201).json(
        new ApiResponse(201, quote, "Quote created successfully")
    );
});

// 2. Get My Quotes
const getMyQuotes = asyncHandler(async(req, res) => {
    const quotes = await Quote.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("book", "bookName coverImage");

    return res.status(200).json(
        new ApiResponse(200, quotes, "Your quotes fetched successfully")
    );
});

// 3. Get All Quotes
const getAllQuotes = asyncHandler(async(req, res) => {
    const quotes = await Quote.find()
        .sort({ createdAt: -1 })
        .populate("user", "name pfp")
        .populate("book", "bookName coverImage");

    return res.status(200).json(
        new ApiResponse(200, quotes, "Community quotes fetched successfully")
    );
});

export { createQuote, getMyQuotes, getAllQuotes };