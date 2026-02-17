import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextReveal from "../hooks/textReveal";
import { FaBars, FaTimes } from "react-icons/fa"; // Import Icons

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = ["Home", "Explore", "My TBR", "Recommendations", "Profile"];

  return (
    <>
      {/* --- DESKTOP VIEW (Hidden on Mobile) --- */}
      <nav className="hidden md:flex text-[#D8CFC4] stick font-gravitas text-lg w-[60%] h-12 mt-8 justify-center items-center gap-10 backdrop-blur-sm rounded-full mx-auto bg-white/5 overflow-hidden transition-all duration-300">
        {navItems.map((item) => (
          <div className="cursor-pointer py-2 group flex justify-center items-center relative" key={item}>
            {/* Hover Highlight Image */}
            <img src="highlight.png" className="pointer-events-none absolute opacity-0 group-hover:opacity-50 transition-all ease-in-out top-0 z-10 cursor-pointer left-0 w-full scale-150 h-full object-cover" alt="Highlight"/>
            
            <Link to={item === 'My TBR' ? '/mytbr' : `/${item.toLowerCase()}`}>                
                <span className="z-50 group-hover:text-white py-2 whitespace-nowrap">
                  <TextReveal text={item} />
                </span>
            </Link>
          </div>
        ))}
      </nav>

      {/* --- MOBILE VIEW (Hamburger Button) --- */}
      <div className="md:hidden w-full flex justify-center mt-6 z-50 relative">
        <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-1 rounded-full text-[#D8CFC4] border border-white/20 font-titan tracking-widest hover:bg-[#ffba66] hover:text-black transition-all shadow-lg"
        >
            <FaBars size={12} /> MENU
        </button>
      </div>

      {/* --- MOBILE OVERLAY (Full Screen Menu) --- */}
      <div 
        className={`fixed inset-0 bg-[#1a0f0e]/95 backdrop-blur-xl z-[9999] flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
            {/* Close Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-8 right-8 text-[#ffba66] p-3 hover:bg-white/10 rounded-full transition-all"
            >
                <FaTimes size={32} />
            </button>

            {/* Logo or Title in Menu */}
            <h2 className="font-titan text-[#ffba66] text-xl mb-4 tracking-widest border-b border-[#ffba66]/30 pb-2">NAVIGATION</h2>

            {/* Menu Items */}
            {navItems.map((item) => (
                <Link 
                    key={item} 
                    to={item === 'My TBR' ? '/mytbr' : `/${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#D8CFC4] font-gravitas text-lg hover:text-[#ffba66] hover:scale-110 tracking-widest transition-all duration-300"
                >
                    {item}
                </Link>
            ))}
      </div>
    </>
  );
};

export default Navbar;