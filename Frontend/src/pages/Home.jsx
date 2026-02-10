import React from 'react'
import { FaSearch } from "react-icons/fa";
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Button from '../components/Button';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const containerRef = React.useRef(null);
    const {user , logout} = useAuth();

    const handleLogout = async () => {
        await logout(); 
    };

    useGSAP(()=>{
        const h1s = containerRef.current.querySelectorAll('h1');
        h1s.forEach(h1 => {
            const text = h1.textContent;
            h1.innerHTML = text.split("").map((char)=> `<span class="inline-block translate-y-full">${char===" " ? "&nbsp;" : char}</span>`).join("")
        });
        
        gsap.to("h1 span", {
            y: 0,
            duration: 1.5,
            stagger: 0.05,
            delay: 0.5,
            ease: "power3.out",
        });
    },{scope: containerRef});
    
  return (
    <div className='stick text-[#D8CFC4] w-full bg-gradient-to-b from-[#2a1208] via-[#3b1a0a] to-[#2a1208] min-h-screen flex flex-col '>
        
        {/* --- NAVBAR AREA --- */}
        {/* CHANGE: h-auto to allow wrapping, py-4 for spacing */}
        <div className='w-full flex justify-center p-2 items-center h-auto py-4 md:h-20'>
            {/* CHANGE: flex-col on mobile (stack search & login), md:flex-row (side-by-side) */}
            <div className='w-full md:w-[90%] bg-transparent px-2 md:px-6 flex flex-col md:flex-row gap-4 justify-between items-center'>
                
                {/* SEARCH BAR CONTAINER */}
                <div className="flex w-full md:w-auto items-center justify-center">
                    <div className='text-white bg-[#100601]/60 backdrop-blur-lg p-2 rounded-l-md'>
                        <FaSearch size={20} className="md:w-[27px] md:h-[27px]"/>
                    </div>
                    {/* CHANGE: w-full on mobile (fill screen), md:w-96 on desktop */}
                    <div className='bg-[#100601]/60 backdrop-blur-lg p-2 w-full md:w-auto rounded-r-md'>
                        <input type="text" placeholder='Search...' className='w-full md:w-96 h-full px-2 md:px-4 outline-none bg-transparent text-white placeholder-white/70 text-sm md:text-base'/>
                    </div>
                </div>

                {/* USER INFO / BUTTONS */}
                <div className="flex justify-center w-full md:w-auto">
                    {user ? 
                    <div className='flex items-center gap-2 p-2'>
                        <p className='text-[#D8CFC4] text-right text-xs p-2 flex items-center font-bold '>Hello, {user.name}</p>
                        <img onClick={()=>navigate("/proflie")} src={user.pfp || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className='w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-[#ffba66]' alt="" />
                    </div> : <Button onClick={()=>navigate('/login')} text={"Login"} className={"text-xs text-center"}/> }
                    
                    {!user && <Button onClick={()=>navigate('/login')} text={"Register"} className={"text-xs text-center ml-2"}/>}
                </div>
            </div>
        </div>

        {/* --- QUOTE SECTION --- */}
        {/* CHANGE: h-auto on mobile (content fits), md:h-64. flex-col on mobile. */}
        <div style={{backgroundImage: "url('https://res.cloudinary.com/dc8ryewn6/image/upload/v1770528335/quoteBG_sacg36.png')" , backgroundSize: "cover" , backgroundRepeat: "no-repeat" }} className='w-full h-auto md:h-64 overflow-hidden flex flex-col md:flex-row justify-between px-4 md:px-10 py-6 md:py-0'>
            
            {/* LEFT IMAGE: Hidden on mobile to save space, visible on desktop */}
            <div className='hidden md:flex w-1/2 h-full justify-start items-center pt-4'>
                <img src="https://res.cloudinary.com/dc8ryewn6/image/upload/v1770528333/logoF_wtyi0t.png" className='object-cover' alt="Above Nav" />
            </div>

            {/* RIGHT TEXT */}
            {/* CHANGE: w-full on mobile, text-2xl on mobile, text-5xl on desktop */}
            <div ref={containerRef}  className='whitespace-nowrap overflow-hidden font-titan text-2xl md:text-5xl w-full md:w-1/2 text-center md:text-right text-[#D8CFC4] flex flex-col justify-center items-center md:items-end pt-4 md:pr-20 relative'>
                <div className='flex relative gap-3 justify-center md:justify-start items-start'>
                    {/* QUOTE MARKS SCALED DOWN */}
                    <span style={{transform : "rotate(180deg)"}} className='text-[10vh] md:text-[20vh] absolute -left-10 md:-left-20 -top-8 md:-top-20 font-passion inline-block opacity-50'>"</span>
                    <h1 style={{backgroundColor: "rgba(0, 0, 0, 0.35)"}} className='whitespace-nowrap overflow-hidden tracking-widest mb-2 z-10 px-2'>
                        Some Stories
                    </h1>
                </div>
                <h1 style={{backgroundColor: "rgba(0, 0, 0, 0.35)"}} className='tracking-widest whitespace-nowrap overflow-hidden mb-2 px-2'>Stay Longer Than</h1>
                <h1 style={{backgroundColor: "rgba(0, 0, 0, 0.35)"}} className='tracking-widest whitespace-nowrap overflow-hidden mb-2 px-2'>The People
                    <span className='text-[10vh] md:text-[20vh] absolute right-0 -bottom-10 md:top-36 font-passion opacity-50' >"</span>
                </h1>
            </div>
        </div>

        {/* --- VIDEO HERO --- */}
        <div className="relative min-h-screen w-full overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0">
            <source src="https://res.cloudinary.com/dc8ryewn6/video/upload/v1770528335/hero_dbqkvx.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/65 bg-blend-soft-light z-10" />
          <div className="relative z-20 w-full h-full">
            <Navbar />
            <Hero />
          </div>
        </div>

        <About />
        <Footer />
    </div>
  )
}

export default Home;