import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { FaSnapchatGhost } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // CHANGE: h-auto (flexible height), py-10 for spacing. flex-col-reverse (image at bottom) or flex-col on mobile.
    <div className='mt-20 md:mt-44 relative w-full h-auto md:h-[30vh] bg-black/50 flex flex-col md:flex-row justify-around items-center px-4 md:px-10 py-10 md:py-0 bottom-0 gap-10 md:gap-0'>
        
        {/* COL 1: Image (Hidden on small mobile to save space, or centered) */}
        <div className='w-full md:w-1/3 flex justify-center md:justify-start order-3 md:order-1'>
            <img src='./footer.png' alt='Footer Decoration' className='static md:absolute bottom-0 md:left-10 w-40 md:w-64 opacity-50 md:opacity-100'/>
        </div>

        {/* COL 2: Branding */}
        <div className='w-full md:w-1/3 flex flex-col justify-center items-center text-center gap-6 order-1 md:order-2'>
            <div>
                <h3 className='text-2xl md:text-3xl text-[#ffba66] font-bold font-gravitas'>betterwithbooks.</h3>
                <p className="text-sm">Created with <span>❤️</span> by Palak</p>
            </div>

            <div className='flex text-[#D8CFC4] justify-center gap-7 items-center mt-2'>
                <FaInstagram size={24} className='cursor-pointer hover:text-[#ffba66]'/>
                <FaSnapchatGhost size={24} className='ml-4 cursor-pointer hover:text-[#ffba66]'/>
                <BiLogoGmail size={24} className='ml-4 cursor-pointer hover:text-[#ffba66]'/>
            </div>
        </div>

        {/* COL 3: Links */}
        <div className='w-full md:w-1/3 flex flex-col justify-center text-xs items-center text-center gap-2 md:gap-1 order-2 md:order-3'>
            <p className='text-[#D8CFC4] font-bold'>Contact Us</p>
            <p className='text-blue-100'>Email: palak@example.com</p> 
            <hr className='h-[1px] w-1/3 bg-gray-400 my-2'/>
            <Link to="/about" className='hover:text-[#ffba66] text-[#D8CFC4]'>About Us</Link>
            <Link to="/privacy" className='hover:text-[#ffba66] text-[#D8CFC4]'>Privacy Policy</Link>
            <Link to="/terms" className='hover:text-[#ffba66] text-[#D8CFC4]'>Terms of Service</Link>
        </div>
    </div>
  )
}

export default Footer