import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTh, FaTimes, FaQuoteLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllQuotes } from '../api/quote.service'; // Import API

// --- SINGLE CARD COMPONENT ---
const QuoteCard = ({ quote, index, total }) => {
    // Alternating Colors for visual interest
    const isEven = index % 2 === 0;
    const bgClass = isEven ? "bg-[#1a0f0e]" : "bg-[#ffba66]";
    const textClass = isEven ? "text-[#ffba66]" : "text-[#1a0f0e]";
    const borderClass = isEven ? "border-[#ffba66]" : "border-[#1a0f0e]";
    const gridColor = isEven ? "rgba(255,186,102,0.1)" : "rgba(26,15,14,0.1)";

    return (
        <div className="h-screen w-full snap-center flex items-center justify-center p-4 relative overflow-hidden">
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`
                    relative w-full max-w-sm md:max-w-3xl aspect-[4/5] md:aspect-video 
                    ${bgClass} border-4 ${borderClass} 
                    flex flex-col items-center justify-center text-center p-6 md:p-16
                    shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)]
                `}
            >
                {/* Grid Pattern Background */}
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(${gridColor} 1px, transparent 1px), 
                            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px'
                    }}
                ></div>

                {/* Content */}
                <div className={`relative z-10 ${textClass} flex flex-col items-center w-full`}>
                    <FaQuoteLeft className="text-4xl md:text-6xl opacity-20 mb-6" />
                    
                    {/* Quote Content */}
                    <h2 className="text-2xl md:text-4xl font-black font-playfair leading-tight mb-8 w-full break-words">
                        {quote.content} 
                    </h2>
                    
                    <div className={`w-12 h-1 ${isEven ? 'bg-[#ffba66]' : 'bg-[#1a0f0e]'} opacity-50 mb-6`}></div>
                    
                    {/* Author */}
                    <p className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase font-bold">
                        {quote.author}
                    </p>
                    {/* Book Name (Optional) */}
                    {quote.bookName && (
                        <p className="text-[10px] md:text-xs mt-2 italic opacity-60">
                            {quote.bookName}
                        </p>
                    )}
                    
                    {/* Creator Credit (Small at bottom) */}
                    <div className="mt-6 flex items-center gap-2 opacity-40 text-[10px]">
                        {quote.user?.pfp && (
                            <img src={quote.user.pfp} alt="User" className={`w-4 h-4 rounded-full border ${borderClass}`} />
                        )}
                        <span>Posted by {quote.user?.name || "Anonymous"}</span>
                    </div>
                </div>

                {/* Card Number Badge */}
                <div className={`absolute top-4 right-4 text-[10px] md:text-xs font-mono border ${borderClass} px-2 py-1 ${textClass} opacity-60`}>
                    {index + 1} / {total}
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN PAGE ---
const AllQuotes = () => {
    const navigate = useNavigate();
    const [showGrid, setShowGrid] = useState(false);
    
    // 1. DYNAMIC STATE
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. FETCH DATA
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await getAllQuotes();
                setQuotes(res.data || []);
            } catch (err) {
                console.error("Failed to load community quotes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#0f0502] min-h-screen flex items-center justify-center text-[#ffba66]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ffba66] border-opacity-50"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f0502] min-h-screen text-[#D8CFC4] font-sans relative">
            
            {/* --- HEADER --- */}
            <div className="fixed top-0 left-0 w-full flex justify-between items-center p-4 md:p-8 z-50 mix-blend-difference text-[#ffba66]">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest hover:underline"
                >
                    <FaArrowLeft /> Back
                </button>

                <button 
                    onClick={() => setShowGrid(true)} 
                    className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest hover:underline"
                >
                    View All <FaTh />
                </button>
            </div>

            {/* --- EMPTY STATE --- */}
            {quotes.length === 0 && (
                <div className="h-screen w-full flex flex-col items-center justify-center opacity-50">
                    <p className="text-xl font-serif mb-4">"Silence is golden..."</p>
                    <p className="text-sm">No quotes found in the community yet.</p>
                </div>
            )}

            {/* --- SCROLL SNAP CONTAINER --- */}
            <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                {quotes.map((quote, index) => (
                    <QuoteCard 
                        key={quote._id}  // Use MongoDB _id
                        quote={quote} 
                        index={index} 
                        total={quotes.length}
                    />
                ))}
            </div>

            {/* --- GRID OVERLAY (View All) --- */}
            <AnimatePresence>
                {showGrid && (
                    <motion.div 
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-[#1a0f0e] flex flex-col"
                    >
                        {/* Overlay Header */}
                        <div className="flex justify-between items-center p-6 border-b border-[#ffba66]/20 bg-[#1a0f0e]">
                            <h1 className="text-2xl font-playfair font-bold text-[#ffba66]">ALL QUOTES</h1>
                            <button 
                                onClick={() => setShowGrid(false)}
                                className="p-3 bg-[#ffba66] text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Grid Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-grid-pattern">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
                                {quotes.map((q, i) => (
                                    <div 
                                        key={q._id} // Use MongoDB _id
                                        className={`
                                            break-inside-avoid border p-6 md:p-8 hover:-translate-y-1 transition-transform duration-300
                                            ${i % 2 === 0 ? 'bg-[#0f0502] border-[#ffba66] text-[#D8CFC4]' : 'bg-[#ffba66] border-[#0f0502] text-[#0f0502]'}
                                        `}
                                    >
                                        <p className="font-playfair text-lg md:text-xl mb-4 leading-relaxed">
                                            "{q.content}"
                                        </p>
                                        <div className="w-full h-px bg-current opacity-20 mb-3"></div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xs font-mono uppercase tracking-widest font-bold">
                                                {q.author}
                                            </p>
                                            {/* Tiny user credit in grid */}
                                            <span className="text-[10px] opacity-60">
                                                by {q.user?.name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllQuotes;