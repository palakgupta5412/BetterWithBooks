// // import React from 'react'
// // import Suggest from '../components/Suggest'

// // const Info = ({  }) => {
// //   return (
// //     <div className='w-full min-h-screen relative p-10 flex flex-col'>
// //         <img src='/buttonBg.png' className='opacity-70 absolute left-0 top-0 w-full h-full object-cover'/>
// //         <div className='w-full flex'>
// //             <div className='pl-12 h-80 flex justify-center items-center object-cover'>
// //                 <img src='/aboutImg/3.jpg' className='opacity-100 w-full h-full object-contain'/>
// //             </div>
            
// //             <div className='pl-10 flex flex-col justify-start pt-8 w-[50%] text-white '>
// //                 <h1 className='font-gravitas text-3xl font-bold'>   {"Book Name"}</h1>
// //                 <p className='text-md font-bold opacity-70 mt-4'>{"Author Name"}</p>
// //                 <p className='text-sm opacity-70 mt-4'>{"Description of the book goes here."}</p>
// //                 <div className='flex'>
// //                     {["Fiction", "Adventure", "Mystery"].map((genre) => <p className='text-sm font-bold opacity-70 mt-4 mr-2 border border-[#ffba66] rounded-full px-2 py-1'>{genre}</p>)}
// //                 </div>
// //             </div>
            
// //         </div>

// //         <div className=' h-[1px] bg-[#ffba66] mt-16 opacity-35 w-[60%] mx-auto'></div>
// //         <Suggest />
// //     </div>  
// //   )
// // }

// // export default Info

// import React from 'react';
// import Suggest from '../components/Suggest';
// import { useLocation, useNavigate } from 'react-router-dom';

// const Info = () => {

//   const location = useLocation();
//   const navigate = useNavigate();

//   const {book} =  location.state || {
//     name: "The Seven Husbands of Evelyn Hugo",
//     author: "Taylor Jenkins Reid",
//     description: "Aging Hollywood movie icon Evelyn Hugo is ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself.",
//     genres: ["Fiction", "Historical", "Romance"],
//     cover: "/aboutImg/3.jpg"
//   };

//   return (
//     <div className='py-20 w-full min-h-screen bg-[#1a0f0a] text-white overflow-x-hidden'>
//       {/* Hero Header Section */}
//       <div className='relative w-full h-[60vh] flex items-center justify-center overflow-hidden'>
//         <img src='/buttonBg.png' className='absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay'/>
        
//         <div className='relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl px-10'>
//           {/* Book Cover with Glow */}
//           <div className='shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10 rounded-lg overflow-hidden h-96 transition-transform hover:scale-105 duration-500'>
//             <img src={book.cover} className='h-full object-cover' alt={book.name}/>
//           </div>

//           {/* Text Content */}
//           <div className='flex flex-col items-start'>
//             <h1 className='text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#ffba66]'>
//               {book.name}
//             </h1>
//             <p className='text-xl italic opacity-80 mt-2 font-medium'>by {book.author}</p>
            
//             <div className='flex flex-wrap gap-2 mt-6'>
//               {book.genres.map((genre) => (
//                 <span key={genre} className='text-xs uppercase tracking-widest font-bold border border-[#ffba66]/40 text-[#ffba66] rounded-full px-4 py-1.5 bg-[#ffba66]/5'>
//                   {genre}
//                 </span>
//               ))}
//             </div>

//             <p className='text-lg leading-relaxed opacity-70 mt-8 max-w-2xl'>
//               {book.description}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Elegant Divider */}
//       <div className='relative flex items-center py-10'>
//         <div className='flex-grow h-[1px] bg-gradient-to-r from-transparent via-[#ffba66]/30 to-transparent'></div>
//       </div>

//       {/* Suggestions Section */}
//       <div className='pb-20'>
//         <Suggest similarTo={book.name} />
//       </div>
//     </div>
//   );
// };

// export default Info;


import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Suggest from '../components/Suggest';

const Info = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Safe access to state. If location.state is null, we provide an empty object.
  const state = location.state || {};
  const book = state.book;

  // 2. Early return or fallback if no book was passed
  // This prevents the "map" error on a page refresh
  if (!book) {
    return (
      <div className="min-h-screen bg-[#1a0f0a] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl mb-4">No book selected</h2>
        <button 
          onClick={() => navigate('/tbr')} 
          className="bg-[#ffba66] text-black px-6 py-2 rounded-full font-bold"
        >
          Back to Shelves
        </button>
      </div>
    );
  }

  // 3. Normalize genres to ensure it's always an array
  const genres = book.genre || book.genres || [];

  return (
    <div className='py-20 w-full min-h-screen bg-[#1a0f0a] text-white overflow-x-hidden relative'>
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-10 left-10 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
      >
        <FaArrowLeft size={20} />
      </button>

      <div className='relative w-full h-auto flex items-center justify-center overflow-hidden py-10'>
        <img src='/buttonBg.png' alt="" className='absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay'/>
        
        <div className='relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl px-10'>
          {/* Book Cover */}
          <div className='shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-white/5 rounded-lg overflow-hidden h-96 transition-transform hover:scale-105 duration-500'>
            <img 
               src={book.coverImage || book.cover || "/aboutImg/3.jpg"} 
               className='h-full object-cover' 
               alt={book.bookName}
            />
          </div>

          {/* Text Content */}
          <div className='flex flex-col items-start'>
            <h1 className='text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#ffba66]'>
              {book.bookName}
            </h1>
            <p className='text-xl italic opacity-80 mt-2 font-medium'>by {book.author}</p>
            
            {/* Safe Map: genres is guaranteed to be an array now */}
            <div className='flex flex-wrap gap-2 mt-6'>
              {genres.map((g, idx) => (
                <span key={idx} className='text-xs uppercase tracking-widest font-bold border border-[#ffba66]/40 text-[#ffba66] rounded-full px-4 py-1.5 bg-[#ffba66]/5'>
                  {g}
                </span>
              ))}
            </div>

            <p className='text-lg leading-relaxed opacity-70 mt-8 max-w-2xl'>
              {book.description || "No description available for this title."}
            </p>
          </div>
        </div>
      </div>

      <div className='relative flex items-center py-10'>
        <div className='flex-grow h-[1px] bg-gradient-to-r from-transparent via-[#ffba66]/30 to-transparent'></div>
      </div>

      <div className='pb-20'>
        <Suggest similarTo={book.bookName} />
      </div>
    </div>
  );
};

export default Info;