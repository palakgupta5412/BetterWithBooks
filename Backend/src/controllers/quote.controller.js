import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Quote } from "../models/quotes.model.js";

// 1. Create Quote
const createQuote = asyncHandler(async(req, res) => {
    // 1. Destructure 'bookName' (what frontend sends), NOT 'bookId'
    const { content, author, bookName, theme } = req.body; 
    const userId = req.user._id;

    // 2. Debugging: Print what arrives (remove later)
    console.log("Creating quote:", req.body); 

    if (!content || !author) {
        throw new ApiError(400, "Content and Author are required");
    }

    const quote = await Quote.create({
        content,
        author,
        user: userId,
        bookName: bookName || "", // Save the string
        theme: theme || "classic-paper"
    });

    return res.status(201).json(
        new ApiResponse(201, quote, "Quote created successfully")
    );
});

// 2. Get My Quotes
const getMyQuotes = asyncHandler(async(req, res) => {
    const quotes = await Quote.find({ user: req.user._id })
        .sort({ createdAt: -1 });
    // REMOVED .populate("book") because bookName is now just a string in this collection

    return res.status(200).json(new ApiResponse(200, quotes, "Fetched successfully"));
});

// 3. Get All Quotes
const getAllQuotes = asyncHandler(async(req, res) => {
    const quotes = await Quote.find()
        .sort({ createdAt: -1 })
        .populate("user", "name pfp"); // Keep user populate, remove book populate

    return res.status(200).json(new ApiResponse(200, quotes, "Fetched successfully"));
});

export { createQuote, getMyQuotes, getAllQuotes };