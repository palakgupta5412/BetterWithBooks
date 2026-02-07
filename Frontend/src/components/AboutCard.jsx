import React from 'react'

const AboutCard = ({ title, image, description, icon, idx }) => {
  // 8 Shades of "Rich Dark Wood" - No whites, no light browns.
  const shades = [
    '#1a0f0e', // 1. Onyx Brown
    '#231412', // 2. Deep Bean
    '#2b1b17', // 3. Midnight Coffee
    '#251613', // 4. Burnt Umber
    '#1e1210', // 5. Blackened Oak
    '#140a09', // 6. Dark Espresso
    '#2d1e1a', // 7. Smoky Brown
    '#000000'  // 8. Pure Black-Brown
  ];

  return (
    <div 
      className="group relative w-[20vw] h-[65vh] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[#000000]/50 cursor-pointer border border-white/5"
      style={{ backgroundColor: shades[idx % shades.length] }}
    >
      {/* Background Image - Smooth reveal with a subtle zoom */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out z-0 scale-110 group-hover:scale-100"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Dark Gradient Overlay: Keeps text readable when image appears */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 z-10" />

      {/* Content Layer */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between items-start p-8">
        
        {/* Numbering: Big, bold, and subtle */}
        <h1 className="text-6xl font-black text-white/20 group-hover:text-white/50 transition-all duration-700">
          {(idx + 1).toString().padStart(2, '0')}
        </h1>
        
        <div className="w-full">
          {/* Icon: Floating in a glass-morphism circle */}
          <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-md flex justify-center items-center mb-6 border border-white/10 group-hover:border-[#ffba66]/50 transition-colors">
            <div className="text-[#ffba66] group-hover:scale-110 transition-transform duration-500">
              {icon}
            </div>
          </div>
          
          {/* Title: Gold/Amber color to match your vibe */}
          <h3 className="text-2xl font-bold mb-3 text-[#ffba66] tracking-tight">
            {title}
          </h3>
          
          {/* Description: Soft grey-white for readability */}
          <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-100 transition-colors duration-500">
            {description}
          </p>
          
          {/* Bottom Accent Line */}
          <div className="w-0 group-hover:w-full h-[1px] bg-[#ffba66] mt-6 transition-all duration-700 opacity-40" />
        </div>
      </div>
    </div>
  )
}

export default AboutCard