'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorGlow() {
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);

  const x = useSpring(rawX, { stiffness: 50, damping: 16, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 50, damping: 16, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
      style={{
        x,
        y,
        width: 650,
        height: 480,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'screen',
        background:
          'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(16,185,129,0.18) 0%, rgba(14,165,233,0.06) 48%, transparent 80%)',
        filter: 'blur(10px)',
      }}
    />
  );
}
