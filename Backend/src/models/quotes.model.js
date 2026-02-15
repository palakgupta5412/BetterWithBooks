import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    
    // CHANGE: Store the name as a simple string
    bookName: { type: String, default: "" }, 
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    theme: {
        type: String, 
        default: "classic-paper",
        enum: [ 
            "classic-paper", "midnight-ink", "sepia-dream", 
            "forest-whisper", "royal-velvet", "glass-morphism", 
            "custom-upload", "simple-solid"
        ]
    }
}, { timestamps: true });

export const Quote = mongoose.model("Quote", quoteSchema);