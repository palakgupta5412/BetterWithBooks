import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineArrowRight } from 'react-icons/md'
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  // 1. Destructure user correctly
  const { user } = useAuth(); 
  const navigate = useNavigate();

  // 2. Safe Data Access (The "Safe Fallbacks")
  // If user.name exists, use it. If not, try user.fullName. If not, "Reader".
  const userName = user?.name || user?.fullName || "Reader";
  const userEmail = user?.email || "";
  // If user.pfp exists, use it. If not, try user.avatar. If not, placeholder.
  const userImage = user?.pfp || user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="w-[280px] sticky h-screen top-0 px-4 bg-[#2a1208] text-[#D8CFC4] border-r border-white/10 flex flex-col pb-6 items-center shadow-2xl">
        
        {/* Logo */}
        <img src="/logoF.png" alt="Logo" className="w-44 mt-4 mb-4 object-contain" />

        {/* Navigation Links */}
        <div className="w-full mt-4 flex flex-col gap-2 font-playfair text-lg">
          <Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/5 hover:text-[#ffba66] transition-colors flex items-center gap-3">
             Home
          </Link>
          <Link to="/library" className="px-4 py-2 rounded-lg hover:bg-white/5 hover:text-[#ffba66] transition-colors">
             Library
          </Link>
          <Link
            to="/tbr"
            className="px-4 py-2 rounded-lg bg-[#ffba66]/20 text-[#ffba66] font-semibold"
          >
             My Shelves
          </Link>
          <Link to="/quotes" className="px-4 py-2 rounded-lg hover:bg-white/5 hover:text-[#ffba66] transition-colors">
             Quotes
          </Link>
          <Link to="/profile" className="px-4 py-2 rounded-lg hover:bg-white/5 hover:text-[#ffba66] transition-colors">
             Profile
          </Link>
        </div>

        {/* --- PROFILE SECTION --- */}
        {user ? (
            <div className="w-full mt-auto">
                <div 
                    id="profile" 
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                    <img
                        src={userImage}
                        className="w-12 h-12 rounded-full object-cover border border-[#ffba66]/50 bg-black"
                        alt="Profile"
                    />
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate text-white capitalize">
                            {userName}
                        </p>
                        <p className="text-xs opacity-60 truncate">
                            {userEmail}
                        </p>
                    </div>
                </div>

                <div className="text-xs text-[#ff981a] flex justify-end w-full pr-2 items-center cursor-pointer hover:text-[#ffba66] mt-2 gap-1">
                    View Profile <MdOutlineArrowRight size={20} />
                </div>
            </div>
        ) : (
             // If user is null (Logged Out or Loading)
             <div className="mt-auto w-full">
                <button onClick={() => navigate('/login')} className="w-full py-2 bg-[#ffba66] text-black font-bold rounded hover:bg-[#dda200] transition">
                    Login Now
                </button>
            </div>
        )}
    </div>
  )
}

export default Sidebar;