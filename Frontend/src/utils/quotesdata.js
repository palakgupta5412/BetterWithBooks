// src/data/quotesData.js

// 1. SHARED THEMES (Exact same as CreateQuotes)
export const QUOTE_THEMES = [
    {
      id: 'classic-paper',
      name: 'Classic Paper',
      backgroundImage: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format&fit=crop", 
      classes: "text-[#2a1208] font-serif", // Added font-serif here
      overlay: "bg-[#F5F1E1]/90", 
    },
    {
      id: 'midnight-ink',
      name: 'Midnight Ink',
      backgroundImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
      classes: "text-[#D8CFC4] font-serif",
      overlay: "bg-[#100601]/70", 
    },
    {
      id: 'sepia-dream',
      name: 'Sepia Dream',
      backgroundImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
      classes: "text-[#EADDCD] font-serif shadow-2xl",
      overlay: "bg-[#3b1a0a]/85", 
    },
    {
      id: 'forest-whisper',
      name: 'Forest Whisper',
      backgroundImage: "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=1000&auto=format&fit=crop",
      classes: "text-[#c2d6d0] font-serif border-l-4 border-[#2d5a4c]",
      overlay: "bg-[#0f1f1a]/80", 
    },
    {
      id: 'royal-velvet',
      name: 'Royal Velvet',
      backgroundImage: "https://images.unsplash.com/photo-1596367407372-96cb88509589?q=80&w=1000&auto=format&fit=crop",
      classes: "text-[#ffdddd] font-serif",
      overlay: "bg-gradient-to-tr from-[#2a0808]/90 to-[#4a0e0e]/80", 
    },
    {
      id: 'glass-morphism',
      name: 'City Rain',
      backgroundImage: "https://images.unsplash.com/photo-1496037234240-37211d9f5e3b?q=80&w=1000&auto=format&fit=crop",
      classes: "text-white font-serif backdrop-blur-[1px]",
      overlay: "bg-black/40", 
    }
];

// 2. MOCK USER QUOTES
export const MY_QUOTES = [
    {
        id: 1,
        text: "Whatever our souls are made of, his and mine are the same.",
        author: "Emily Brontë",
        book: "Wuthering Heights",
        themeId: "classic-paper", // Links to the theme above
        date: "2023-10-12"
    },
    {
        id: 2,
        text: "I am not afraid of storms, for I am learning how to sail my ship.",
        author: "Louisa May Alcott",
        book: "Little Women",
        themeId: "midnight-ink",
        date: "2023-11-05"
    },
    {
        id: 3,
        text: "The books that the world calls immoral are books that show the world its own shame.",
        author: "Oscar Wilde",
        book: "The Picture of Dorian Gray",
        themeId: "royal-velvet",
        date: "2023-12-01"
    },
    {
        id: 4,
        text: "Not all those who wander are lost.",
        author: "J.R.R. Tolkien",
        book: "The Fellowship of the Ring",
        themeId: "forest-whisper",
        date: "2024-01-15"
    },
    {
        id: 5,
        text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        author: "Jane Austen",
        book: "Pride and Prejudice",
        themeId: "sepia-dream",
        date: "2024-02-10"
    },
    {
        id: 6,
        text: "So we beat on, boats against the current, borne back ceaselessly into the past.",
        author: "F. Scott Fitzgerald",
        book: "The Great Gatsby",
        themeId: "glass-morphism",
        date: "2024-02-28"
    }
];

// src/utils/mockQuotes.js
export const STATIC_QUOTES = [
    { id: 1, text: "I'm gonna make him an offer he can't refuse.", author: "The Godfather", book: "Mario Puzo" },
    { id: 2, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", book: "Biography" },
    { id: 3, text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", author: "Jane Austen", book: "Pride and Prejudice" },
    { id: 4, text: "All that we see or seem is but a dream within a dream.", author: "Edgar Allan Poe", book: "Collected Works" },
    { id: 5, text: "We accept the love we think we deserve.", author: "Stephen Chbosky", book: "The Perks of Being a Wallflower" },
];