import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import {MdOutlineArrowRight} from 'react-icons/md'
const Sidebar = () => {
    const navigate = useNavigate() ;
  return (
    <div className="w-[280px] sticky max-h-screen px-4 bg-[#2a1208] border-r flex flex-col pb-6 items-center">
        <img src="/logoF.png" alt="Logo" className="w-44 mt-4" />

        <div className="w-full mt-7 flex flex-col gap-1">
          <Link to="/" className="px-4 py-1 rounded-lg hover:bg-black/5">
            Home
          </Link>
          <Link to="/library" className="px-4 py-2 rounded-lg hover:bg-black/5">
            Library
          </Link>
          <Link
            to="/tbr"
            className="px-4 py-2 rounded-lg bg-[#ffba66]/30 font-semibold"
          >
            My Shelves
          </Link>
          <Link to="/quotes" className="px-4 py-2 rounded-lg hover:bg-black/5">
            Quotes
          </Link>
          <Link to="/profile" className="px-4 py-2 rounded-lg hover:bg-black/5">
            Profile
          </Link>
        </div>

        {/* profile mini */}
        <div id="profile" className="cursor-pointer w-full mt-auto flex items-center gap-3 pt-6">
          <img
            src="/aboutImg/1.jpg"
            onClick={()=>navigate('/profile')}
            className="w-12 h-12 rounded-full object-cover"
            alt="Profile"
          />
          <div>
            <p className="hover:underline font-semibold">Palak Sharma</p>
            <p className="hover:underline text-xs opacity-70">@palaksharma</p>
          </div>
        </div>

        <div className="text-xs text-[#ff981a] flex justify-end w-full pr-2 items-center cursor-pointer hover:text-[#ffba66] mt-2">
          View Profile <MdOutlineArrowRight size={20} />
        </div>
      </div>
  )
}

export default Sidebar