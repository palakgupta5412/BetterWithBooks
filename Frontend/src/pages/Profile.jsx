import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import useNavigate
import { useAuth } from '../context/AuthContext';
import { getMyShelf, updateBookProgress, removeBook } from '../api/books.service'; 
import { useToast } from '../context/ToastContext';
import { FaSignOutAlt, FaCog, FaTrash, FaArrowLeft } from "react-icons/fa"; // <--- 2. Import Arrow Icon
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';

const Profile = () => {
  const navigate = useNavigate(); // <--- 3. Initialize Hook
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  
  const [reading, setReading] = useState([]);
  const [tbr, setTbr] = useState([]);
  const [finished, setFinished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyShelf(); 
        const allBooks = data.data || {}; 
        
        setReading(allBooks.reading || []);
        setTbr(allBooks.tbr || []);
        setFinished(allBooks.finished || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProgress = async (book, newPage) => {
    const bookId = book.googleBookId || book.googleBooksId || book._id;
    if (!bookId) return addToast("Error: Book ID missing", "error");

    let validPage = newPage;
    if (validPage > book.totalPages) validPage = book.totalPages; 
    if (validPage < 0) validPage = 0;

    try {
        await updateBookProgress(bookId, validPage);
        setReading(prev => prev.map(b => 
            (b.googleBookId === bookId || b.googleBooksId === bookId) ? { ...b, pagesRead: validPage } : b
        ));
        addToast("Progress updated!", "success");
    } catch (err) {
        addToast("Failed to save progress", "error");
    }
  };

  const handleDelete = async (book) => {
    if(!window.confirm("Are you sure you want to remove this book?")) return;

    const bookId = book.googleBookId || book.googleBooksId || book._id;
    try {
        await removeBook(bookId);
        setReading(prev => prev.filter(b => 
            b.googleBookId !== bookId && b.googleBooksId !== bookId
        ));
        addToast("Book removed.", "info");
    } catch (err) {
        console.error(err);
        addToast("Failed to delete book", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1a0f0e] text-[#D8CFC4] font-sans overflow-hidden">

      {/* DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffba66] rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0f0502] to-transparent"></div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex-1 p-4 md:p-8 lg:p-16 overflow-y-auto h-screen scrollbar-hide">
        
        {/* 4. BACK BUTTON ADDED HERE */}
        <button 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center gap-2 text-sm text-[#ffba66] hover:text-white hover:underline transition-all opacity-80 hover:opacity-100"
        >
            <FaArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 border-b border-white/5 pb-8 gap-6 md:gap-0">
            <div>
                <h3 className="font-playfair italic text-[#ffba66] text-lg mb-2">The Protagonist</h3>
                <h1 className="font-gravitas text-4xl md:text-5xl lg:text-6xl text-white">
                    Hi, {user?.name?.split(' ')[0] || "Reader"}.
                </h1>
                <p className="mt-4 opacity-60 max-w-md leading-relaxed text-sm md:text-base">
                    "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                </p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
                <button onClick={() => setIsSettingOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 transition text-sm">
                    <FaCog /> Settings
                </button>
                <button onClick={logout} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 border border-red-500/20 rounded-full hover:bg-red-900/40 transition text-sm">
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-20">
            <StatCard label="To Be Read" count={tbr.length} subtitle="Stories waiting for you" delay={0.1} />
            <StatCard label="Reading Now" count={reading.length} subtitle="Worlds you are currently in" delay={0.2} active />
            <StatCard label="Finished" count={finished.length} subtitle="Journeys completed" delay={0.3} />
        </div>

        {/* CURRENTLY READING */}
        <div className="mb-20">
            <h2 className="font-playfair text-2xl md:text-3xl mb-8 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#ffba66]"></span>
                Currently Reading
            </h2>

            {reading.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center opacity-50">
                    You aren't reading anything right now. Go exploring!
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                    {reading.map((book, i) => (
                        <ProgressCard 
                            key={book.googleBookId || i} 
                            book={book} 
                            onUpdate={handleUpdateProgress} 
                            onDelete={handleDelete} 
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
      
      <ChangePasswordModal isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)} />
    </div>
  );
};

// --- SUB-COMPONENTS ---

const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeProgress * end));
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }, [end, duration]);
    return <span>{count}</span>;
};

const StatCard = ({ label, count, subtitle, active, delay }) => (
    <div className={`p-6 rounded-2xl border ${active ? 'border-[#ffba66]/30 bg-[#ffba66]/5' : 'border-white/5 bg-white/5'} backdrop-blur-sm relative overflow-hidden group`} style={{ animation: `fadeInUp 1s ease-out ${delay}s backwards` }}>
        <h2 className="text-4xl md:text-5xl font-gravitas mb-2 group-hover:scale-105 transition-transform origin-left">
            <AnimatedCounter end={count} />
        </h2>
        <h3 className={`text-base md:text-lg font-bold uppercase tracking-widest ${active ? 'text-[#ffba66]' : 'text-gray-400'}`}>{label}</h3>
        <p className="text-xs opacity-50 mt-1">{subtitle}</p>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#ffba66]/10 transition-colors"></div>
    </div>
);

const ProgressCard = ({ book, onUpdate, onDelete }) => {
    const [pageInput, setPageInput] = useState(book.pagesRead || 0);
    const percent = Math.round((pageInput / (book.totalPages || 1)) * 100) || 0;

    return (
        <div className="flex gap-4 md:gap-6 p-4 md:p-6 bg-[#0f0502] border border-white/10 rounded-xl shadow-xl hover:border-[#ffba66]/30 transition-colors group relative">
            <img 
                src={book.coverImage} 
                alt="" 
                className="w-20 h-32 md:w-24 md:h-36 object-cover rounded shadow-lg shrink-0" 
            />
            
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                    <h3 className="font-bold text-lg md:text-xl font-playfair line-clamp-1 text-white">{book.bookName}</h3>
                    <p className="text-sm opacity-60 italic">{book.author}</p>
                </div>

                <div className="mt-2 md:mt-4">
                    <div className="flex justify-between text-xs mb-1 opacity-80">
                        <span>Progress</span>
                        <span>{percent}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ffba66] transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 md:mt-4">
                    <span className="text-xs opacity-50 uppercase tracking-widest hidden sm:inline">Page</span>
                    <input 
                        type="number" 
                        value={pageInput}
                        onChange={(e) => setPageInput(Number(e.target.value))}
                        className="w-14 md:w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-center text-xs md:text-sm focus:border-[#ffba66] outline-none"
                    />
                    <span className="text-[10px] md:text-xs opacity-50 whitespace-nowrap">/ {book.totalPages}</span>
                    
                    <div className="ml-auto flex gap-2">
                        <button 
                            onClick={() => onUpdate(book, pageInput)}
                            className="text-xs bg-[#ffba66] text-black font-bold px-2 py-1 md:px-3 md:py-1 rounded hover:bg-white transition"
                        >
                            Update
                        </button>

                        <button 
                            onClick={() => onDelete(book)}
                            className="text-xs bg-red-900/30 text-red-400 border border-red-500/30 px-2 py-1 md:px-3 md:py-1 rounded hover:bg-red-600 hover:text-white transition flex items-center justify-center"
                            title="Remove book"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;