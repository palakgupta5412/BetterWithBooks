import React, { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { FaArrowAltCircleDown, FaArrowLeft, FaSearch, FaSearchPlus } from 'react-icons/fa';
import Button from './Button';
import TextReveal from '../hooks/textReveal';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

const Cards = () => {

    const navigate = useNavigate();

    const tbr = [
      {
        "id": 1,
        "title": "Atomic Habits",
        "author": "James Clear",
        "cover": "https://books.google.com/books/content?id=atomic-habits-cover&printsec=frontcover&img=1&zoom=1",
        "genre": ["Self-help", "Productivity"],
        "description": "A practical guide to building good habits and breaking bad ones using tiny changes that deliver remarkable results.",
        "rating": 4.8,
        "year": 2018,
        "isbn": "9780735211292",
        "status": "TBR"
      },
      {
        "id": 2,
        "title": "The Silent Patient",
        "author": "Alex Michaelides",
        "cover": "https://books.google.com/books/content?id=silent-patient-cover&printsec=frontcover&img=1&zoom=1",
        "genre": ["Thriller", "Mystery", "Psychological"],
        "description": "A woman shoots her husband and never speaks again. A psychotherapist becomes obsessed with uncovering her motive.",
        "rating": 4.5,
        "year": 2019,
        "isbn": "9781250301697",
        "status": "TBR"
      },
      {
        "id": 3,
        "title": "It Ends With Us",
        "author": "Colleen Hoover",
        "cover": "https://books.google.com/books/content?id=it-ends-with-us-cover&printsec=frontcover&img=1&zoom=1",
        "genre": ["Romance", "Contemporary"],
        "description": "A powerful story about love, resilience, and difficult choices in relationships.",
        "rating": 4.6,
        "year": 2016,
        "isbn": "9781501110368",
        "status": "TBR"
      },
      {
        "id": 4,
        "title": "The Alchemist",
        "author": "Paulo Coelho",
        "cover": "https://books.google.com/books/content?id=the-alchemist-cover&printsec=frontcover&img=1&zoom=1",
        "genre": ["Fiction", "Philosophical"],
        "description": "A shepherd boy travels in search of treasure and discovers the meaning of life along the way.",
        "rating": 4.7,
        "year": 1988,
        "isbn": "9780061122415",
        "status": "TBR"
      },
      {
        "id": 5,
        "title": "Ikigai",
        "author": "Héctor García & Francesc Miralles",
        "cover": "https://books.google.com/books/content?id=ikigai-cover&printsec=frontcover&img=1&zoom=1",
        "genre": ["Self-help", "Lifestyle"],
        "description": "Explores the Japanese concept of ikigai — the reason for being — and secrets to a long, happy life.",
        "rating": 4.4,
        "year": 2016,
        "isbn": "9780143130727",
        "status": "TBR"
      }
    ]

    const tbrRef = React.useRef(null);
    const [addNew , setAddNew] = useState(false);

    //new books info :
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState([]);
    const [rating, setRating] = useState(0);
    const [cover, setCover] = useState('');
    const toggleAddNew = () => {
        setAddNew(!addNew);
    }

    useGSAP(()=>{
        const cards = tbrRef.current.querySelectorAll('.group');
        cards.forEach((card, index) => {
            gsap.fromTo(card, {
                opacity: 0,
                scale: 0.8,
                y: 50
            }, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                delay : 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%", // Animation starts when element is 85% down the screen
                    toggleActions: "play reverse", // Plays on scroll down, reverses on scroll up
                },
            } , {scope: card})
                
        })
    })

  const [imgData, setImgData] = useState([
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1718283728i/213243908.jpg", top: "35%", left: "30%", rotate : "-90deg", isActive: false },
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1634158558i/59344312.jpg", top: "35%", left: "34%", rotate : "-70deg", isActive: false },
    { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwrr6PAkFGsrxAFnlNTgbGln_d7bFPK5mMbw&s", top: "35%", left: "36%", rotate : "-50deg", isActive: false },
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1581589570l/52227678.jpg", top: "35%", left: "38%", rotate : "-30deg", isActive: false },
    { url: "https://marketplace.canva.com/EAFOu64R3Gk/2/0/1003w/canva-pink-and-purple-cute-young-adult-love-romance-book-cover-K15yUkKnrPo.jpg" , top: "39%", left: "42%", rotate : "0deg", isActive: false },
    { url: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1646534743i/60556912.jpg", top: "50%", left: "44%", rotate : "30deg", isActive: false },
    { url: "https://m.media-amazon.com/images/I/61R+Cpm+HxL._AC_UF1000,1000_QL80_.jpg", top: "60%", left: "42%", rotate : "50deg", isActive: false },
    { url: "https://m.media-amazon.com/images/I/81Y+9pH0TAL._AC_UF1000,1000_QL80_.jpg", top: "65%", left: "40%", rotate : "70deg", isActive: false },
    { url: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861546749/the-way-i-used-to-be-9780861546749_hr.jpg", top: "65%", left: "39%", rotate : "90deg", isActive: false },
]);

  const { scrollYProgress } = useScroll();

  const imageShow = (indices) => {
    setImgData((prev) =>
      prev.map((item, index) => ({
        ...item,
        isActive: indices.includes(index),
      }))
    );
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const scrollVal = Math.floor(latest * 55);
    switch (scrollVal) {
      case 0:  imageShow([]); break;
      case 1:  imageShow([0]); break;
      case 2:  imageShow([0, 1]); break;
      case 3:  imageShow([0, 1, 2]); break;
      case 4:  imageShow([0, 1, 2, 3]); break;
      case 5:  imageShow([0, 1, 2, 3, 4]); break;
      case 6:  imageShow([0, 1, 2, 3, 4, 5]); break;
      case 7:  imageShow([0, 1, 2, 3, 4, 5, 6]); break;
      case 8:  imageShow([0, 1, 2, 3, 4, 5, 6, 7]); break;
      case 9:  imageShow([0, 1, 2, 3, 4, 5, 6, 7, 8]); break;
      default: imageShow([0, 1, 2, 3, 4, 5 , 6, 7, 8]); break;
    }
  });

  return (
    <div className='w-full flex flex-col bg-[#170b01] overflow-hidden' >
      {/* 150vh gives enough scroll room to trigger all images */}
      <div className='max-w-screen-2xl mx-auto h-[180vh] flex relative'>
        {/* LEFT SIDE: Content Space */}
        <div className='w-[40%] sticky top-0 h-screen flex flex-col justify-center px-20 z-10'>
        <h1 className='sticky mb-20 left-10 z-20 text-3xl text-[#ffba66] cursor-pointer'><FaArrowLeft onClick={()=>navigate(-1)} /></h1>
          <h2 className='text-[#ffba66] text-sm uppercase tracking-[0.4em] font-bold mb-4'>Curated Selection</h2>
          <h1 className='text-5xl font-serif text-white font-bold leading-tight'>
            Books that felt like <span className='italic text-[#ffba66]'>home.</span>
          </h1>
          <p className='text-white/60 mt-6 text-lg leading-relaxed'>
            Scroll to explore the visual journey of stories that shaped our perspective. Each cover represents a world waiting to be rediscovered.
          </p>
          <div className='mt-10 h-1 w-20 bg-[#ffba66]'></div>
        </div>

        {/* RIGHT SIDE: Image Animation Stack */}
        <div className='w-[60%] mx-auto sticky top-0 h-screen overflow-hidden pointer-events-none'>
          {/* Faint background text shifted right */}
          <h1 className='absolute top-1/2 left-0 text-center -translate-y-1/2 text-[15vw] font-bold text-white/[0.03] select-none mx-auto w-full justify-center items-center pointer-events-none'>
            BOOKS TBR
          </h1>
          
          <div className='absolute inset-0'>
            {imgData.map((item, index) => (
              item.isActive && (
                <img
                  src={item.url}
                  key={index}
                  alt={`Book ${index}`}
                  className='absolute rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 w-44 md:w-48 -translate-x-1/2 -translate-y-1/2 transition-all duration-300'
                  style={{ 
                    top: item.top, 
                    left: item.left,
                    transform: `rotate(${item.rotate}) translateX(-50%) translateY(-50%)`,
                    zIndex: index + 10 // Ensures newer images appear on top
                  }}
                />
              )
            ))}
          </div>
        </div>

      </div>

      <div className='max-w-screen h-auto w-full overflow-hidden flex flex-col justify-start items-start absolute top-[100%] mx-auto bg-[#170b01]'>
        {/* <h2 className='text-3xl w-full justify-center items-center text-center mb-10 text-[#ffba66] font-bold'>Your TBR</h2> */}
        <TextReveal className='text-center w-full font-bold font-playfair tracking-wider mt-20 mb-10 text-4xl text-[#ffba66]' text="Your TBR"/>
        <div ref={tbrRef} className='mx-auto w-full flex flex-col justify-center items-center pb-20'>
            {tbr.map((book) => (
              <div 
                key={book.id} 
                className='group flex items-center h-32 border border-[#ffba66]/30 hover:border-[#ffba66] gap-6 w-[85%] max-w-4xl mb-4 bg-white/5 backdrop-blur-md rounded-xl p-4 transition-all duration-300 hover:bg-[#ffba66]/10'
              >
                {/* Small Cover Image in List */}
                <div className='h-24 w-16 shrink-0 overflow-hidden rounded-md shadow-lg'>
                  <img src={book.cover} alt={book.title} className='h-full w-full object-cover group-hover:scale-110 transition-transform' />
                </div>
            
                {/* Book Details */}
                <div className='flex-grow'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='text-xl font-bold text-white group-hover:text-[#ffba66] transition-colors'>{book.title}</h4>
                      <p className='text-sm text-white/60'>by {book.author}</p>
                    </div>
                    <span className='text-[#ffba66] font-mono text-sm'>★ {book.rating}</span>
                  </div>
            
                  {/* Genre Tags */}
                  <div className='flex gap-2 mt-3'>
                    {book.genre.map((g, i) => (
                      <span key={i} className='text-[10px] uppercase tracking-tighter border border-[#ffba66]/50 text-[#ffba66] px-2 py-0.5 rounded-full'>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Arrow */}
                <div className='opacity-0 group-hover:opacity-100 transition-opacity pr-4'>
                  <FaArrowAltCircleDown className='text-[#ffba66] text-2xl rotate-[-90deg]' />
                </div>
                
              </div>
              
            ))}
            <Button text="Add new Book" onClick={toggleAddNew} className={"text-sm"}/>

            <div className='mt-10 h-[1px] w-32 bg-[#ffba66]/50'>
            
            </div>
            {addNew ? 
            <div className=" flex flex-col items-center mt-10 gap-4 w-[85%] max-w-4xl">
                <div className='flex border w-[70%] bg-[#ffffff]/10 border-[#ffba66]/30 items-center gap-4 justify-start px-6 text-white'>
                    <FaSearch size={24} className='text-[#ffba66]/50'/>
                    <input className='w-[70%] bg-transparent outline-none py-2 ' type='text'/>
                </div>
                <input type="text" placeholder="Book Title" className="w-full p-3 rounded-md bg-[#ffffff]/10 border border-[#ffba66]/30 text-white focus:outline-none focus:border-[#ffba66]" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Author" className="w-full p-3 rounded-md bg-[#ffffff]/10 border border-[#ffba66]/30 text-white focus:outline-none focus:border-[#ffba66]" value={author} onChange={(e) => setAuthor(e.target.value)}/>
                <input type="text" placeholder="Genre(s)" className="w-full p-3 rounded-md bg-[#ffffff]/10 border border-[#ffba66]/30 text-white focus:outline-none focus:border-[#ffba66]" value={genre} onChange={(e) => setGenre(e.target.value.split(','))}/>
                <input type="text" placeholder="Cover Image URL" className="w-full p-3 rounded-md bg-[#ffffff]/10 border border-[#ffba66]/30 text-white focus:outline-none focus:border-[#ffba66]" value={cover} onChange={(e) => setCover(e.target.value)}/>                
                <Button text="Add to TBR" className={"text-sm self-end"} onClick={() => {
                  const newBook = {
                    id: tbr.length + 1,
                    title,
                    author,
                    genre: genre.map(g => g.trim()),
                    rating,
                    cover
                  };
                  setTbr([...tbr, newBook]);
                  setTitle('');
                  setAuthor('');
                  setGenre([]);
                  setCover('');
                  setRating(0);
                  toggleAddNew();
                }}/>
            </div> 
            :
            <div className="mt-4">
                <p className='text-white/60 text-sm'>Scroll up to explore more books that await your discovery.</p>    
            </div>} 
        </div>
        
      </div>
    </div>
  );
};

export default Cards;