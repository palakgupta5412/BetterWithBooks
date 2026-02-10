import React from "react";
import { Link } from "react-router-dom";
import TextReveal from "../hooks/textReveal";

const Navbar = () => {
  return (
    // CHANGES:
    // 1. w-[95%] on mobile -> md:w-[60%] (Your original width)
    // 2. gap-4 on mobile -> md:gap-10 (Your original gap)
    // 3. text-xs on mobile -> md:text-lg (Your original size)
    // 4. h-10 on mobile -> md:h-12
    <nav className="text-[#D8CFC4] stick font-titan md:font-gravitas text-[1px] md:text-lg w-[95%] md:w-[60%] h-10 md:h-12 mt-8 flex justify-center items-center gap-3 md:gap-10 backdrop-blur-sm rounded-full mx-auto bg-white/5 overflow-hidden transition-all duration-300">
      {["Home", "Explore", "My TBR", "List", "Profile"].map((item) => (
        <div className="cursor-pointer py-2 group flex justify-center items-center relative" key={item}>
            <img src="highlight.png" className="pointer-events-none absolute opacity-0 group-hover:opacity-50 transition-all ease-in-out top-0 z-10 cursor-pointer left-0 w-full scale-150 h-full object-cover" alt="Highlight"/>
            <Link to={item==='My TBR'?'/mytbr':`/${item.toLowerCase()} `}>                
                <span className="z-50 group-hover:text-white py-2 whitespace-nowrap">
                  <TextReveal text={item} />
                </span>
            </Link>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;