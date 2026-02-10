import React from 'react'
import Button from './Button'
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';

const Hero = () => {  

  const heroRef = React.useRef(null);
  const navigate = useNavigate();
  useScrollReveal(heroRef);

  return (
    // CHANGE: min-h-[80vh] on mobile fixes some address bar scrolling issues, md:min-h-screen keeps your look
    <div ref={heroRef} className='w-full mb-10 md:mb-32 relative min-h-[80vh] md:min-h-screen flex justify-start items-start object-contain overflow-hidden'>
        
        {/* CHANGES: 
            1. w-full on mobile -> md:w-2/3 
            2. px-4 on mobile to prevent text hitting edges 
            3. pt-12 on mobile -> pt-24 on desktop
        */}
        <div className='w-full md:w-2/3 h-full flex flex-col justify-center items-center pt-12 md:pt-24 px-4 text-center'>
          
          {/* CHANGE: text-3xl on mobile -> md:text-5xl */}
          <h1 className='font-playfair text-3xl md:text-5xl text-[#ffba66] tracking-wider font-extrabold'>
            Better with Books
          </h1>
          
          {/* CHANGE: text-sm on mobile -> text-base/lg default */}
          <p className='mt-2 font-bold text-[#dda200] text-sm md:text-base'> 
            A space to remember books that felt like home
          </p>

          {/* CHANGE: w-2/3 on mobile -> md:w-1/3 */}
          <img src='./seperator.png' className='w-2/3 md:w-1/3 mt-3' alt="seperator" />

          {/* CHANGE: text-sm on mobile -> md:text-xl */}
          <div className='mt-8 md:mt-10 flex flex-col gap-2 justify-center items-center text-sm md:text-xl font-playfair opacity-90'>
            <p>Enter a world where you don't exist,</p>
            <p>but get to live other lives</p>
            <p>Turn pages, feel moments and return to the stories</p>
            <p>that have a place just for you.</p>
          </div>

          {/* CHANGE: gap-4 on mobile -> md:gap-7, mt-12 mobile -> mt-24 desktop */}
          <div className='mt-12 md:mt-24 flex flex-wrap justify-center items-center gap-4 md:gap-7'>
            <Button onClick={()=>navigate('/library')} text="Explore Library" className="text-xs md:text-sm" />
            <Button onClick={()=>navigate('/mytbr')} text="Add to my TBR" className="text-xs md:text-sm" />
          </div>
          
        </div>
    </div>
  )
}

export default Hero;