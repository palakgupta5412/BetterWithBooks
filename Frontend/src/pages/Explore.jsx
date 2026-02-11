import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { searchBooks, addToShelf } from '../api/books.service'; // Make sure this path is correct!
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext'; // <--- Import the Toaster Hook

const Explore = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  
  const navigate = useNavigate();
  const { addToast } = useToast(); // <--- Initialize the Toaster

  // --- Helper to fetch books (Used by Search & Pagination) ---
  const fetchBooks = async (searchQuery, pageNum) => {
      if (!searchQuery.trim()) return;
      
      setLoading(true);
      setError("");
      if (pageNum === 1) setBooks([]); // Clear grid on new search

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
                  // FIX: Force HTTPS
                  coverImage: book.coverImage?.replace("http://", "https://") || "https://placehold.co/128x196?text=No+Cover",
                  description: book.description,
                  pageCount: book.pageCount,
                  categories: book.categories,
                  status: "To be Read" 
              }));
              setBooks(cleanBooks);
          }
      } catch (err) {
          console.error("Search Error:", err);
          setError("Failed to fetch books.");
          addToast("Failed to fetch books. Try again.", "error"); // Toast error
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
          // Map UI Status to Backend 'shelf' codes
          let shelfCode = "tbr";
          if (uiStatus === "Reading") shelfCode = "reading";
          if (uiStatus === "Finished") shelfCode = "finished";

          const payload = {
            googleBookId: book.googleId,
            shelf: shelfCode
          };

          await addToShelf(payload);
          
          // SUCCESS TOAST
          addToast(`Added "${book.bookName}" to ${uiStatus}!`, "success");

      } catch (err) {
          console.error(err);
          // ERROR TOAST
          addToast("Could not add book. Are you logged in?", "error");
      }
  };

  return (
    <div className="flex min-h-screen bg-[#1a0f0e] text-[#D8CFC4] font-sans">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10 overflow-y-auto h-screen scrollbar-hide">
        
        {/* HEADER */}
        <div className="flex flex-col gap-6 mb-12">
            <div>
                <h1 className="font-playfair text-4xl font-bold text-[#ffba66] mb-2">Explore</h1>
                <p className="opacity-70 text-sm">Find new books to add to your collection.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-4 w-full max-w-3xl">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-[#ffba66] transition-colors shadow-inner">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search title, author, isbn..." 
                        className="bg-transparent w-full outline-none text-white placeholder-gray-500 font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <Button 
                    text={loading ? "Searching..." : "Search"} 
                    className="bg-[#ffba66] text-black font-bold px-8 rounded-xl hover:bg-[#dda200] shadow-lg shadow-[#ffba66]/20"
                />
            </form>
        </div>

        {/* ERROR MESSAGE */}
        {error && <div className="text-red-400 mb-6 bg-red-900/20 p-4 rounded-lg border border-red-500/20">{error}</div>}

        {/* BOOK GRID */}
        <div id="book-grid" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
            {books.map((book) => (
                <div key={book.googleId} className="flex flex-col items-center group relative">
                    {/* Title */}
                    <p className="opacity-0 group-hover:opacity-100 text-[11px] mb-1 text-center font-medium line-clamp-1 w-full text-[#ffba66] transition-opacity">
                        {book.bookName}
                    </p>
                    
                    {/* Cover Image Container */}
                    <div className="w-[120px] h-[170px] rounded-md overflow-hidden shadow-lg shadow-black/50 group-hover:scale-105 transition-transform duration-300 border border-white/5 relative">
                         <img
                            onClick={() => navigate('/info', { state: { book } })} 
                            src={book.coverImage}
                            alt={book.bookName}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://placehold.co/120x170?text=No+Cover" }}
                        />
                        
                        {/* Hover Overlay Buttons */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleAdd(book, "To be Read"); }}
                                className="text-[10px] font-bold bg-[#ffba66] text-black px-2 py-1 rounded hover:bg-white w-full"
                            >
                                + TBR
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleAdd(book, "Reading"); }}
                                className="text-[10px] font-bold border border-white text-white px-2 py-1 rounded hover:bg-white hover:text-black w-full"
                            >
                                + Reading
                            </button>
                            <button 
                                onClick={() => navigate('/info', { state: { book } })} 
                                className="text-[10px] text-gray-400 hover:text-white mt-1 underline"
                            >
                                View Details
                            </button>
                        </div>
                    </div>

                    {/* Author Label */}
                    <p className="text-[10px] mt-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-1">
                        {book.author}
                    </p>
                </div>
            ))}
        </div>

        {/* PAGINATION CONTROLS */}
        {books.length > 0 && (
            <div className="w-full flex justify-center items-center gap-6 mt-16 mb-8">
                <button 
                    onClick={handlePrevPage}
                    disabled={page === 1 || loading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full border border-[#ffba66] text-[#ffba66] font-bold transition-all
                        ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#ffba66] hover:text-black'}
                    `}
                >
                    <FaArrowLeft /> Previous
                </button>
                
                <span className="text-[#D8CFC4] font-playfair italic">Page {page}</span>

                <button 
                    onClick={handleNextPage}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#ffba66] text-black font-bold hover:bg-[#dda200] transition-all"
                >
                    Next <FaArrowRight />
                </button>
            </div>
        )}

        {/* EMPTY STATE */}
        {!loading && books.length === 0 && !error && (
            <div className="w-full h-[50vh] flex flex-col justify-center items-center text-gray-600 opacity-50 gap-4">
                <FaSearch size={40} />
                <p className="text-xl font-playfair">Search to find your next read...</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default Explore;