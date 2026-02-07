import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Suggest = ({similarTo}) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    const children = Array.from(slider.children);
    const targetChild = children[index];
    
    if (targetChild) {
      // Calculate the left position needed to center the child
      const targetLeft = 
        targetChild.offsetLeft - 
        (slider.offsetWidth / 2) + 
        (targetChild.offsetWidth / 2);

      slider.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
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

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

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
  }, []);

  // Books Data Placeholder (Same as your code)
  const booksData = [
  {
    id: 1,
    bookName: "It Ends With Us",
    author: "Colleen Hoover", 
    genre: ["Romance", "Contemporary", "Drama"],
    status: "Finished",
    pagesRead: 376,
    totalPages: 376,
    progressPercent: 100,
    description: "A poignant and powerful novel that explores the complexities of love and resilience.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81s0B6NYXML.jpg",
  },
  {
    id: 2,
    bookName: "It Starts With Us",
    author: "Colleen Hoover",
    genre: ["Romance", "Contemporary"],
    status: "To be Read",
    pagesRead: 0,
    totalPages: 336,
    progressPercent: 0,
    description: "The sequel to 'It Ends With Us', continuing the story of Lily and Ryle as they navigate new challenges in their relationship.",
    coverImage: "https://m.media-amazon.com/images/I/81G91BUSHsL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 3,
    bookName: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: ["Fiction", "Romance", "Historical"],
    status: "Reading",
    pagesRead: 120,
    totalPages: 400,
    progressPercent: 30,
    description: "A captivating novel that explores the complexities of love and family in the 19th century.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71KcUgYanhL.jpg",
  },
  {
    id: 4,
    bookName: "Atomic Habits",
    author: "James Clear",
    genre: ["Self-help", "Productivity", "Non-fiction"],
    status: "Finished",
    pagesRead: 320,
    totalPages: 320,
    progressPercent: 100,
    description: "An insightful guide on how small changes can lead to remarkable results in personal and professional life.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    id: 5,
    bookName: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: ["Fantasy", "Adventure", "Young Adult"],
    status: "Reading",
    pagesRead: 90,
    totalPages: 223,
    progressPercent: 40,
    description: "The first book in the beloved Harry Potter series, introducing readers to the magical world of Hogwarts.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg",
  },
  {
    id: 6,
    bookName: "The Alchemist",
    author: "Paulo Coelho",
    genre: ["Fiction", "Philosophical", "Adventure"],
    status: "To be Read",
    pagesRead: 0,
    totalPages: 208,
    progressPercent: 0,
    description: "A powerful story of self-discovery and the pursuit of spiritual enlightenment.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg",
  },
  {
    id: 7,
    bookName: "A Good Girl's Guide to Murder",
    author: "Holly Jackson",
    genre: ["Mystery", "Thriller", "Young Adult"],
    status: "To be Read",
    pagesRead: 0,
    totalPages: 433,
    progressPercent: 0,
    description: "A gripping mystery novel that follows a young girl's investigation into a murder case.",
    coverImage: "https://upload.wikimedia.org/wikipedia/en/e/e2/A_Good_Girl%27s_Guide_to_Murder.jpg",
  },
  {
    id: 8,
    bookName: "The Silent Patient",
    author: "Alex Michaelides",
    genre: ["Psychological Thriller", "Mystery"],
    status: "to buy",
    pagesRead: 0,
    totalPages: 336,
    progressPercent: 0,
    description: "A gripping psychological thriller that follows a woman's investigation into a missing woman's case.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81JJPDNlxSL.jpg",
  },
];

const navigate = useNavigate();

  return (
    <>
    <div className="overflow-x-hidden text-white mx-32 min-h-screen relative w-full flex flex-col gap-10 overflow-hidden">
      {/* Background Image */}
      {/* <img src='/buttonBg.png' className='pointer-events-none opacity-40 absolute inset-0 w-full h-full object-cover z-0' /> */}

      <div className="flex gap-3 px-4 py-4">
        <h2>Some more books like <span className="italic text-lg text-zinc-400 mb-24">{similarTo}</span></h2>
      </div>
      {/* Book Details Section */}
      <div className="flex justify-between">
      
        <div className="relative z-10 w-1/2 px-4 text-white">
          <h1 className="text-5xl text-[#ffba66] mb-2 font-extrabold transition-all duration-300">
            {booksData[activeIndex].bookName}
          </h1>
          <p className="text-white font-bold text-xl opacity-80">{booksData[activeIndex].author}</p>
          <p className="text-md opacity-70 text-white font-semibold mt-4">{booksData[activeIndex].description.slice(0, 60)} <span className="text-[#ffba66] hover:text-[#ffba66]">...read more</span></p>
        </div>

        <div className="w-1/2 my-10 text-[#ffba66] h-3 flex mx-auto justify-end pr-44 items-center gap-16 z-20">
          <FaArrowLeft 
            className="cursor-pointer hover:scale-125 transition-transform" 
            onClick={prevSlide} 
            size={36}
          />
          <FaArrowRight 
            className="cursor-pointer hover:scale-125 transition-transform" 
            onClick={nextSlide} 
            size={36}
          />
        </div>
      </div>
      {/* 2. THE SLIDER CONTAINER */}
      <div 
        ref={sliderRef} 
        className="z-10 mt-12 relative flex w-full h-[390px] gap-8 px-[40%] overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide items-center rounded-md overflow-y-visible"
        style={{ scrollPadding: "0 40%" }} // Keeps active item centered
      >
        {booksData.map((book, index) => (
          <div
            key={book.id}
            className="snap-center shrink-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out"
            style={{ perspective: "1000px" }} // Adds depth for the scale effect
          >
            <img
              src={book.coverImage}
              alt={book.bookName}
              className={`rounded-md shadow-2xl transition-all duration-500 ease-in-out object-cover
                ${index === activeIndex 
                  ? "w-[240px] h-[350px] scale-110 rotate-0 opacity-100 z-50" 
                  : "w-[150px] h-[220px] scale-90 opacity-50 grayscale-[50%]"
                }`}
            />
          </div>
        ))}
      </div>

      
    </div>
    <Footer />
    </>
  );
};

export default Suggest;