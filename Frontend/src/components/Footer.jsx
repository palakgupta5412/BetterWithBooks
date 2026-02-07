import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { FaSnapchatGhost } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='mt-44 relative w-full h-[30vh] bg-black/50 flex justify-around items-center px-10 bottom-0'>
        <div className=' w-1/3'>
            <img src='./footer.png' alt='Footer Decoration' className='absolute bottom-0 left-10 w-64'/>
        </div>
        <div className='w-1/3 flex flex-col justify-center items-center text-center gap-6'>
            <div>
                <h3 className='text-3xl text-[#ffba66] font-bold font-gravitas'>betterwithbooks.</h3>
                <p>Created with <span>❤️</span> by Palak</p>
            </div>

            <div className='flex text-[#D8CFC4] justify-center gap-7 items-center mt-2'>
                <FaInstagram size={24} className='cursor-pointer hover:text-[#ffba66]'/>
                <FaSnapchatGhost size={24} className='ml-4 cursor-pointer hover:text-[#ffba66]'/>
                <BiLogoGmail size={24} className='ml-4 cursor-pointer hover:text-[#ffba66]'/>
            </div>
        </div>
        <div className='w-1/3 flex flex-col justify-center text-xs items-center text-center gap-1'>
            <p className='text-[#D8CFC4]'>Contact Us</p>
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