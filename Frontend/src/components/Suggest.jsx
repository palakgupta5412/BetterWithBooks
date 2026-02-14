import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// 1. IMPORT searchBooks HERE
import { getAIRecommendations, searchBooks } from "../api/books.service";

const Suggest = ({ similarTo }) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA & COVERS ---
  const getSuggestions = async () => {
    try {
      setLoading(true);
      const query = Array.isArray(similarTo) ? similarTo : [similarTo];
      
      // Step A: Ask AI for recommendations (Text only)
      const res = await getAIRecommendations(query);
      const rawData = res.data || [];

      // Step B: "Search Wala Fn" to get covers
      // We use Promise.all to fetch all covers at the same time (faster)
      const enrichedBooks = await Promise.all(
        rawData.map(async (item, index) => {
          let realCover = null;

          try {
            // Search Google Books for "Title + Author"
            const searchRes = await searchBooks(`${item.title} ${item.author}`);
            // Take the first result's cover
            if (searchRes.data && searchRes.data.length > 0) {
              realCover = searchRes.data[0].coverImage;
            }
          } catch (err) {
            console.warn(`Could not find cover for ${item.title}`);
          }

          return {
            id: index,
            bookName: item.title,
            author: item.author,
            description: item.reason,
            // Use real cover if found, otherwise placeholder
            coverImage: realCover || `https://placehold.co/400x600/1a0f0e/ffba66?text=${encodeURIComponent(item.title)}`
          };
        })
      );

      setBooksData(enrichedBooks);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (similarTo) {
        getSuggestions();
    }
  }, [similarTo]);

  // --- 2. SLIDER LOGIC (Unchanged) ---
  const scrollToIndex = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const children = Array.from(slider.children);
    const targetChild = children[index];
    if (targetChild) {
      const targetLeft = targetChild.offsetLeft - (slider.offsetWidth / 2) + (targetChild.offsetWidth / 2);
      slider.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  };

  const prevSlide = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(newIndex);
  };

  const nextSlide = () => {
    const newIndex = Math.min(booksData.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  };

  // Scroll Listener
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || booksData.length === 0) return;

    const handleScroll = () => {
      const cards = Array.from(slider.children);
      const center = slider.scrollLeft + slider.offsetWidth / 2;
      let closest = 0;
      let minDist = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = index;
        }
      });
      setActiveIndex(closest);
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [booksData]);

  
  // --- 3. RENDER ---
  if (loading) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-white gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ffba66]"></div>
        <p className="font-playfair italic opacity-60">Consulting the AI Librarian & Fetching Covers...</p>
      </div>
    );
  }

  if (booksData.length === 0) return null;

  const currentBook = booksData[activeIndex];

  return (
    <div className="overflow-x-hidden text-white w-full flex flex-col gap-10 overflow-hidden py-10">
      
      {/* Header */}
      <div className="flex gap-3 px-4 md:px-32">
        <h2 className="text-xl">Because you liked <span className="italic text-[#ffba66] font-serif">"{similarTo}"</span></h2>
      </div>

      {/* Book Details Section */}
      <div className="flex flex-col md:flex-row justify-between px-4 md:px-32 gap-8 md:gap-0">
        <div className="relative z-10 w-full md:w-1/2 text-white">
          <h1 className="text-4xl md:text-5xl text-[#ffba66] mb-2 font-extrabold transition-all duration-300 font-playfair leading-tight">
            {currentBook.bookName}
          </h1>
          <p className="text-white font-bold text-xl opacity-80 mb-4">{currentBook.author}</p>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <p className="text-md opacity-90 text-gray-300 italic leading-relaxed">
              "{currentBook.description}"
            </p>
          </div>
        </div>

        {/* Arrows */}
        <div className="hidden md:flex w-1/2 justify-end items-center gap-8 pr-10">
          <button onClick={prevSlide} disabled={activeIndex === 0} className="p-4 rounded-full border border-[#ffba66]/30 text-[#ffba66] hover:bg-[#ffba66] hover:text-black transition-all disabled:opacity-30">
             <FaArrowLeft size={24} />
          </button>
          <button onClick={nextSlide} disabled={activeIndex === booksData.length - 1} className="p-4 rounded-full border border-[#ffba66]/30 text-[#ffba66] hover:bg-[#ffba66] hover:text-black transition-all disabled:opacity-30">
             <FaArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div 
        ref={sliderRef} 
        className="z-10 mt-4 relative flex w-full h-[450px] gap-12 px-[50%] overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide items-center"
        style={{ scrollPadding: "0 50%" }}
      >
        {booksData.map((book, index) => (
          <div
            key={book.id}
            className="snap-center shrink-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out cursor-pointer"
            onClick={() => scrollToIndex(index)}
            style={{ perspective: "1000px" }} 
          >
            <img
              src={book.coverImage}
              alt={book.bookName}
              className={`rounded-lg shadow-[0_10px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out object-cover border border-white/10
                ${index === activeIndex 
                  ? "w-[260px] h-[380px] scale-110 opacity-100 z-50 brightness-110" 
                  : "w-[180px] h-[280px] scale-90 opacity-40 grayscale-[80%] hover:opacity-60"
                }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggest;