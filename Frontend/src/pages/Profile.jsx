import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getMyShelf, updateBookProgress } from '../api/books.service';
import { useToast } from '../context/ToastContext';
import { FaBookOpen, FaCheck, FaRegEdit, FaSignOutAlt, FaCog } from "react-icons/fa";
import Button from '../components/Button';
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';

const Profile = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  
  const [reading, setReading] = useState([]);
  const [tbr, setTbr] = useState([]);
  const [finished, setFinished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSettingOpen  , setIsSettingOpen] = useState(false);
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
    if (newPage > book.totalPages) newPage = book.totalPages; 
    if (newPage < 0) newPage = 0;

    try {
        await updateBookProgress(book.googleBookId, newPage);
        
        setReading(prev => prev.map(b => 
            b.googleBookId === book.googleBookId ? { ...b, pagesRead: newPage } : b
        ));
        
        addToast("Progress updated!", "success");
    } catch (err) {
        addToast("Failed to save progress", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1a0f0e] text-[#D8CFC4] font-sans overflow-hidden">
      <Sidebar />

      {/* DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffba66] rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0f0502] to-transparent"></div>
      </div>

      <div className="font-sans tracking-wider relative z-10 flex-1 p-8 md:p-16 overflow-y-auto h-screen scrollbar-hide">
        
        {/* 1. HEADER */}
        <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
            <div>
                <h3 className="font-sans italic text-[#ffba66] text-lg mb-2">Hi Reader</h3>
                <h1 className="font-titan text-5xl md:text-6xl text-white">
                     {user?.name}.
                </h1>
                <p className="mt-4 opacity-60 max-w-md leading-relaxed">
                    "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                </p>
            </div>
            
            {/* Settings & Logout */}
            <div className="flex gap-4">
                <button onClick={() => {setIsSettingOpen(true)}} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 transition text-sm">
                    <FaCog /> Settings
                </button>
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 border border-red-500/20 rounded-full hover:bg-red-900/40 transition text-sm"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>

        {/* 2. ARTISTIC STATS (Now Animated!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <StatCard label="To Be Read" count={tbr.length} subtitle="Stories waiting for you" delay={0.1} />
            <StatCard label="Reading Now" count={reading.length} subtitle="Worlds you are currently in" delay={0.2} active />
            <StatCard label="Finished" count={finished.length} subtitle="Journeys completed" delay={0.3} />
        </div>

        {/* 3. CURRENTLY READING */}
        <div className="mb-20">
            <h2 className="font-playfair text-3xl mb-8 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#ffba66]"></span>
                Currently Reading
            </h2>

            {reading.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center opacity-50">
                    You aren't reading anything right now. Go exploring!
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {reading.map((book,i) => (
                        <ProgressCard key={book.googleBookId || i} book={book} onUpdate={handleUpdateProgress} />
                    ))}
                </div>
            )}
        </div>
      </div>
      <ChangePasswordModal 
        isOpen={isSettingOpen} 
        onClose={() => setIsSettingOpen(false)} 
    />
    </div>
  );
};

// --- HELPER COMPONENTS ---

// 1. The Animation Logic
const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // This "easeOutCubic" formula makes it start fast and slow down at the end
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        setCount(Math.floor(easeProgress * end));
  
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, [end, duration]);
  
    return <span>{count}</span>;
  };

// 2. The Stat Card (Now uses AnimatedCounter)
const StatCard = ({ label, count, subtitle, active, delay }) => (
    <div 
        className={`p-6 rounded-2xl border ${active ? 'border-[#ffba66]/30 bg-[#ffba66]/5' : 'border-white/5 bg-white/5'} backdrop-blur-sm relative overflow-hidden group`}
        style={{ animation: `fadeInUp 1s ease-out ${delay}s backwards` }}
    >
        <h2 className="text-5xl font-gravitas mb-2 group-hover:scale-105 transition-transform origin-left">
            {/* HERE IS THE ANIMATION: */}
            <AnimatedCounter end={count} />
        </h2>
        <h3 className={`text-lg font-bold uppercase tracking-widest ${active ? 'text-[#ffba66]' : 'text-gray-400'}`}>{label}</h3>
        <p className="text-xs opacity-50 mt-1">{subtitle}</p>
        
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#ffba66]/10 transition-colors"></div>
    </div>
);

const ProgressCard = ({ book, onUpdate }) => {
    const [pageInput, setPageInput] = useState(book.pagesRead || 0);
    const percent = Math.round((pageInput / book.totalPages) * 100) || 0;

    return (
        <div className="flex gap-6 p-6 bg-[#0f0502] border border-white/10 rounded-xl shadow-xl hover:border-[#ffba66]/30 transition-colors group">
            <img src={book.coverImage} alt="" className="w-24 h-36 object-cover rounded shadow-lg" />
            
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-xl font-playfair line-clamp-1 text-white">{book.bookName}</h3>
                    <p className="text-sm opacity-60 italic">{book.author}</p>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1 opacity-80">
                        <span>Progress</span>
                        <span>{percent}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#ffba66] transition-all duration-1000 ease-out"
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs opacity-50 uppercase tracking-widest">Page</span>
                    <input 
                        type="number" 
                        value={pageInput}
                        onChange={(e) => setPageInput(Number(e.target.value))}
                        className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-center text-sm focus:border-[#ffba66] outline-none"
                    />
                    <span className="text-xs opacity-50">/ {book.totalPages}</span>
                    
                    <button 
                        onClick={() => onUpdate(book, pageInput)}
                        className="ml-auto text-xs bg-[#ffba66] text-black font-bold px-3 py-1 rounded hover:bg-white transition"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;