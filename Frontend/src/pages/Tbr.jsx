import React, { useEffect, useState, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { FaArrowAltCircleDown, FaArrowLeft } from 'react-icons/fa';
import TextReveal from '../hooks/textReveal';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { getMyShelf } from '../api/books.service';

gsap.registerPlugin(ScrollTrigger);

const Tbr = () => {
  const [tbr, setTbr] = useState([]);
  const navigate = useNavigate();
  const tbrRef = useRef(null);
  
  // --- 1. FETCH DATA ---
  const fetchTBR = async () => {
    try {
      const books = await getMyShelf();
      setTbr(books.data.tbr || []);
    } catch (error) {
      console.error("Failed to fetch TBR:", error);
    }
  }

  useEffect(() => {
    fetchTBR();
  }, []);

  useGSAP(() => {
    if (tbr.length === 0) return;

    const cards = tbrRef.current.querySelectorAll('.group');
    
    gsap.fromTo(cards, 
      { opacity: 0, scale: 0.9, y: 50 }, 
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: {
          trigger: tbrRef.current,
          start: "top 80%", // Starts when top of list hits 80% of viewport
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: tbrRef, dependencies: [tbr] });

  // --- 3. SCROLL IMAGE LOGIC ---
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll (0 to 1) to image index (0 to 8)
    // We want the images to finish cycling by the time we scroll past the first screen height
    const scrollCap = Math.min(latest * 2.5, 1); 
    const index = Math.floor(scrollCap *8); 
    setActiveImageIndex(index);
  });

  const imgData = [
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1718283728i/213243908.jpg", rotate: "-16deg", z: 10 },
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1634158558i/59344312.jpg", rotate: "-10deg", z: 20 },
    { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwrr6PAkFGsrxAFnlNTgbGln_d7bFPK5mMbw&s", rotate: "-4deg", z: 30 },
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1581589570l/52227678.jpg", rotate: "2deg", z: 40 },
    { url: "https://marketplace.canva.com/EAFOu64R3Gk/2/0/1003w/canva-pink-and-purple-cute-young-adult-love-romance-book-cover-K15yUkKnrPo.jpg", rotate: "8deg", z: 50 },
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1646534743i/60556912.jpg", rotate: "14deg", z: 60 },
    { url: "https://m.media-amazon.com/images/I/61R+Cpm+HxL._AC_UF1000,1000_QL80_.jpg", rotate: "20deg", z: 70 },
    { url: "https://m.media-amazon.com/images/I/81Y+9pH0TAL._AC_UF1000,1000_QL80_.jpg", rotate: "26deg", z: 80 },
    { url: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861546749/the-way-i-used-to-be-9780861546749_hr.jpg", rotate: "15deg", z: 90 },
  ];

  return (
    <div className='w-full bg-[#170b01] min-h-screen text-white overflow-x-hidden'>
      
      {/* --- HERO SECTION (Sticky Scroll) --- */}
      {/* "h-[200vh]" makes the page tall enough to scroll through the images before hitting the list */}
      <div className='relative w-full h-[200vh]'>
        
        <div className='fixed top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden'>
            
            {/* LEFT: Text Content */}
            <div className='w-full md:w-[40%] h-[40vh] md:h-full flex flex-col justify-center px-6 md:px-20 z-20 relative bg-gradient-to-b from-[#170b01] via-[#170b01]/80 to-transparent md:bg-none'>
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 md:top-10 md:left-10 text-[#ffba66] text-2xl md:text-3xl hover:scale-110 transition z-50">
                    <FaArrowLeft />
                </button>
            
                <h2 className='text-[#ffba66] text-xs md:text-sm uppercase tracking-[0.3em] font-bold mb-4 animate-pulse'>Curated Selection</h2>
                <h1 className='text-4xl md:text-6xl font-serif font-bold leading-tight'>
                    Books that felt like <span className='italic text-[#ffba66]'>home.</span>
                </h1>
                <p className='text-white/60 mt-4 md:mt-6 text-sm md:text-lg leading-relaxed max-w-md'>
                    A visual journey through the stories waiting on your shelf. Scroll to explore.
                </p>
                <div className='mt-8 h-1 w-16 md:w-20 bg-[#ffba66]'></div>
            </div>

            {/* RIGHT: Image Stack Animation */}
            <div className='w-full md:w-[60%] h-[60vh] md:h-full flex items-center justify-center relative'>
                {/* Background Text */}
                <h1 className='absolute text-[15vw] font-bold text-white/[0.03] select-none pointer-events-none'>
                    TBR
                </h1>
                
                {/* Images */}
                <div className='relative w-full h-full flex items-center justify-center'>
                    {imgData.map((item, index) => (
                        <img
                            key={index}
                            src={item.url}
                            alt="Book Cover"
                            className={`absolute w-40 md:w-64 rounded-lg shadow-2xl border border-white/10 transition-all duration-700 ease-out origin-center
                                ${index <= activeImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-50 translate-y-20'}
                            `}
                            style={{ 
                                transform: index <= activeImageIndex 
                                    ? `rotate(${item.rotate})` 
                                    : `rotate(${item.rotate}) translateY(100px)`,
                                zIndex: item.z
                            }}
                        />
                    ))}
                </div>
            </div>

        </div>
      </div>

      {/* --- LIST SECTION (Appears after scroll) --- */}
      <div className='relative z-20 bg-[#170b01] pb-20 -mt-[20vh] md:-mt-0 rounded-t-[3rem] md:rounded-none shadow-[0_-50px_100px_rgba(0,0,0,1)]'>
        
        <div className="w-full flex justify-center pt-10 pb-4">
             <TextReveal className='text-center font-bold font-playfair tracking-wider text-3xl md:text-4xl mb-10 text-[#ffba66]' text="Your To-Be-Read List"/>
        </div>

        <div ref={tbrRef} className='max-w-4xl mx-auto px-4 flex flex-col gap-4 min-h-[50vh]'>
            {tbr.length === 0 ? (
                <div className="text-white/40 text-center  py-20 italic">
                    Your TBR shelf is dusty and empty... <br/>
                    <span className="text-sm not-italic mt-2 block text-[#ffba66] cursor-pointer" onClick={() => navigate('/explore')}>Go add some books?</span>
                </div>
            ) : (
                tbr.map((book, i) => (
                    <div 
                        key={book._id || i}
                        onClick={() => navigate('/info', { state: { book } })}
                        className='group  relative flex items-center h-28 md:h-36 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-[#ffba66]/10 hover:border-[#ffba66]/50 transition-all duration-300 cursor-pointer'
                    >
                        {/* Cover Image */}
                        <div className='h-full w-20 md:w-28 shrink-0'>
                            <img 
                                src={book.coverImage || "https://placehold.co/100x150"} 
                                alt={book.bookName} 
                                className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500' 
                            />
                        </div>

                        {/* Info */}
                        <div className='flex-1 px-4 md:px-8 flex flex-col justify-center'>
                            <div className="flex justify-between items-start w-full">
                                <div>
                                    <h3 className='text-lg md:text-2xl font-bold text-white group-hover:text-[#ffba66] transition-colors line-clamp-1'>
                                        {book.bookName}
                                    </h3>
                                    <p className='text-xs md:text-sm text-white/60 italic'>{book.author}</p>
                                </div>
                                {book.totalPages > 0 && (
                                    <span className="hidden md:inline-block text-[10px] uppercase tracking-widest border border-[#ffba66]/30 text-[#ffba66] px-2 py-1 rounded">
                                        {book.totalPages} pgs
                                    </span>
                                )}
                            </div>
                            
                            {/* Tags */}
                            <div className="flex gap-2 mt-2 md:mt-3 flex-wrap">
                                {(book.categories || ["General"]).slice(0, 3).map((cat, idx) => (
                                    <span key={idx} className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/50 border border-white/10 px-2 py-0.5 rounded-full">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className='pr-4 md:pr-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300'>
                            <FaArrowAltCircleDown className='text-[#ffba66] text-xl md:text-2xl -rotate-90' />
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

    </div>
  );
};

export default Tbr;