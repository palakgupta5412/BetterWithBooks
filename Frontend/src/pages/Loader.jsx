import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextReveal from "../hooks/textReveal";

const Loader = ({ onLoadingComplete }) => {
  const [stage, setStage] = useState("initial");

  // Logic: Show 3 images on mobile, 6 on desktop
  const allImages = [
    "/aboutImg/1.jpg", "/aboutImg/2.jpg", "/aboutImg/3.jpg",
    "/aboutImg/4.jpg", "/aboutImg/5.jpg", "/aboutImg/6.jpg"
  ];

  useEffect(() => {
    // 1. Wait 2s, shrink bar & show images ("enter")
    const timer1 = setTimeout(() => setStage("enter"), 2000);
    // 2. Wait another 2.5s, then slide up ("exit")
    const timer2 = setTimeout(() => setStage("exit"), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const containerVariants = {
    initial: {},
    enter: { transition: { staggerChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.1 } }
  };

  const stripVariants = {
    initial: { y: 0, opacity: 1 },
    enter: { y: 0, opacity: 1 },
    exit: { 
      y: "-100%", 
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  const imageFadeVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 0.4, transition: { duration: 0.8 } },
    exit: { opacity: 0.4 } 
  };

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex w-full h-screen pointer-events-none"
      variants={containerVariants}
      initial="initial"
      animate={stage}
    >
        {/* --- RESTORED PROGRESS BAR --- */}
        <motion.div
          className="h-1 bg-white fixed top-0 left-0 z-50"
          initial={{ width: "100%" }}
          animate={{ width: stage === "initial" ? "100%" : "0%" }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          // Hide bar completely when exiting so it doesn't float there
          style={{ opacity: stage === "exit" ? 0 : 1 }}
        />

        {/* Text Layer */}
        <motion.div 
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4"
            animate={{ opacity: stage === "exit" ? 0 : 1 }}
            transition={{ duration: 0.5 }}
        >
            <TextReveal 
                text="b e t t e r w i t h b o o k s." 
                className="text-xl md:text-4xl font-bold text-white text-center" 
            />
        </motion.div>

        {/* Images Strips */}
        {allImages.map((src, i) => (
            <motion.div
                key={i}
                // Hide images 4,5,6 on Mobile
                className={`
                    relative h-full flex-1 bg-black border-r border-white/5 overflow-hidden
                    ${i >= 3 ? 'hidden md:block' : 'block'} 
                `}
                variants={stripVariants}
                onAnimationComplete={() => {
                    const isMobile = window.innerWidth < 768;
                    // On mobile, the last visible image is index 2. On desktop, it is index 5.
                    const lastIndex = isMobile ? 2 : 5;

                    if (stage === "exit" && i === lastIndex && onLoadingComplete) {
                        onLoadingComplete();
                    }
                }}
            >
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