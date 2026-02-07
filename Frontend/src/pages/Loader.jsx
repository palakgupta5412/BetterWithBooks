// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import TextReveal from "../hooks/textReveal";
// import { useScrollReveal } from "../hooks/useScrollReveal";

// const Loader = ({ onLoadingComplete }) => {
//   const [stage, setStage] = useState("text"); // 'text', 'images', 'exit'

//   useEffect(() => {
//     // 1. Show text for 2 seconds
//     const timer1 = setTimeout(() => setStage("images"), 2000);
//     // 2. After images stagger in, trigger the final slide up
//     const timer2 = setTimeout(() => setStage("exit"), 4000);
    
//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//     };
//   }, []);

//   const images = [
//     "/aboutImg/1.jpg", "/aboutImg/2.jpg", "/aboutImg/3.jpg",
//     "/aboutImg/4.jpg", "/aboutImg/5.jpg", "/aboutImg/6.jpg"
//   ];

//   return (
//     <AnimatePresence onExitComplete={onLoadingComplete}>
//       {stage !== "exit" && (
//         <motion.div
//           initial={{ y: 0 }}
//           exit={{ y: "-100%" }}
//           transition={{ duration: 1, ease: [0.76, 0, 0.24, 1]}}
//           className="fixed inset-0 z-[999] bg-black overflow-hidden"
//         >
//           {/* Text Layer - Always centered */}
//           <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
//             <TextReveal 
//               text="b e t t e r w i t h b o o k s." 
//               className="text-4xl font-bold text-white" 
//             />
//           </div>

//           {/* Background Images Layer */}
//           <motion.div 
//             className="flex w-full h-full"
//             initial="hidden"
//             animate={stage === "images" ? "show" : "hidden"}
//             variants={{
//               show: { transition: { staggerChildren: 0.1 } }
//             }}
//           >
//             {images.map((src, i) => (
//               <motion.div
//                 key={i}
//                 variants={{
//                   hidden: { opacity: 0, y: 100},
//                   show: { opacity: 0.4, y: 0 } // "Dimly visible" at 0.4 opacity
//                 }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//                 className="h-full flex-1 border-x border-white/5"
//               >
//                 <img src={src} className="w-full h-full object-cover" alt="" />
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Loader;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextReveal from "../hooks/textReveal";

const Loader = ({ onLoadingComplete }) => {
  const [stage, setStage] = useState("initial"); // 'initial' -> 'enter' -> 'exit'

  useEffect(() => {
    // 1. Start: Text is visible. Wait 2s, then show images.
    const timer1 = setTimeout(() => setStage("enter"), 2000);
    
    // 2. Wait another 2.5s (4.5s total), then trigger the exit stagger
    const timer2 = setTimeout(() => setStage("exit"), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const images = [
    "/aboutImg/1.jpg", "/aboutImg/2.jpg", "/aboutImg/3.jpg",
    "/aboutImg/4.jpg", "/aboutImg/5.jpg", "/aboutImg/6.jpg"
  ];

  // Variants for the Parent Container (Controls timing)
  const containerVariants = {
    initial: {},
    enter: {
      transition: { staggerChildren: 0.1 }
    },
    exit: {
      transition: { staggerChildren: 0.1 } // Stagger the exit too!
    }
  };

  // Variants for the Child Strips (Controls movement)
  const stripVariants = {
    initial: { 
      y: 0, 
      opacity: 1 // Strip is fully visible (black)
    },
    enter: { 
      y: 0,
      opacity: 1 
    },
    exit: { 
      y: "-100%", // Slide UP off the screen
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  // Variants specifically for the Image inside the strip (The "dimly visible" part)
  const imageFadeVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 0.4, transition: { duration: 0.8 } }, // Fade in to 40%
    exit: { opacity: 0.4 } // Stay visible while sliding up
  };

  return (
    // We remove the conditional render {stage !== 'exit'} so Framer can handle the exit animation
    <motion.div
      className="fixed inset-0 z-[999] flex w-full h-screen pointer-events-none"
      variants={containerVariants}
      initial="initial"
      animate={stage} // "initial", "enter", or "exit"
    >
        {/* Text Layer - Fades out when exiting */}
        <motion.div 
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            animate={{ opacity: stage === "exit" ? 0 : 1 }}
            transition={{ duration: 0.5 }}
        >
            <TextReveal 
                text="b e t t e r w i t h b o o k s." 
                className="text-4xl font-bold text-white" 
            />
        </motion.div>

        {/* The Strips */}
        {images.map((src, i) => (
            <motion.div
                key={i}
                className="relative h-full flex-1 bg-black border-r border-white/5 overflow-hidden"
                variants={stripVariants}
                onAnimationComplete={() => {
                    // When the LAST strip finishes exiting, tell the app we are done
                    if (stage === "exit" && i === images.length - 1) {
                        onLoadingComplete();
                    }
                }}
            >
                {/* The Image itself inside the black strip */}
                <motion.img 
                    src={src} 
                    alt=""
                    className="w-full h-full object-cover" 
                    variants={imageFadeVariants}
                />
            </motion.div>
        ))}
    </motion.div>
  );
};

export default Loader;