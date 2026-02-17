import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRight, MdOutlineArrowDropDown } from "react-icons/md";
import { FaArrowLeft, FaEllipsisV, FaCheck, FaBookOpen, FaListUl, FaTrash, FaBars } from "react-icons/fa"; // Added FaBars
import Sidebar from "../components/Sidebar";
import { getMyShelf, addToShelf, removeBook } from "../api/books.service";
import { useToast } from "../context/ToastContext";

const BookCard = ({ book, onMove, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Calculate Progress for the badge
  const progressPercent = Math.round((book.pagesRead / (book.totalPages || 1)) * 100) || 0;

  return (
    <div className="w-full flex flex-col items-center group relative">
      
      {/* Title (Hover) - Hidden on mobile touch, visible on desktop hover */}
      <p className="opacity-0 group-hover:opacity-100 text-[11px] mt-2 text-center font-medium line-clamp-1 w-full text-[#ffba66] transition-opacity absolute -bottom-6 z-20 bg-black/80 px-1 rounded hidden md:block">
        {book.bookName}
      </p>
      
      {/* Progress Badge (Only if Reading) */}
      {book.status === "Reading" && (
        <div className="absolute text-[10px] font-bold text-[#ffba66] opacity-100 md:opacity-0 group-hover:opacity-100 -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded-full z-20 pointer-events-none">
            {progressPercent}%
        </div>
      )}

      {/* Cover Image Container */}
      <div className="w-full aspect-[2/3] rounded-md overflow-hidden shadow-md group-hover:scale-[1.03] transition relative">
        <img
          onClick={() => navigate('/info', { state: { book } })}
          src={book.coverImage || "https://placehold.co/128x196?text=No+Cover"}
          alt={book.bookName}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* --- Context Menu Button (3 Dots) --- */}
        <button 
             onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
             className="absolute top-1 right-1 text-white bg-black/50 rounded-full p-1.5 md:p-1 md:opacity-0 group-hover:opacity-100 hover:bg-[#ffba66] hover:text-black transition-all z-30"
        >
            <FaEllipsisV size={12} />
        </button>

        {/* The Menu Dropdown */}
        {showMenu && (
            <div className="absolute top-8 right-2 w-32 bg-[#1a0f0e] border border-[#ffba66]/30 rounded shadow-xl z-50 flex flex-col text-xs">
                {/* Backdrop to close menu when clicking outside (mobile friendly) */}
                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
                
                <div className="relative z-50 flex flex-col">
                    <button onClick={(e) => { e.stopPropagation(); onMove(book, 'reading'); setShowMenu(false); }} className="px-3 py-2 text-left hover:bg-[#ffba66] hover:text-black flex gap-2 items-center"><FaBookOpen size={10}/> Reading</button>
                    <button onClick={(e) => { e.stopPropagation(); onMove(book, 'tbr'); setShowMenu(false); }} className="px-3 py-2 text-left hover:bg-[#ffba66] hover:text-black flex gap-2 items-center"><FaListUl size={10}/> TBR</button>
                    <button onClick={(e) => { e.stopPropagation(); onMove(book, 'finished'); setShowMenu(false); }} className="px-3 py-2 text-left hover:bg-[#ffba66] hover:text-black flex gap-2 items-center"><FaCheck size={10}/> Finish</button>
                    <div className="h-[1px] bg-white/10 my-1"></div>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(book); setShowMenu(false); }} className="px-3 py-2 text-left text-red-400 hover:bg-red-900/30 flex gap-2 items-center"><FaTrash size={10}/> Remove</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const BookShelfFixed = ({ title, books, onMove, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!books || books.length === 0) return null;

  return (
    <div className="w-full mb-8 md:mb-10 transition-all duration-500">
      {/* Heading */}
      <div className="w-full flex justify-between items-center mb-3 px-2 border-b border-white/5 pb-2">
        <h2 className="font-playfair text-lg md:text-xl font-semibold text-[#ffba66] flex items-center gap-2">
            {title} 
            <span className="text-white/20 text-xs font-sans mt-1">({books.length})</span>
        </h2>
        
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
                // Grid: 2 cols on mobile, 3 on sm, 4 on md, 6 on lg
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 px-2 pb-4" 
                // Scroll: Flex row
                : "flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide items-start"}
            transition-all duration-500
        `}>
            {books.map((b) => (
                // Wrapper div for scroll view to keep width consistent
                <div key={b.googleBookId || b._id} className={isExpanded ? "w-full" : "min-w-[100px] w-[100px] md:min-w-[130px] md:w-[130px]"}>
                    <BookCard 
                        book={b} 
                        onMove={onMove}
                        onDelete={onDelete}
                    />
                </div>
            ))}
        </div>

        {/* Wooden Plank (Only show if NOT expanded) */}
        {!isExpanded && (
            <div className="absolute bottom-3 left-0 w-full h-[8px] md:h-[12px] bg-[#ffc983f3] rounded-md shadow-[0px_4px_6px_rgba(0,0,0,0.5)] border-t border-[#ffdca8] -z-10"></div>
        )}
      </div>
    </div>
  );
};

const Library = () => {
  const [statusFilter, setStatusFilter] = useState("All Genres");
  const [allBooks, setAllBooks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false); // <--- New State
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  // --- FETCH DATA FROM BACKEND ---
  const fetchLibrary = async () => {
    try {
      const response = await getMyShelf();
      const data = response.data; 
      
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
      const payload = {
            googleBookId: book.googleBookId || book.googleBooksId,
            shelf: targetStatus, 
            bookName: book.bookName,
            author: book.author,
            coverImage: book.coverImage,
            totalPages: book.totalPages
      };
      
      try {
          await addToShelf(payload);
          addToast("Moved book!", "success");
          fetchLibrary(); 
      } catch (err) {
          addToast("Failed to move", "error");
      }
  };

  const handleDelete = async (book) => {
      if(!window.confirm("Remove from library?")) return;
      try {
          await removeBook(book.googleBookId || book.googleBooksId);
          addToast("Removed book", "info");
          fetchLibrary();
      } catch(err) {
          addToast("Failed to remove", "error");
      }
  };

  // --- FILTERING LOGIC ---
  const grouped = useMemo(() => {
    const reading = allBooks.filter((b) => b.status === "Reading");
    const tbr = allBooks.filter((b) => b.status === "To be Read");
    const finished = allBooks.filter((b) => b.status === "Finished");

    const filterByGenre = (genre) => allBooks.filter(b => 
        b.categories && 
        Array.isArray(b.categories) && 
        b.categories.some(cat => cat.toLowerCase().includes(genre.toLowerCase()))
    );
    return { 
        reading, tbr, finished, 
        romance: filterByGenre("romance"), 
        thriller: filterByGenre("thriller"),
        historical: filterByGenre("history"), 
        fantasy: filterByGenre("fantasy"),
        scifi: filterByGenre("science"), 
        nonfiction: filterByGenre("nonfiction"), 
        selfhelp: filterByGenre("self-help"), 
        mystery: filterByGenre("mystery")
    };
  }, [allBooks]);

  return (
    <div className="font-sans text-[#D8CFC4] w-full min-h-screen flex bg-[#1a0f0e] overflow-hidden">
      {/* Background Image Overlay */}
      <div className="fixed inset-0 z-0 bg-[url('/tbrBg.png')] bg-cover bg-no-repeat opacity-100 pointer-events-none"></div>
      
      {/* 1. DESKTOP SIDEBAR (Visible on md and up) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* 2. MOBILE SIDEBAR (Drawer) */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 bg-black/80 flex md:hidden" onClick={() => setShowMobileSidebar(false)}>
            <div className="w-64 h-full bg-[#1a0f0e] border-r border-[#ffba66]/20 shadow-2xl animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
                <Sidebar />
            </div>
        </div>
      )}

      <div className="relative z-10 flex-1 h-screen overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-hide">
        
        {/* Top Controls */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div className="flex gap-4 items-center w-full">
            
            

            <button onClick={()=>navigate(-1)} className="p-2 bg-black/20 hover:bg-black/50 rounded-full transition shrink-0">
                 <FaArrowLeft className="text-lg md:text-xl" />
            </button>
            <div>  
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#ffba66]">My Shelves</h1>
              <p className="opacity-70 text-xs md:text-sm">Organize your reads beautifully ✨</p>
            </div>

            {/* 3. MENU BUTTON (Visible only on Mobile) */}
            <button 
                onClick={() => setShowMobileSidebar(true)} 
                className="md:hidden p-2 text-[#ffba66] hover:bg-white/5 rounded-full"
            >
                <FaBars size={24} />
            </button>
          </div>
        </div>

        {/* Shelves Content */}
        {loading ? (
            <div className="flex justify-center items-center h-64 opacity-50">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#ffba66]"></div>
            </div>
        ) : (
            <div className="w-full bg-transparent rounded-2xl p-0 md:p-2 flex flex-col gap-4 md:gap-6 pb-20">
            
            {/* Show specific shelves based on filter */}
            {(statusFilter === "All Genres" || statusFilter === "Reading") && (
                <BookShelfFixed title="Currently reading" books={grouped.reading} onMove={handleMove} onDelete={handleDelete} />
            )}

            {(statusFilter === "All Genres" || statusFilter === "To be Read") && (
                <BookShelfFixed title="Next up" books={grouped.tbr} onMove={handleMove} onDelete={handleDelete} />
            )}

            {(statusFilter === "All Genres" || statusFilter === "Finished") && (
                <BookShelfFixed title="Finished" books={grouped.finished} onMove={handleMove} onDelete={handleDelete} />
            )}

            {/* Genre Shelves (Only show if selected) */}
            {statusFilter === "Romance" && <BookShelfFixed title="Romance" books={grouped.romance} onMove={handleMove} onDelete={handleDelete} />}
            {statusFilter === "Thriller" && <BookShelfFixed title="Thriller" books={grouped.thriller} onMove={handleMove} onDelete={handleDelete} />}
            {statusFilter === "Fantasy" && <BookShelfFixed title="Fantasy" books={grouped.fantasy} onMove={handleMove} onDelete={handleDelete} />}
            
            {/* Empty State */}
            {allBooks.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <p>Your library is empty.</p>
                    <button onClick={() => navigate('/explore')} className="mt-4 text-[#ffba66] underline">Go explore books!</button>
                </div>
            )}
            
            </div>
        )}
      </div>
    </div>
  );
};

export default Library;