import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaArrowLeft, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import { searchBooks, addToShelf } from '../api/books.service'; 
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext'; 
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Explore = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Mobile State
  
  const navigate = useNavigate();
  const { addToast } = useToast(); 

  const location = useLocation(); // Hook to get data sent from Home

  // --- ADD THIS USEEFFECT ---
  useEffect(() => {
      // Check if Home sent a search query
      if (location.state && location.state.autoSearch) {
          const searchTerm = location.state.autoSearch;
          setQuery(searchTerm); // Fill the input box
          fetchBooks(searchTerm, 1); // Trigger the API call immediately
          
          // Optional: Clean up state so it doesn't research on refresh
          window.history.replaceState({}, document.title);
      }
  }, [location.state]); // Runs once when page loads

  const fetchBooks = async (searchQuery, pageNum) => {
      if (!searchQuery.trim()) return;
      setLoading(true);
      setError("");
      if (pageNum === 1) setBooks([]); 

      try {
          const response = await searchBooks(searchQuery, pageNum);
          const rawBooks = response.data || [];
          if (rawBooks.length === 0) {
              if (pageNum === 1) setError("No books found.");
          } else {
              const cleanBooks = rawBooks.map(book => ({
                  googleId: book.googleId,
                  bookName: book.title,
                  author: Array.isArray(book.authors) ? book.authors.join(", ") : book.authors,
                  coverImage: book.coverImage?.replace("http://", "https://") || "https://placehold.co/128x196?text=No+Cover",
                  description: book.description,
                  pageCount: book.pageCount,
                  categories: book.categories,
                  status: "To be Read" 
              }));
              setBooks(cleanBooks);
          }
      } catch (err) {
          setError("Failed to fetch books.");
      } finally {
          setLoading(false);
      }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks(query, 1);
  };

  const handleNextPage = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBooks(query, nextPage);
      document.getElementById('book-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrevPage = () => {
      if (page > 1) {
          const prevPage = page - 1;
          setPage(prevPage);
          fetchBooks(query, prevPage);
          document.getElementById('book-grid')?.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const handleAdd = async (book, uiStatus) => {
      try {
          let shelfCode = "tbr";
          if (uiStatus === "Reading") shelfCode = "reading";
          if (uiStatus === "Finished") shelfCode = "finished";

          const payload = {
            googleBookId: book.googleId,
            shelf: shelfCode,
            bookName: book.bookName,      
            author: book.author,          
            coverImage: book.coverImage,  
            totalPages: book.pageCount    
          };

          await addToShelf(payload);
          addToast(`Added "${book.bookName}" to ${uiStatus}!`, "success");
      } catch (err) {
          addToast("Could not add book.", "error");
      }
  };

  return (
    // PARENT CONTAINER: Use 'flex' to put Sidebar and Content side-by-side
    <div className="flex w-full h-screen bg-[#1a0f0e] text-[#D8CFC4] font-sans overflow-hidden relative">
      
      {/* --- 1. DESKTOP SIDEBAR --- */}
      {/* Hidden on mobile (md:block). Relative positioning ensures it takes real space in the flex container */}
      <div className="hidden md:block h-full shrink-0 relative z-20">
          <Sidebar />
      </div>

      {/* --- 2. MOBILE SIDEBAR (Overlay) --- */}
      {/* Only shows when isMobileSidebarOpen is true */}
      {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 md:hidden flex">
              <div className="w-64 h-full bg-[#1a0f0e] shadow-2xl relative animate-slide-in">
                  <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white text-xl z-50"
                  >
                      <FaTimes />
                  </button>
                  <Sidebar />
              </div>
              {/* Clicking outside closes menu */}
              <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)}></div>
          </div>
      )}

      {/* --- 3. MAIN CONTENT AREA --- */}
      {/* flex-1 makes it fill the rest of the screen */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden scrollbar-hide relative p-4 md:p-8">
        
        {/* MOBILE MENU ICON (Top Left) */}
        <div className="md:hidden flex items-center justify-between mb-6">
            <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 bg-white/5 rounded-lg text-[#ffba66] hover:bg-white/10"
            >
                <FaBars size={24} />
            </button>
            <h1 className="text-xl font-playfair font-bold text-[#ffba66]">Explore</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* HEADER (Desktop: Title + Search Row) */}
        <div className="flex flex-col gap-6 mb-12 items-start justify-between">
            <div className="hidden md:block">
                <h1 className="font-playfair text-4xl font-bold text-[#ffba66] mb-2">Explore</h1>
                <p className="opacity-70 text-sm">Find new books for your shelf.</p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex  gap-2 w-full">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-[#ffba66] transition-colors shadow-inner">
                    <FaSearch className="text-gray-400 mr-3 shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Search books..." 
                        className="bg-transparent w-full outline-none text-white placeholder-gray-500 font-medium text-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <Button 
                    text={loading ? "..." : "Go"} 
                    className="bg-[#ffba66] text-black font-bold px-6 rounded-xl hover:bg-[#dda200]"
                />
            </form>
        </div>

        {/* ERROR */}
        {error && <div className="text-red-400 mb-6 bg-red-900/20 p-4 rounded-lg text-center text-sm">{error}</div>}

        {/* BOOK GRID */}
        <div id="book-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
            {books.map((book) => (
                <div key={book.googleId} className="flex flex-col items-center group relative w-full">
                    {/* Cover */}
                    <div className="w-full aspect-[2/3] max-w-[140px] rounded-md overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border border-white/5 relative bg-[#2a1b18]">
                        <img
                            onClick={() => navigate('/info', { state: { book } })} 
                            src={book.coverImage}
                            alt={book.bookName}
                            className="w-full h-full object-cover cursor-pointer"
                        />
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-3">
                            <button onClick={(e) => { e.stopPropagation(); handleAdd(book, "To be Read"); }} className="text-[10px] font-bold bg-[#ffba66] text-black px-2 py-2 rounded w-full">+ TBR</button>
                            <button onClick={(e) => { e.stopPropagation(); handleAdd(book, "Reading"); }} className="text-[10px] font-bold border border-white text-white px-2 py-2 rounded w-full">+ Read</button>
                        </div>
                    </div>
                    {/* Title */}
                    <p className="text-xs font-bold text-white mt-3 text-center line-clamp-1 w-full">{book.bookName}</p>
                    <p className="text-[10px] text-gray-500 text-center line-clamp-1 w-full">{book.author}</p>
                </div>
            ))}
        </div>

        {/* PAGINATION */}
        {books.length > 0 && (
            <div className="flex justify-center items-center gap-6 mt-16 mb-20">
                <button onClick={handlePrevPage} disabled={page === 1 || loading} className="text-[#ffba66] disabled:opacity-30"><FaArrowLeft size={20}/></button>
                <span className="text-[#D8CFC4] font-playfair italic">Page {page}</span>
                <button onClick={handleNextPage} disabled={loading} className="text-[#ffba66]"><FaArrowRight size={20}/></button>
            </div>
        )}

        {/* EMPTY STATE */}
        {!loading && books.length === 0 && !error && (
            <div className="w-full h-[50vh] flex flex-col justify-center items-center text-gray-600 opacity-50 gap-4">
                <FaSearch size={30} />
                <p className="font-playfair">Start your search...</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default Explore;