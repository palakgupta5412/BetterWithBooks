import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({ 
    bookName: {
        type: String,
        required: [true, "Book Name is required"],
        index: true // Great for search performance
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author", 
        required: true
    }],
    pageCount: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    averageRating: { // Renamed from 'rating' to be clearer (it's the average, not user's specific rating)
        type: Number,
        default: 0, 
    },
    // We REMOVED 'quotes' to avoid the array growing too large. 
    // We will query quotes using the Quote model instead.
    
    googleBooksId: {
        type: String,
        required: true,
        unique: true, // Prevents duplicate books in your DB
        index: true   // Makes finding books by Google ID super fast
    }
}, {
    timestamps: true
});

export const Book = mongoose.model('Book', bookSchema);