// import React from 'react'
// import { BsArrowReturnRight } from "react-icons/bs";
// import { motion } from 'framer-motion';

// const Button = ({ text, onClick, className }) => {
//   const textVariants = {
//     initial: { y: '50%' },
//     hover: {
//       y: '-100%',
//       transition: {
//         duration: 0.6,
//         ease: [0.19, 1, 0.22, 1]
//       }
//     }
//   };
//   return (
//     <motion.button whileHover="hover" onClick={onClick} className={`bg-[#E6D5A5] font-bold cursor-pointer relative px-4 py-2 drop-shadow-[0_0_10px_rgba(201,162,77,0.55)] rounded-md font-playfair  text-[#3b1a0a] bg-[linear-gradient(to_bottom,#f3e2b2,#e4c98f,#d4b06b)] border border-[#b98b3a] shadow-[0_6px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-110 hover:shadow-[0_8px_26px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] active:scale-[0.98] transition-all duration-200 hover:scale-95 ease-in-out text-center flex items-center text-sm justify-center  ${className}`}>
//       <div className='flex items-center gap-2 overflow-hidden '>
//         <motion.div variants={textVariants} className='flex flex-col h-5'>
//           <p>{text}</p>
//           <p>{text}</p>  
//         </motion.div>
//         <BsArrowReturnRight className='text-[#3b1a0a]' size={16}/>  
//       </div>
//     </motion.button>
//   )
// }

// export default Button

import React from 'react'
import { BsArrowReturnRight } from "react-icons/bs";
import { motion } from 'framer-motion';

const Button = ({ text, onClick, className }) => {
  const textVariants = {
    initial: { y: '50%' },
    hover: {
      y: '-100%',
      transition: {
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  };
  return (
    <motion.button whileHover="hover" onClick={onClick} className={`bg-[#E6D5A5] font-bold cursor-pointer relative px-4 py-2 drop-shadow-[0_0_10px_rgba(201,162,77,0.55)] rounded-md font-playfair  text-[#3b1a0a] bg-[linear-gradient(to_bottom,#f3e2b2,#e4c98f,#d4b06b)] border border-[#b98b3a] shadow-[0_6px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-110 hover:shadow-[0_8px_26px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] active:scale-[0.98] transition-all duration-200 hover:scale-95 ease-in-out text-center flex items-center text-sm justify-center  ${className}`}>
      <div className='flex items-center gap-2 overflow-hidden '>
        <motion.div variants={textVariants} className='flex flex-col h-5'>
          <p>{text}</p>
          <p>{text}</p>  
        </motion.div>
        <BsArrowReturnRight className='text-[#3b1a0a]' size={16}/>  
      </div>
    </motion.button>
  )
}

export default Button