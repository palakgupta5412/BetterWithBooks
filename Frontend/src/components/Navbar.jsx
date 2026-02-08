import React from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import TextReveal from "../hooks/textReveal";

const Navbar = () => {
  
  return (
    <nav  className="text-[#D8CFC4] stick font-gravitas text-lg w-[60%] h-12 mt-8 flex justify-center items-center gap-10 backdrop-blur-sm rounded-full mx-auto bg-white/5 overflow-hidden">
      {["Home", "Explore", "My TBR", "List", "Profile"].map((item) => (
        <div className="cursor-pointer py-2 group flex justify-center items-center relative" key={item}>
            <img src="highlight.png" className="pointer-events-none absolute opacity-0 group-hover:opacity-50 transition-all ease-in-out top-0 z-10 cursor-pointer left-0 w-full scale-150 h-full object-cover" alt="Highlight"/>
            <Link to={item==='My TBR'?'/mytbr':`/${item.toLowerCase()} `}>                
                <span className="z-50 group-hover:text-white py-2">
                  <TextReveal text={item} />
                </span>
            </Link>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
