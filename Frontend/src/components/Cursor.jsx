import React, { useEffect, useState } from 'react';

const Cursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  return (
    <div
      className="w-4 h-4 cursor-none mix-blend-difference rounded-full bg-[#ffba66] fixed pointer-events-none z-[999]"
      style={{
        top: mousePos.y,
        left: mousePos.x,
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
      }}
    ></div>
  );
};

export default Cursor;
