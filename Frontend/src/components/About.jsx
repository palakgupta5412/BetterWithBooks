import React from 'react'
import { GiBookshelf } from "react-icons/gi";
import { HiLightBulb } from "react-icons/hi";
import { GiProgression } from "react-icons/gi";
import { IoStatsChart } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import { FaQuoteLeft } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useGSAP } from '@gsap/react';
import TextReveal from '../hooks/textReveal';
import AboutCard from './AboutCard';

const About = () => {

    const data = [
        {
            id : 1 ,
            title : "TBR Shelf",
            image : "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9iZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
            description : "Create your To Be Read shelf and keep future reads beautifully organised.",
            icon : <GiBookshelf size={32} className='text-center text-[#dda200] group-hover:text-white'/>
        },
        {
            id : 2 ,
            title : "AI Book Match",
            image : "/aboutImg/2.jpg",
            description : "Get personalized book recommendations based on your reading preferences and history.",
            icon : <HiLightBulb size={32} className='text-center text-[#dda200] group-hover:text-white'/>
        },
        {
            id : 3 ,
            title : "Daily Progress",
            image : "/aboutImg/3.jpg",
            description : "Update pages read daily and track completion percentage with ease.",
            icon : <GiProgression size={32} className='text-center text-[#dda200] group-hover:text-white'/>
        },
        {
            id : 4 ,
            title : "Reading Stats",
            image : "/aboutImg/4.jpg",
            description : "Track your reading journey through stats — books finished, pages read, and time spent reading.",
            icon : <IoStatsChart size={32} className='text-center text-[#dda200] group-hover:text-white'/>
        },
        {
            id : 5 ,
            title : "The vision",
            image : "/aboutImg/5.jpg",
            description : "I wanted a reading space that feels like a library corner",
            icon : <FaEye size={32} className='text-center text-[#dda200] group-hover:text-white'/>
        },
        {
            id : 6 ,
            title : "About this space",
            image : "/aboutImg/6.jpg",
            description : "Better with Books is built for readers who don’t just finish books — they remember them. A calm, bookshelf-like place to track what you read, save what you want to read next, and much more.",
            icon : <ImInfo size={32} className='text-center text-[#dda200] group-hover:text-white'/>
        },
        {
            id : 7 ,
            title : "Quote Vault",
            image : "/aboutImg/7.jpg",
            description : "Save the lines that stayed with you through the book",
            icon : <FaQuoteLeft size={32} className='text-center text-[#dda200] group-hover:text-white'/>
        },
        {
            id : 8 ,
            title : "Your Bookshelf",
            image : "/aboutImg/8.jpg",
            description : "Access your bookshelf from anywhere",
            icon : <IoBookSharp size={32} className='text-center text-[#fef4d9] group-hover:text-white'/>
        }
    ]


    const aboutRef = React.useRef(null);
    useScrollReveal(aboutRef);
    const textRef = React.useRef(null);

    useGSAP(()=>{
        
    })
    return (
      <section className="bg-gradient-to-b from-[#2a1208] via-[#3b1a0a] to-[#2a1208]  py-20">
        <div className="w-full text-2xl px-10">
          <h2 className="w-full text-center">
            <TextReveal 
              className="text-center font-bold font-playfair tracking-wider mb-16 text-4xl text-[#e8b424]" 
              text="What We Stand For?" 
            />
          </h2>
        </div>

        <div 
          ref={aboutRef} 
          className="max-w-7xl mx-auto px-10 flex flex-wrap justify-center gap-8 "
        >
          {data.map((item, idx) => (
            <AboutCard 
              key={item.id} 
              idx={idx} 
              image={item.image} 
              title={item.title} 
              description={item.description} 
              icon={item.icon}
            />
          ))}
        </div>
      </section>
    )
}

export default About