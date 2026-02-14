import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getMyShelf, getAIRecommendations } from '../api/books.service';
import { FaMagic, FaPlus, FaTimes, FaRobot, FaCheck, FaBook } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
    const [myBooks, setMyBooks] = useState([]); 
    const [selectedBooks, setSelectedBooks] = useState([]); 
    const [recommendations, setRecommendations] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    // UI States
    const [showMyShelf, setShowMyShelf] = useState(false);
    const [manualInput, setManualInput] = useState("");

    const { addToast } = useToast();
    const navigate = useNavigate();

    // 1. Fetch User's Books
    useEffect(() => {
        const loadBooks = async () => {
            try {
                const res = await getMyShelf();
                const data = res.data;
                const all = [...(data.reading||[]), ...(data.finished||[]), ...(data.tbr||[])];
                // Unique filter
                const unique = [...new Map(all.map(b => [b.googleBookId || b._id, b])).values()];
                setMyBooks(unique);
            } catch (err) {
                console.error("Could not load shelf", err);
            }
        };
        loadBooks();
    }, []);

    // 2. Add/Remove Book (Toggle)
    const toggleBook = (bookName) => {
        if (selectedBooks.includes(bookName)) {
            setSelectedBooks(prev => prev.filter(b => b !== bookName));
        } else {
            if (selectedBooks.length >= 3) return addToast("Select max 3 books!", "info");
            setSelectedBooks(prev => [...prev, bookName]);
        }
    };

    // 3. Handle Manual Input Add
    const handleManualAdd = () => {
        if (!manualInput.trim()) return;
        if (selectedBooks.length >= 3) return addToast("Max 3 books allowed!", "info");
        if (selectedBooks.includes(manualInput.trim())) return addToast("Book already added!", "info");
        
        setSelectedBooks(prev => [...prev, manualInput.trim()]);
        setManualInput(""); // Clear input
        addToast("Book added!", "success");
    };

    // 4. Call AI
    const handleGenerate = async () => {
        if (selectedBooks.length === 0) return addToast("Select at least 1 book.", "error");
        
        setLoading(true);
        setRecommendations([]); 

        try {
            const res = await getAIRecommendations(selectedBooks);
            setRecommendations(res.data);
            addToast("Recommendations generated!", "success");
        } catch (err) {
            addToast("AI failed to respond.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#1a0f0e] text-[#D8CFC4] font-sans">
            
            <div className="flex-1 p-6 md:p-10 overflow-y-auto h-screen scrollbar-hide relative">
                {/* Background Glow */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#D8CFC4]/10 rounded-full blur-[128px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto z-10 relative">
                    
                    {/* --- HEADER --- */}
                    <div className="text-center mb-10 mt-10 md:mt-0">
                        <h1 className="font-playfair tracking-wider font-extrabold text-4xl md:text-5xl text-[#ffba66] mb-4 flex items-center justify-center gap-3">
                            <FaMagic /> AI Librarian
                        </h1>
                        <p className="text-white/60 text-sm md:text-base">
                            Tell us what you loved, and we'll find your next obsession.
                        </p>
                    </div>

                    {/* --- CONTROL PANEL --- */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-10 shadow-2xl backdrop-blur-sm">
                        
                        {/* 1. SELECTED PILLS */}
                        <div className="mb-8">
                            <h3 className="text-xs uppercase tracking-widest text-[#ffba66] mb-3 font-bold">Your Selection ({selectedBooks.length}/3)</h3>
                            <div className="flex gap-3 flex-wrap min-h-[50px] items-center bg-[#0f0502]/50 p-4 rounded-xl border border-white/5 border-dashed">
                                {selectedBooks.length === 0 ? (
                                    <span className="text-white/30 text-sm italic flex items-center gap-2">
                                        <FaBook className="opacity-50"/> Add books below...
                                    </span>
                                ) : (
                                    selectedBooks.map(book => (
                                        <span key={book} className="bg-[#ffba66] text-black px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-fade-in">
                                            {book} 
                                            <button onClick={() => toggleBook(book)} className="hover:bg-black/20 rounded-full p-1 transition">
                                                <FaTimes />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 2. TOGGLE SHELF */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-white font-medium flex items-center gap-2">
                                Pick from my shelf?
                            </span>
                            
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={showMyShelf} 
                                    onChange={() => setShowMyShelf(!showMyShelf)} 
                                    className="sr-only peer" 
                                />
                                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffba66]"></div>
                            </label>
                        </div>

                        {/* SHELF GRID (CONDITIONAL) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showMyShelf ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-1">
                                {myBooks.length === 0 ? (
                                    <div className="col-span-full text-center text-white/40 italic py-4">Your shelf is empty.</div>
                                ) : (
                                    myBooks.map(book => (
                                        <div 
                                            key={book._id || book.googleBookId}
                                            onClick={() => toggleBook(book.bookName)}
                                            className={`
                                                p-3 rounded-xl border text-xs cursor-pointer transition-all truncate text-center select-none
                                                ${selectedBooks.includes(book.bookName) 
                                                    ? 'border-[#ffba66] bg-[#ffba66]/20 text-[#ffba66] font-bold shadow-[0_0_10px_rgba(255,186,102,0.2)]' 
                                                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/30'}
                                            `}
                                        >
                                            {book.bookName}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 3. MANUAL INPUT */}
                        <div className="mb-8">
                            <h3 className="text-xs uppercase tracking-widest text-[#ffba66] mb-3 font-bold">Or Type Manually</h3>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input 
                                        type="text" 
                                        value={manualInput}
                                        onChange={(e) => setManualInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
                                        placeholder="e.g. The Great Gatsby" 
                                        className="w-full bg-[#1a0f0e] border border-white/20 rounded-xl py-3 px-5 text-white focus:border-[#ffba66] outline-none transition-colors" 
                                    />
                                    <FaPlus className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                                </div>
                                <button 
                                    onClick={handleManualAdd}
                                    className="bg-green-600/80 hover:bg-green-500 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center w-14"
                                    title="Add Book"
                                >
                                    <FaCheck size={18} />
                                </button>
                            </div>
                        </div>

                        {/* GENERATE BUTTON */}
                        <div className="flex justify-center border-t border-white/10 pt-8">
                            <button 
                                onClick={handleGenerate}
                                disabled={loading || selectedBooks.length === 0}
                                className={`
                                    flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all
                                    ${loading 
                                        ? 'bg-gray-800 text-white/30 cursor-wait' 
                                        : 'bg-gradient-to-r from-[#ffba66] to-[#d4b06b] text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,186,102,0.4)]'}
                                `}
                            >
                                {loading ? <span className="animate-pulse">AI is Thinking...</span> : <><FaRobot className="text-xl"/> Generate Suggestions</>}
                            </button>
                        </div>
                    </div>

                    {/* --- RESULTS SECTION --- */}
                    {recommendations.length > 0 && (
                        <div className="animate-fade-in-up pb-20">
                            <div className="flex items-center gap-4 mb-8 justify-center">
                                <div className="h-px bg-gradient-to-r from-transparent via-[#ffba66] to-transparent flex-1"></div>
                                <h3 className="font-playfair text-3xl text-white">Curated For You</h3>
                                <div className="h-px bg-gradient-to-r from-transparent via-[#ffba66] to-transparent flex-1"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommendations.map((rec, i) => (
                                    <div key={i} className="bg-[#150a09] border border-[#ffba66]/20 p-8 rounded-2xl hover:border-[#ffba66]/50 transition-all group relative overflow-hidden shadow-xl hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffba66]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                        
                                        <div className='flex justify-between w-full'>
                                            <div>
                                                <h4 className="font-playfair text-2xl font-bold text-[#ffba66] mb-1 group-hover:text-white transition-colors">{rec.title}</h4>
                                                <p className="text-sm text-white/50 mb-4 font-mono uppercase tracking-widest">{rec.author}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-3 mb-6">
                                            <div className="w-1 bg-[#ffba66]/50 rounded-full"></div>
                                            <p className="text-white/80 text-sm italic leading-relaxed">
                                                "{rec.reason}"
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => navigate(`/explore`)} 
                                            className="w-full py-2 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-widest text-[#ffba66] hover:bg-[#ffba66] hover:text-black transition-all"
                                        >
                                            Find in Explore
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;