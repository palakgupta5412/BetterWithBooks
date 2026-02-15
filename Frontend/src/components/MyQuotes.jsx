import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyQuotes } from '../api/quote.service'; // Ensure this exists
import { QUOTE_THEMES } from '../utils/quotesdata'; // Shared themes file
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Button from './Button';

const MyQuotes = () => {
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [currQuoteIndex, setCurrQuoteIndex] = useState(0);
    const [allOpen, setAllOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await getMyQuotes();
                setQuotes(res.data || []);
            } catch (error) {
                console.error("Failed to load quotes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    // 2. Helper to find Theme Background
    const getTheme = (themeId) => {
        return QUOTE_THEMES.find(t => t.id === themeId) || QUOTE_THEMES[0];
    };

    // 3. Handlers
    const handleClickNext = () => setCurrQuoteIndex((prev) => (prev + 1) % quotes.length);
    const handleClickPrev = () => setCurrQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);

    // 4. Card Style Logic
    const getCardStyle = (index) => {
        if(quotes.length === 0) return {};
        let offset = index - currQuoteIndex;
        if (offset < -1) offset += quotes.length;
        if (offset > 1) offset -= quotes.length;

        if (index === currQuoteIndex) return { zIndex: 30, transform: 'translateX(0px) scale(1)', opacity: 1, filter: 'brightness(1)', pointerEvents: 'auto' };
        if (offset === -1 || (currQuoteIndex === 0 && index === quotes.length - 1)) return { zIndex: 10, transform: 'translateX(-20%) scale(0.9)', opacity: 0.2, filter: 'brightness(0.5)', pointerEvents: 'none' };
        if (offset === 1 || (currQuoteIndex === quotes.length - 1 && index === 0)) return { zIndex: 10, transform: 'translateX(20%) scale(0.9)', opacity: 0.2, filter: 'brightness(0.5)', pointerEvents: 'none' };
        return { zIndex: 0, transform: 'scale(0.8)', opacity: 0, pointerEvents: 'none' };
    };

    if (loading) return <div className="pt-40 text-center text-[#D8CFC4]">Loading your collection...</div>;

    if (quotes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-[#D8CFC4]/50">
                <p className="mb-4 text-xl font-serif">"Your collection is empty..."</p>
                <Button text="Create Your First Quote" onClick={() => navigate('/createquote')} />
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen bg-[#1e1701] flex flex-col items-center pt-24 pb-10 text-[#D8CFC4] overflow-hidden'>
            
            {/* HEADER */}
            <div className='w-full max-w-7xl px-6 flex justify-between items-end mb-4 border-b border-[#D8CFC4]/20 pb-4 z-30'>
                <div>
                    <h1 className="font-titan text-2xl md:text-3xl tracking-wider text-[#D8CFC4]">MY COLLECTION</h1>
                    <p className="font-sans text-[#D8CFC4]/60 mt-2">
                        {currQuoteIndex + 1} / {quotes.length}
                    </p>
                </div>
            </div>

            {/* CAROUSEL CONTAINER */}
            <div className='relative h-[70vh] mt-10 w-full max-w-7xl flex justify-center items-center perspective-1000'>
                
                {/* NAV BUTTONS */}
                {quotes.length > 1 && (
                    <div className='absolute bottom-0 left-10 md:left-96 z-50 rounded-full p-1 flex gap-4'>
                        <button onClick={handleClickPrev} className="w-12 h-12 rounded-full border border-[#D8CFC4]/20 bg-[#D8CFC4]/5 hover:bg-[#D8CFC4] hover:text-[#1e1701] flex justify-center items-center backdrop-blur-sm transition-all"><FaArrowLeft size={16}/></button>
                        <button onClick={handleClickNext} className="w-12 h-12 rounded-full border border-[#D8CFC4]/20 bg-[#D8CFC4]/5 hover:bg-[#D8CFC4] hover:text-[#1e1701] flex justify-center items-center backdrop-blur-sm transition-all"><FaArrowRight size={16}/></button>
                    </div>
                )}

                {/* CARDS */}
                {quotes.map((quote, index) => {
                    const theme = getTheme(quote.theme); // Uses API 'theme' string to find config
                    return (
                        <div 
                            key={quote._id} 
                            className="absolute w-[80vw] md:w-[25vw] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out"
                            style={{ 
                                ...getCardStyle(index),
                                backgroundImage: `url(${theme.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className={`absolute inset-0 ${theme.overlay}`}></div>
                            <div className={`relative z-10 h-full p-8 flex flex-col justify-center items-center text-center ${theme.classes}`}>
                                <span className="text-4xl opacity-50 mb-4 font-serif">"</span>
                                <p className="text-xl md:text-2xl leading-relaxed italic mb-6 select-none">
                                    {quote.content}
                                </p>
                                <div className="w-12 h-[1px] bg-current opacity-50 mb-4"></div>
                                <div className="flex flex-col items-center gap-1 opacity-90">
                                    <span className="uppercase tracking-widest text-sm font-sans font-bold">{quote.author}</span>
                                    {/* Using bookName from API */}
                                    {quote.bookName && <span className="text-xs opacity-75 italic font-serif">{quote.bookName}</span>}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyQuotes;