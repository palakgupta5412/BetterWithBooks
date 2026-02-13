import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import axios from "axios";

// --- 1. SEARCH BOOKS ---
const searchBooks = asyncHandler(async(req, res) => {
    const { query, page = 1 } = req.query;

    if (!query) throw new ApiError(400, "Search query is required");

    const maxResults = 40; 
    const startIndex = (page - 1) * maxResults;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}&maxResults=${maxResults}&startIndex=${startIndex}`;

    try {
        const response = await axios.get(googleBooksUrl);
        const data = response.data;

        if (!data.items || data.items.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "No books found"));
        }

        const formattedBooks = data.items.map((book) => {
            const info = book.volumeInfo;
            return {
                googleId: book.id,
                title: info.title,
                authors: info.authors || ["Unknown Author"],
                description: info.description || "No description available",
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

// --- 2. ADD TO SHELF (Corrected) ---
const addToShelf = asyncHandler(async(req, res) => {
    const { googleBookId, shelf, bookName, author, coverImage, totalPages } = req.body;
    const userId = req.user._id;

    if (!["tbr", "reading", "finished"].includes(shelf) || !googleBookId) {
        throw new ApiError(400, "Invalid shelf type or book ID required");
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const targetShelf = shelf; 

    // Create the new book object
    const newBook = {
        googleBookId, // Consistent naming
        bookName,
        author,
        coverImage,
        totalPages: totalPages || 0,
        pagesRead: 0,
        addedAt: new Date()
    };

    // 1. Remove from ALL shelves (prevent duplicates)
    user.tbr = user.tbr.filter(b => b.googleBookId !== googleBookId);
    user.reading = user.reading.filter(b => b.googleBookId !== googleBookId);
    user.finished = user.finished.filter(b => b.googleBookId !== googleBookId);

    // 2. Add to the Correct Shelf
    user[targetShelf].push(newBook);

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, { 
            tbr: user.tbr, 
            reading: user.reading, 
            finished: user.finished 
        }, `Moved book to ${shelf}`)
    );
});

// --- 3. GET SHELF ---
const getUserShelf = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(
        new ApiResponse(200, {
            tbr: user.tbr || [],
            reading: user.reading || [],
            finished: user.finished || []
        }, "User shelf fetched successfully")
    );
});

// --- 4. UPDATE PROGRESS (Corrected to use user.reading) ---
const updateProgress = asyncHandler(async (req, res) => {
    const { googleBookId, pagesRead } = req.body;
    const userId = req.user._id;

    if (!googleBookId) throw new ApiError(400, "Book ID is required");
    
    const newPagesRead = Number(pagesRead);
    if (isNaN(newPagesRead)) throw new ApiError(400, "Pages read must be a number");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // FIX: Look in 'reading' array, NOT 'books' array
    const bookIndex = user.reading.findIndex(b => b.googleBookId === googleBookId);

    if (bookIndex === -1) {
        throw new ApiError(404, "Book not found in your Reading list");
    }

    // Update Pages
    user.reading[bookIndex].pagesRead = newPagesRead;
    const currentBook = user.reading[bookIndex];

    // Check if Finished
    if (currentBook.totalPages > 0 && newPagesRead >= currentBook.totalPages) {
        // Create copy for finished list
        const finishedBook = { 
            ...currentBook.toObject(), 
            status: 'finished', 
            pagesRead: currentBook.totalPages 
        };
        
        // Remove from Reading -> Add to Finished
        user.reading.splice(bookIndex, 1);
        user.finished.push(finishedBook);
        
        await user.save({ validateBeforeSave: false });
        return res.status(200).json(new ApiResponse(200, finishedBook, "Book finished!"));
    }

    // Save changes
    user.markModified('reading'); 
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, currentBook, "Progress updated successfully")
    );
});

const removeFromShelf = asyncHandler(async (req, res) => {
    const { googleBookId } = req.body;
    const userId = req.user._id;

    if (!googleBookId) throw new ApiError(400, "Book ID is required");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Filter Function: Returns TRUE if the book should stay, FALSE if it matches the ID
    // We check both 'googleBookId' (New) and 'googleBooksId' (Old)
    const keepBook = (b) => (b.googleBookId !== googleBookId) && (b.googleBooksId !== googleBookId);

    // Apply to all shelves
    user.tbr = user.tbr.filter(keepBook);
    user.reading = user.reading.filter(keepBook);
    user.finished = user.finished.filter(keepBook);

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Book removed successfully"));
});

export { searchBooks, addToShelf, getUserShelf, updateProgress , removeFromShelf};