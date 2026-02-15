import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuote } from '../api/quote.service';
import { useToast } from '../context/ToastContext';
import { QUOTE_THEMES } from '../utils/quotesdata';

const CreateQuotes = () => {
  const navigate = useNavigate();
  const {addToast} = useToast();

  // 1. Setup State
  const [quoteText, setQuoteText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookName, setBookName] = useState('');

  // 2. Enhanced Themes with Background Images
  const QUOTE_THEMES = [
    {
      id: 'classic-paper',
      name: 'Classic Paper',
      // Light Theme: Uses a vintage paper texture
      backgroundImage: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format&fit=crop", 
      classes: "text-[#2a1208] border-2 border-[#D8CFC4]",
      overlay: "bg-[#F5F1E1]/80", // Light overlay to blend the texture
      previewColor: "#F5F1E1" 
    },
    {
      id: 'midnight-ink',
      name: 'Midnight Ink',
      // Dark Theme: Starry night sky
      backgroundImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
      classes: "text-[#D8CFC4] border border-[#3b1a0a] shadow-lg shadow-orange-900/20",
      overlay: "bg-[#100601]/70", // Dark overlay for readability
      previewColor: "#100601"
    },
    {
      id: 'sepia-dream',
      name: 'Sepia Dream',
      // Vintage: Old library / Book shelves
      backgroundImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
      classes: "text-[#EADDCD] border-none shadow-2xl",
      overlay: "bg-[#3b1a0a]/85", // Heavy brown overlay to make it look like old leather
      previewColor: "#3b1a0a"
    },
    {
      id: 'forest-whisper',
      name: 'Forest Whisper',
      // Nature: Dark moody forest/ferns
      backgroundImage: "/aboutImg/14.jpg",
      classes: "text-[#c2d6d0] border-l-8 border-[#2d5a4c]",
      overlay: "bg-[#0f1f1a]/80", // Green tint overlay
      previewColor: "#0f1f1a"
    },
    {
      id: 'royal-velvet',
      name: 'Royal Velvet',
      // Romantic: Red roses/Velvet texture
      backgroundImage: "/aboutImg/4.jpg",
      classes: "text-[#ffdddd]",
      overlay: "bg-gradient-to-tr from-[#2a0808]/90 to-[#4a0e0e]/80", // Red gradient overlay
      previewColor: "#2a0808"
    },
    {
      id: 'glass-morphism',
      name: 'City Rain',
      backgroundImage: "/aboutImg/10.jpg",
      classes: "text-white backdrop-blur-[10px] border border-white/20",
      overlay: "bg-[#000000]/60", // Light dark overlay for contrast
      previewColor: "#000000" 
    },
    {
        id : 'custom-upload',
        name : 'Custom Upload',
        backgroundImage : "/aboutImg/12.jpg",
        classes : "text-[#EADDCD] border-none shadow-2xl",
        overlay : "bg-[#000000]/65", // Heavy brown overlay to make it look like old leather
        previewColor : "#000000"
    },
    {
        id : 'simple-solid',
        name : 'Simple Solid',
        backgroundImage : "/buttonBg.png",
        classes : "text-[#000000] border-none shadow-2xl",
        overlay : "bg-[#D8CFC4]/60", // Heavy brown overlay to make it look like old leather
        previewColor : "#D8CFC4"
    }
  ];

  const [selectedTheme, setSelectedTheme] = useState(QUOTE_THEMES[0]);
  const [loading , setLoading] = useState(false);

  const handleSave = async () => {
    if (!quoteText || !authorName) {
       // alert("Quote and Author are required!"); // Fallback if no toast
       addToast("Quote and Author are required!", "error");
       return;
    }

    setLoading(true);
    try {
        await createQuote({
            content: quoteText,
            author: authorName,
            bookName: bookName,
            theme: selectedTheme.id
        });
        addToast("Quote Published!", "success");
        navigate('/quotes'); // Go back to quotes list
    } catch (error) {
        console.error(error);
        addToast("Failed to publish quote", "error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-[#1e1701] flex flex-col items-center overflow-hidden font-titan pt-24 pb-10 text-[#D8CFC4]'>
      
      {/* --- HEADER --- */}
      <div className='flex w-full justify-between items-center px-10 absolute top-0 left-0 h-20 bg-[#1e1701]/80 backdrop-blur-sm z-50'>
        <button onClick={() => navigate(-1)} className='hover:bg-white/10 p-2 rounded-full transition-all'>
          <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-xl tracking-widest">CREATE QUOTE</h1>
        <button 
          onClick={handleSave}
          className="text-sm border border-[#D8CFC4]/40 rounded-full px-6 py-2 hover:bg-[#D8CFC4] hover:text-[#1e1701] transition-all font-sans"
        >
          Publish
        </button>
      </div>

      <div className='w-full max-w-6xl flex flex-col md:flex-row gap-8 px-6 mt-6 h-[80vh]'>
        
        {/* --- LEFT: CANVAS (PREVIEW) --- */}
        <div className='w-full md:w-2/3 h-full flex justify-center items-center bg-[#2a1208]/50 rounded-2xl border border-[#D8CFC4]/5 p-8'>
          
          {/* THE CARD ITSELF */}
          <div 
            className={`w-full max-w-2xl aspect-[4/5] md:aspect-video rounded-lg shadow-2xl flex flex-col justify-center items-center relative overflow-hidden transition-all duration-500 ${selectedTheme.classes}`}
            style={{ 
                backgroundImage: `url(${selectedTheme.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
          >
            {/* THE OVERLAY (Crucial for readability) */}
            <div className={`absolute inset-0 z-0 ${selectedTheme.overlay}`}></div>

            {/* CONTENT (Z-10 puts it above the overlay) */}
            <div className="relative z-10 w-full h-full p-10 flex flex-col justify-center items-center">
                
                {/* Decorative Quote Marks */}
                <span className="absolute top-6 left-8 text-6xl opacity-40 font-serif leading-none">"</span>
                
                {/* Main Text Input */}
                <textarea
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder='Type your favorite quote here...'
                  className='w-full bg-transparent resize-none text-center outline-none border-none text-2xl md:text-4xl font-serif placeholder:opacity-50 overflow-hidden'
                  style={{ color: 'inherit' }} 
                  rows={4}
                />

                {/* Author & Book Inputs */}
                <div className='mt-8 flex flex-col items-center gap-2 w-full opacity-90'>
                  <div className='flex items-center gap-3 w-full justify-center'>
                    <span className='h-[1px] w-8 bg-current opacity-40'></span>
                    <input 
                      type="text" 
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Author"
                      className='bg-transparent text-center outline-none text-lg font-sans placeholder:opacity-60 min-w-[100px]'
                    />
                    <span className='h-[1px] w-8 bg-current opacity-40'></span>
                  </div>
                  <input 
                    type="text" 
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    placeholder="Book Title"
                    className='bg-transparent text-center italic outline-none text-sm opacity-80 placeholder:opacity-60'
                  />
                </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: TOOLS --- */}
        <div className='w-full md:w-1/3 flex flex-col gap-6'>
          <div className='bg-[#2a1208] p-6 rounded-xl border border-[#D8CFC4]/10'>
            <h3 className='text-sm font-sans uppercase tracking-widest mb-4 opacity-70'>Select Theme</h3>
            
            <div className='grid grid-cols-3 gap-4'>
              {QUOTE_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-full aspect-square rounded-lg transition-transform hover:scale-105 flex flex-col justify-center items-center relative overflow-hidden group ${selectedTheme.id === theme.id ? 'ring-2 ring-[#D8CFC4] scale-105' : ''}`}
                >
                    {/* Tiny preview of the image on the button */}
                    <img src={theme.backgroundImage} alt={theme.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Theme Name Label */}
                    <div className="absolute bottom-0 w-full bg-black/60 text-[6px] py-1 text-center text-white backdrop-blur-sm">
                        {theme.name}
                    </div>

                    {/* Checkmark */}
                    {selectedTheme.id === theme.id && (
                        <div className='absolute top-2 right-2 bg-white text-black rounded-full p-1 z-10'>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                    )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuotes;