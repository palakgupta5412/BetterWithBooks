import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { Author } from "../models/author.model.js";

const searchBooks = asyncHandler(async(req, res) => {
    
    // 1. Get the search query from the frontend (e.g., ?query=Harry+Potter)
    const { query } = req.query;

    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    // 2. Call Google Books API
    // We limit results to 10 to save bandwidth
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}&maxResults=10`;

    try {
        const response = await axios.get(googleBooksUrl);
        const data = response.data;

        // 3. If no items found
        if (!data.items || data.items.length === 0) {
            return res.status(404).json(new ApiResponse(404, [], "No books found"));
        }

        // 4. CLEAN THE DATA (Format it for our frontend)
        // Google returns messy data. We only want: Title, Author, Image, Description, etc.
        const formattedBooks = data.items.map((book) => {
            const info = book.volumeInfo;
            return {
                googleId: book.id, // We need this to save the book later!
                title: info.title,
                authors: info.authors || ["Unknown Author"],
                description: info.description || "No description available",
                coverImage: info.imageLinks?.thumbnail || "https://via.placeholder.com/150",
                pageCount: info.pageCount || 0,
                categories: info.categories || [],
                averageRating: info.averageRating || 0
            };
        });

        // 5. Send clean data back to frontend
        return res
        .status(200)
        .json(new ApiResponse(200, formattedBooks, "Books fetched successfully"));

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

export { searchBooks, addToShelf, getUserShelf };