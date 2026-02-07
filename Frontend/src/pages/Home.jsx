import React from 'react'
import { FaSearch } from "react-icons/fa";
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Login from './Login';
import Tbr from './Tbr';
import Info from './Info';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const containerRef = React.useRef(null);

    useGSAP(()=>{
        const h1s = containerRef.current.querySelectorAll('h1');
        h1s.forEach(h1 => {
            const text = h1.textContent;
            h1.innerHTML = text.split("").map((char)=> `<span class="inline-block translate-y-full">${char===" " ? "&nbsp;" : char}</span>`).join("")
        });
        
        gsap.to("h1 span", {
            y: 0,
            duration: 1.5, // Reduced from 2.5 for better feel
            stagger: 0.05,
            delay: 0.5,
            ease: "power3.out",
        });
    },{scope: containerRef});
    
  return (
    <div className='stick text-[#D8CFC4] w-full bg-gradient-to-b from-[#2a1208] via-[#3b1a0a] to-[#2a1208] min-h-screen flex flex-col '>
        <div className='w-full flex justify-center p-2 items-center h-20'>
            <div className='w-[90%]  bg-transparent px-6 h-2/3 flex gap-2 justify-between items-center'>
                <div className='text-white bg-[#100601]/60 backdrop-blur-lg p-2'>
                    <FaSearch size={27}/>
                </div>
                <div className='bg-[#100601]/60 backdrop-blur-lg p-2 w-full'>
                    <input type="text" placeholder='Search for books, authors, genres...' className='w-96 h-full px-4 outline-none bg-transparent text-white placeholder-white '/>
                </div>

                <Button onClick={()=>navigate('/login')} text={"Login"} className={"text-xs text-center"}/>
                <Button onClick={()=>navigate('/login')} text={"Register"} className={"text-xs text-center"}/>
            </div>
        </div>
        <div style={{backgroundImage: "url('/quoteBG.png')" , backgroundSize: "cover" , backgroundRepeat: "no-repeat" }} className='w-full h-64 overflow-hidden flex justify-between px-10'>
            <div className='w-1/2 h-full flex justify-start items-center pt-4'>
                <img src="/logoF.png" className='object-cover' alt="Above Nav" />
            </div>
            <div ref={containerRef}  className='whitespace-nowrap overflow-hidden font-titan text-5xl w-1/2 text-right text-[#D8CFC4] flex flex-col justify-center items-end pt-4 pr-20 relative'>
                <div className='flex relative gap-3 justify-start items-start'>
                    <span style={{transform : "rotate(180deg)"}} className='text-[20vh] absolute -left-20 -top-20 font-passion inline-block'>"</span>
                    <h1 style={{backgroundColor: "rgba(0, 0, 0, 0.35)"}} className='whitespace-nowrap overflow-hidden tracking-widest mb-2'>
                        Some Stories
                    </h1>
                </div>
                <h1 style={{backgroundColor: "rgba(0, 0, 0, 0.35)"}} className='tracking-widest whitespace-nowrap overflow-hidden  mb-2'>Stay Longer Than</h1>
                <h1 style={{backgroundColor: "rgba(0, 0, 0, 0.35)"}} className='tracking-widest whitespace-nowrap overflow-hidden  mb-2'>The People<span className='text-[20vh] absolute right-0 top-36 font-passion' >"</span></h1>
            </div>
        </div>

        {/* 3. VIDEO HERO SECTION */}
        <div className="relative min-h-screen w-full overflow-hidden">
          {/* The Video Element */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Overlay to darken video for text readability (Matches your theme) */}
          <div className="absolute inset-0 bg-black/65 bg-blend-soft-light z-10" />

          {/* Content on top of video */}
          <div className="relative z-20 w-full h-full">
            <Navbar />
            <Hero />
          </div>
        </div>
        <About />
        <Footer />
        {/* <Info book={{id: 1 , bookName: "It Ends With Us" , author: "Colleen Hoover" , description : "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." , genre: ["Romance" , "Contemporary" , "Drama"] }} /> */}
    </div>
  )
}

export default Home