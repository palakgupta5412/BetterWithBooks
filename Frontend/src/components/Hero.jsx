import React from 'react'
import Button from './Button'
import { RiDiscountPercentLine } from "react-icons/ri";
import { FaRegWindowRestore } from "react-icons/fa";
import { GrBlockQuote } from "react-icons/gr";
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';

const Hero = () => {  

  const heroRef = React.useRef(null);
  const navigate = useNavigate();
  useScrollReveal(heroRef);
  return (
    <div ref={heroRef} className='w-full mb-32 relative min-h-screen flex justify-start items-start object-contain overflow-hidden '>
        <div className='w-2/3 h-full flex flex-col justify-center items-center pt-24'>
          <h1 className='font-playfair text-5xl text-[#ffba66] tracking-wider font-extrabold'>Better with Books</h1>
          <p className='mt-1 font-bold text-[#dda200]'> A space to remember books that felt like home</p>

          <img src='./seperator.png' className='w-1/3 mt-3' />

          <div className='mt-10 flex flex-col gap-2 justify-center items-center text-xl font-playfair'>
            <p>Enter a world where you don't exist,</p>
            <p>but get to live other lives</p>
            <p>Turn pages, feel moments and return to the stories</p>
            <p>that have a place just for you.</p>
          </div>

          <div className='mt-24 flex justify-center items-center gap-7'>
            <Button onClick={()=>navigate('/mytbr')} text="Explore Library" className="text-sm" />
            <Button onClick={()=>navigate('/profile')} text="Add to my TBR" className="text-sm" />
          </div>
          
        </div>
    </div>
  )
}

export default Hero