import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MY_QUOTES, QUOTE_THEMES } from '../utils/quotesdata'; // Adjust path if needed
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Button from './Button'; // Assuming you have this component

const MyQuotes = () => {
    const navigate = useNavigate();
    const [currQuoteIndex, setCurrQuoteIndex] = React.useState(0);
    const [allOpen, setAllOpen] = React.useState(false);

    // --- NAVIGATION HANDLERS ---
    const handleClickNext = () => {
        setCurrQuoteIndex((prev) => (prev + 1) % MY_QUOTES.length);
    };

    const handleClickPrev = () => {
        setCurrQuoteIndex((prev) => (prev - 1 + MY_QUOTES.length) % MY_QUOTES.length);
    };

    // --- HELPER: Get Theme Data ---
    const getTheme = (themeId) => {
        return QUOTE_THEMES.find(t => t.id === themeId) || QUOTE_THEMES[0];
    };

    // --- HELPER: Determine Card Styles based on index ---
    const getCardStyle = (index) => {
        let offset = index - currQuoteIndex;
        if (offset < -1) offset += MY_QUOTES.length;
        if (offset > 1) offset -= MY_QUOTES.length;

        // 1. ACTIVE CARD
        if (index === currQuoteIndex) {
            return {
                zIndex: 30,
                transform: 'translateX(0px) scale(1)',
                opacity: 1,
                filter: 'brightness(1)',
                pointerEvents: 'auto'
            };
        }
        
        // 2. PREVIOUS CARD (Left Stack)
        if (offset === -1 || (currQuoteIndex === 0 && index === MY_QUOTES.length - 1)) {
            return {
                zIndex: 10,
                transform: 'translateX(-20%) scale(0.9) ',
                opacity: 0.2,
                filter: 'brightness(0.5)',
                pointerEvents: 'none',
                cursor: 'default'
            };
        }

        // 3. NEXT CARD (Right Stack)
        if (offset === 1 || (currQuoteIndex === MY_QUOTES.length - 1 && index === 0)) {
            return {
                zIndex: 10,
                transform: 'translateX(20%) scale(0.9) ',
                opacity: 0.2,
                filter: 'brightness(0.5)',
                pointerEvents: 'none',
                cursor: 'default'
            };
        }

        // 4. HIDDEN CARDS
        return {
            zIndex: 0,
            transform: 'scale(0.8)',
            opacity: 0,
            pointerEvents: 'none'
        };
    };

    return (
        <div className='w-full min-h-screen bg-[#1e1701] flex flex-col items-center pt-24 pb-10 text-[#D8CFC4] overflow-hidden'>
            
            {/* --- HEADER --- */}
            <div className='w-full max-w-7xl px-6 flex justify-between items-end mb-4 border-b border-[#D8CFC4]/20 pb-4 z-30'>
                <div>
                    <h1 className="font-titan text-2xl md:text-3xl tracking-wider text-[#D8CFC4]">MY COLLECTION</h1>
                    <p className="font-sans text-[#D8CFC4]/60 mt-2">
                        {currQuoteIndex + 1} / {MY_QUOTES.length}
                    </p>
                </div>
            </div>

            {/* --- CAROUSEL CONTAINER --- */}
            <div className='relative h-[70vh] mt-10 w-full max-w-7xl flex justify-center items-center perspective-1000'>
                
                {/* --- NAVIGATION BUTTONS (FIXED) --- */}
                {/* Removed 'bg-[#1e1701]' from this container so buttons look individual */}
                <div className='absolute bottom-0 left-10 md:left-96 z-50 bg-[#1e1701] rounded-full p-1 flex gap-4'>
                    <button 
                        onClick={handleClickPrev}
                        className="w-12 h-12 rounded-full border border-[#D8CFC4]/20 bg-[#D8CFC4]/5 hover:bg-[#D8CFC4] hover:text-[#1e1701] flex justify-center items-center backdrop-blur-sm transition-all duration-300"
                    >
                        <FaArrowLeft size={16}/>
                    </button>

                    <button 
                        onClick={handleClickNext}
                        className="w-12 h-12 rounded-full border border-[#D8CFC4]/20 bg-[#D8CFC4]/5 hover:bg-[#D8CFC4] hover:text-[#1e1701] flex justify-center items-center backdrop-blur-sm transition-all duration-300"
                    >
                        <FaArrowRight size={16}/>
                    </button>
                </div>

                {/* --- CARDS --- */}
                {MY_QUOTES.map((quote, index) => {
                    const theme = getTheme(quote.themeId);
                    const styleProps = getCardStyle(index);

                    return (
                        <div 
                            key={quote.id}
                            className="absolute w-[80vw] md:w-[25vw] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out"
                            style={{ 
                                ...styleProps,
                                backgroundImage: `url(${theme.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className={`absolute inset-0 ${theme.overlay}`}></div>

                            <div className={`relative z-10 h-full p-8 flex flex-col justify-center items-center text-center ${theme.classes}`}>
                                <span className="text-4xl opacity-50 mb-4 font-serif">"</span>
                                <p className="text-xl md:text-2xl leading-relaxed italic mb-6 select-none">
                                    {quote.text}
                                </p>
                                <div className="w-12 h-[1px] bg-current opacity-50 mb-4"></div>
                                <div className="flex flex-col items-center gap-1 opacity-90">
                                    <span className="uppercase tracking-widest text-sm font-sans font-bold">
                                        {quote.author}
                                    </span>
                                    <span className="text-xs opacity-75 italic font-serif">
                                        {quote.book}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* CLICK ZONES */}
                <div className='absolute left-0 top-0 w-1/4 h-full z-30 cursor-pointer hidden md:block' onClick={handleClickPrev}></div>
                <div className='absolute right-0 top-0 w-1/4 h-full z-30 cursor-pointer hidden md:block' onClick={handleClickNext}></div>

            </div>
            
            {/* --- VIEW ALL SECTION --- */}
            {allOpen ? (
                <div className='w-full mt-24 max-w-7xl p-6 bg-[#1e1701]/80 backdrop-blur-sm rounded-xl border border-[#D8CFC4]/20 z-20 relative'>
                    {/* Close Button for the section */}
                    <button 
                        onClick={() => setAllOpen(false)} 
                        className="font-sans mr-4  absolute top-4 right-4 text-[#D8CFC4] hover:text-white"
                    >
                        X
                    </button>

                    <h1 className='text-2xl font-titan mb-8'>All My Quotes</h1>
                    
                    <div className='w-full flex flex-wrap gap-6 justify-center'>
                        {MY_QUOTES.map((q) => (
                            <div 
                                key={q.id} 
                                // Added 'relative' and 'overflow-hidden' here so the overlay stays inside
                                className='relative overflow-hidden w-full md:w-[45%] h-[40vh] p-4 flex flex-col justify-center items-center text-center border border-[#D8CFC4]/20 rounded-lg group'
                                style={{
                                    backgroundImage: `url(${getTheme(q.themeId).backgroundImage})`, 
                                    backgroundSize: 'cover', 
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* Fixed Overlay */}
                                <div className='absolute inset-0 z-0 bg-black/60 transition-colors duration-300 group-hover:bg-black/70'/>
                                
                                {/* Content (Z-10 brings it above overlay) */}
                                <div className="relative z-10 text-[#D8CFC4]">
                                    <p className='italic text-xl mb-4'>" {q.text} "</p>
                                    <p className='text-sm opacity-80'>- {q.author}, <span className='italic'>{q.book}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='mt-24 mb-10'>
                    <Button text="View All Quotes" onClick={() => setAllOpen(true)} />
                </div>
            )}
            
        </div>
    )
}

export default MyQuotes;