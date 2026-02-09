import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Quote content is required"]
    },
    author: { 
        type: String, 
        required: [true, "Author name is required"] 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        default: null
    },
    // JUST STORE THE ID STRING
    theme: {
        type: String, 
        default: "classic-paper", // Default fallback
        enum: [ // Optional: limit to your specific IDs so users can't send garbage
            "classic-paper", 
            "midnight-ink", 
            "sepia-dream", 
            "forest-whisper", 
            "royal-velvet", 
            "glass-morphism", 
            "custom-upload", 
            "simple-solid"
        ]
    }
}, {
    timestamps: true
});

export const Quote = mongoose.model("Quote", quoteSchema);