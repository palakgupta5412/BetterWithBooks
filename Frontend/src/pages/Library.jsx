import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRight, MdOutlineArrowDropDown } from "react-icons/md";
import { FaArrowLeft, FaEllipsisV, FaCheck, FaBookOpen, FaListUl, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { getMyShelf, addToShelf, removeBook } from "../api/books.service";
import { useToast } from "../context/ToastContext";

const BookCard = ({ book, onMove, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Calculate Progress for the badge
  const progressPercent = Math.round((book.pagesRead / (book.totalPages || 1)) * 100) || 0;

  return (
    <div className="min-w-[110px] flex flex-col items-center group relative">
      
      {/* Title (Hover) */}
      <p className="opacity-0 group-hover:opacity-100 text-[11px] mt-2 text-center font-medium line-clamp-1 w-[110px] text-[#ffba66] transition-opacity">
        {book.bookName}
      </p>
      
      {/* Author (Hover) */}
      <p className="opacity-0 group-hover:opacity-70 text-[10px] mb-1 line-clamp-1 text-gray-400">{book.author}</p>
      
      {/* Progress Badge (Only if Reading) */}
      {book.status === "Reading" && (
        <div className="absolute text-[10px] font-bold text-[#ffba66] opacity-0 group-hover:opacity-100 -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded-full z-20">
            {progressPercent}% read
        </div>
      )}

      {/* Cover Image Container */}
      <div className="w-[130px] h-[190px] rounded-md overflow-hidden shadow-md group-hover:scale-[1.03] transition relative">
        <img
          onClick={() => navigate('/info', { state: { book } })}
          src={book.coverImage || "https://placehold.co/128x196?text=No+Cover"}
          alt={book.bookName}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* --- NEW: Discreet Context Menu (3 Dots) --- */}
        <button 
             onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
             className="absolute top-1 right-1 text-white bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-[#ffba66] hover:text-black transition-all z-30"
        >
            <FaEllipsisV size={12} />
        </button>

        {/* The Menu Dropdown */}
        {showMenu && (
            <div className="absolute top-6 -right-4 w-28 bg-[#1a0f0e] border border-[#ffba66]/30 rounded shadow-xl z-50 flex flex-col text-[6px]">
                <button onClick={() => { onMove(book, 'reading'); setShowMenu(false); }} className="px-2 py-1.5 text-left hover:bg-[#ffba66] hover:text-black flex gap-2 items-center"><FaBookOpen/> Reading</button>
                <button onClick={() => { onMove(book, 'tbr'); setShowMenu(false); }} className="px-2 py-1.5 text-left hover:bg-[#ffba66] hover:text-black flex gap-2 items-center"><FaListUl/> TBR</button>
                <button onClick={() => { onMove(book, 'finished'); setShowMenu(false); }} className="px-2 py-1.5 text-left hover:bg-[#ffba66] hover:text-black flex gap-2 items-center"><FaCheck/> Finish</button>
                <div className="h-[1px] bg-white/10"></div>
                <button onClick={() => { onDelete(book); setShowMenu(false); }} className="px-2 py-1.5 text-left text-red-400 hover:bg-red-900/30 flex gap-2 items-center"><FaTrash/> Remove</button>
            </div>
        )}
      </div>
    </div>
  );
};

const BookShelf = ({ title, books, onMove, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!books || books.length === 0) return null;

  return (
    <div className="w-full mb-10 transition-all duration-500">
      {/* Heading */}
      <div className="w-full flex justify-between items-center mb-3 px-2 border-b border-white/5 pb-2">
        <h2 className="font-playfair text-xl font-semibold text-[#ffba66] flex items-center gap-2">
            {title} 
            <span className="text-white/20 text-xs font-sans mt-1">({books.length})</span>
        </h2>
        
        {/* FIX 2: Functional Full Shelf Button */}
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1 hover:text-[#ffba66] transition cursor-pointer"
        >
            {isExpanded ? "Collapse" : "Full shelf"} 
            {isExpanded ? <MdOutlineArrowDropDown size={16}/> : <MdOutlineArrowRight size={16}/>}
        </button>
      </div>

      {/* Shelf Content */}
      <div className="relative w-full min-h-[190px]">
        
        {/* LOGIC: If Expanded -> Grid View. If Collapsed -> Scroll View */}
        <div className={`
            ${isExpanded 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6 px-2 pb-4" 
                : "flex gap-6 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide items-start"}
            transition-all duration-500
        `}>
            {books.map((b) => (
                <BookCard 
                    key={b.googleBookId || b._id} 
                    book={b} 
                    onMove={onMove}
                    onDelete={onDelete}
                />
            ))}
        </div>

        {/* Wooden Plank (Only show if NOT expanded, for the scrolling look) */}
        {!isExpanded && (
            <div className="absolute bottom-3 left-0 w-full h-[12px] bg-[#ffc983f3] rounded-md shadow-[0px_4px_6px_rgba(0,0,0,0.5)] border-t border-[#ffdca8] -z-10"></div>
        )}
      </div>
    </div>
  );
};

const Library = () => {
  const [statusFilter, setStatusFilter] = useState("All Genres");
  const [allBooks, setAllBooks] = useState([]); // Stores fetched books
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  // --- FETCH DATA FROM BACKEND ---
  const fetchLibrary = async () => {
    try {
      const response = await getMyShelf();
      const data = response.data; // { tbr: [], reading: [], finished: [] }
      
      // Flatten the data into a single array for easier filtering
      // We add a 'status' property manually to match your UI logic
      const combined = [
          ...(data.reading || []).map(b => ({ ...b, status: "Reading" })),
          ...(data.tbr || []).map(b => ({ ...b, status: "To be Read" })),
          ...(data.finished || []).map(b => ({ ...b, status: "Finished" }))
      ];
      
      setAllBooks(combined);
    } catch (err) {
      console.error(err);
      addToast("Could not load library", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  // --- HANDLERS ---
  const handleMove = async (book, targetStatus) => {
      try {
          const payload = {
            googleBookId: book.googleBookId || book.googleBooksId,
            shelf: targetStatus, // 'tbr', 'reading', 'finished'
            bookName: book.bookName,
            author: book.author,
            coverImage: book.coverImage,
            totalPages: book.totalPages
          };
          await addToShelf(payload);
          addToast("Moved book!", "success");
          fetchLibrary(); // Refresh UI
      } catch (err) {
          addToast("Failed to move", "error");
      }
  };

  const handleDelete = async (book) => {
      if(!confirm("Remove from library?")) return;
      try {
          await removeBook(book.googleBookId || book.googleBooksId);
          addToast("Removed book", "info");
          fetchLibrary();
      } catch(err) {
          addToast("Failed to remove", "error");
      }
  };

  // --- FILTERING LOGIC (Using Dynamic Data) ---
  const grouped = useMemo(() => {
    // 1. Basic Status Filter
    const reading = allBooks.filter((b) => b.status === "Reading");
    const tbr = allBooks.filter((b) => b.status === "To be Read");
    const finished = allBooks.filter((b) => b.status === "Finished");

    // 2. Safe Category Check Helper
    // Returns books that have 'categories' AND match the search string
    const filterByGenre = (genre) => allBooks.filter(b => 
        b.categories && 
        Array.isArray(b.categories) && 
        b.categories.some(cat => cat.toLowerCase().includes(genre.toLowerCase()))
    );
    return { 
        reading, tbr, finished, 
        // We map these keys to match the <option> values in the dropdown
        romance: filterByGenre("romance"), 
        thriller: filterByGenre("thriller"),
        historical: filterByGenre("history"), // Google often uses "History" or "Historical Fiction"
        fantasy: filterByGenre("fantasy"),
        scifi: filterByGenre("science"), // Matches "Science Fiction"
        nonfiction: filterByGenre("nonfiction"), // Matches "Nonfiction"
        selfhelp: filterByGenre("self-help"), 
        mystery: filterByGenre("mystery")
    };
  }, [allBooks]);

  return (
    <div className="font-sans text-[#D8CFC4] w-full min-h-screen flex bg-[#1a0f0e]">
      {/* Background Image Overlay */}
      <div className="fixed inset-0 z-0 bg-[url('/tbrBg.png')] bg-cover bg-no-repeat opacity-100"></div>
      
      <Sidebar />

      <div className="relative z-10 scroll-y-auto h-screen overflow-scroll overflow-x-hidden flex-1 p-6 scrollbar-hide">
        
        {/* Top Controls */}
        <div className="w-full flex justify-between items-center mb-8">
          <div className="flex gap-4 items-center">
            <button onClick={()=>navigate(-1)} className="p-2 bg-black/20 hover:bg-black/50 rounded-full transition">
                 <FaArrowLeft className="text-xl" />
            </button>
            <div>  
              <h1 className="font-playfair text-3xl font-bold text-[#ffba66]">My Shelves</h1>
              <p className="opacity-70 text-sm">Organize your reads beautifully ✨</p>
            </div>
          </div>

        </div>

        {/* Shelves Content */}
        {loading ? (
            <div className="text-center mt-20 opacity-50">Dusting the shelves...</div>
        ) : (
            <div className="w-full bg-transparent rounded-2xl p-2 flex flex-col gap-6">
            
            {/* Show specific shelves based on filter */}
            {(statusFilter === "All Genres" || statusFilter === "Reading") && (
                <BookShelf title="Currently reading" books={grouped.reading} onMove={handleMove} onDelete={handleDelete} />
            )}

            {(statusFilter === "All Genres" || statusFilter === "To be Read") && (
                <BookShelf title="Next up" books={grouped.tbr} onMove={handleMove} onDelete={handleDelete} />
            )}

            {(statusFilter === "All Genres" || statusFilter === "Finished") && (
                <BookShelf title="Finished" books={grouped.finished} onMove={handleMove} onDelete={handleDelete} />
            )}

            {/* Genre Shelves (Only show if selected) */}
            {statusFilter === "Romance" && <BookShelf title="Romance" books={grouped.romance} onMove={handleMove} onDelete={handleDelete} />}
            {statusFilter === "Thriller" && <BookShelf title="Thriller" books={grouped.thriller} onMove={handleMove} onDelete={handleDelete} />}
            {statusFilter === "Fantasy" && <BookShelf title="Fantasy" books={grouped.fantasy} onMove={handleMove} onDelete={handleDelete} />}
            {/* Add other genre conditions here... */}
            
            </div>
        )}
      </div>
    </div>
  );
};

export default Library;