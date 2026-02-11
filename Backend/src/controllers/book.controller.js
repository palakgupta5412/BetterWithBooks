import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { Author } from "../models/author.model.js";

const searchBooks = asyncHandler(async(req, res) => {
    // 1. Get Query + Page Number from Frontend
    const { query, page = 1 } = req.query;

    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    // 2. Calculate Pagination Logic
    // Google API uses 'startIndex'. 
    // If page 1, start at 0. If page 2, start at 40.
    const maxResults = 40; // Max allowed by Google
    const startIndex = (page - 1) * maxResults;

    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}`;

    try {
        const response = await axios.get(googleBooksUrl);
        const data = response.data;

        if (!data.items || data.items.length === 0) {
            // Return empty array instead of 404 so frontend can just show "No more results"
            return res.status(200).json(new ApiResponse(200, [], "No books found"));
        }

        const formattedBooks = data.items.map((book) => {
            const info = book.volumeInfo;
            return {
                googleId: book.id,
                title: info.title,
                authors: info.authors || ["Unknown Author"],
                description: info.description || "No description available",
                // Force HTTPS for images
                coverImage: info.imageLinks?.thumbnail?.replace('http:', 'https:') || "https://placehold.co/128x196?text=No+Cover",
                pageCount: info.pageCount || 0,
                categories: info.categories || [],
                averageRating: info.averageRating || 0
            };
        });

        return res.status(200).json(new ApiResponse(200, formattedBooks, "Books fetched successfully"));

    } catch (error) {
        console.error("Google API Error:", error.message);
        throw new ApiError(500, "Failed to fetch data from Google Books");
    }
});

const addToShelf = asyncHandler(async(req, res) => {
    const { googleBookId, shelf } = req.body; // shelf can be "tbr", "reading", "finished"
    const userId = req.user._id; // Comes from verifyJWT middleware

    // 1. Validate Input
    if (!["tbr", "reading", "finished"].includes(shelf)) {
        throw new ApiError(400, "Invalid shelf type");
    }

    // 2. Check if Book already exists in OUR database
    let book = await Book.findOne({ googleBooksId: googleBookId });

    // 3. IF BOOK DOES NOT EXIST -> We must create it from Google Data
    if (!book) {
        // Fetch full details from Google
        const googleUrl = `https://www.googleapis.com/books/v1/volumes/${googleBookId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`;
        const response = await axios.get(googleUrl);
        const data = response.data.volumeInfo;

        // Handle Authors (Find or Create)
        const authorIds = [];
        const authorNames = data.authors || ["Unknown Author"];

        for (const name of authorNames) {
            let author = await Author.findOne({ name });
            if (!author) {
                author = await Author.create({ name });
            }
            authorIds.push(author._id);
        }

        // Create the Book
        book = await Book.create({
            bookName: data.title,
            authors: authorIds, // Link to the authors we found/created
            googleBooksId: googleBookId,
            coverImage: data.imageLinks?.thumbnail || "",
            description: data.description || "",
            pageCount: data.pageCount || 0,
            genre: data.categories || [],
            averageRating: data.averageRating || 0
        });
    }

    // 2. Define the shelves to REMOVE from
    const shelves = ["tbr", "reading", "finished"];
    const shelvesToRemove = shelves.filter(s => s !== shelf); // If adding to 'reading', remove from 'tbr' and 'finished'

    // 3. Update User: Push to new shelf, Pull from others
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $addToSet: { [shelf]: book._id }, // Add to new shelf
            $pull: { [shelvesToRemove[0]]: book._id, [shelvesToRemove[1]]: book._id } // Remove from others
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, `Moved book to ${shelf}`)
    );
});

const getUserShelf = asyncHandler(async(req, res) => {
    const userId = req.user._id; // Get logged in user's ID

    // 1. Find the user
    // 2. .populate() replaces the IDs in 'tbr', 'reading', 'finished' with actual Book objects
    const user = await User.findById(userId)
        .populate("tbr")
        .populate("reading")
        .populate("finished");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 3. Send the full data back
    return res.status(200).json(
        new ApiResponse(200, 
            {
                tbr: user.tbr,
                reading: user.reading,
                finished: user.finished
            }, 
            "User shelf fetched successfully"
        )
    );
});

// --- 4. UPDATE READING PROGRESS (FIXED) ---
const updateProgress = asyncHandler(async (req, res) => {
    const { googleBookId, pagesRead } = req.body;
    const userId = req.user._id;

    // 1. Validation
    if (!googleBookId) {
        throw new ApiError(400, "Book ID is required");
    }
    // Ensure pagesRead is a number (Frontend might send string "50")
    const newPagesRead = Number(pagesRead);
    if (isNaN(newPagesRead)) {
        throw new ApiError(400, "Pages read must be a number");
    }

    // 2. Find User
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // 3. Find the specific book
    // We convert both to strings to ensure they match even if types differ
    const bookIndex = user.books.findIndex(b => String(b.googleBookId) === String(googleBookId));

    if (bookIndex === -1) {
        throw new ApiError(404, "Book not found in your library");
    }

    // 4. Update the data
    user.books[bookIndex].pagesRead = newPagesRead;
    
    // Auto-complete logic
    if (user.books[bookIndex].totalPages > 0 && newPagesRead >= user.books[bookIndex].totalPages) {
        user.books[bookIndex].status = "finished";
        user.books[bookIndex].pagesRead = user.books[bookIndex].totalPages; // Cap it
        
        // Remove from reading, add to finished (if your app logic requires shelf moving)
        // Since you use a 'status' field, this is usually enough.
    }

    // 5. Save (We disable validation to prevent unrelated schema errors)
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, user.books[bookIndex], "Progress updated successfully")
    );
});


export { searchBooks, addToShelf, getUserShelf , updateProgress};