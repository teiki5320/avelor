'use client';
import { motion } from 'framer-motion';

export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        initial={{ x: -80, y: -40, scale: 1 }}
        animate={{ x: [-80, 40, -80], y: [-40, 30, -40], scale: [1, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(74,114,184,0.32), transparent 60%)',
        }}
      />
      <motion.div
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.18, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-32 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, rgba(30,61,130,0.22), transparent 60%)',
        }}
      />
      <motion.div
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 0.92, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/3 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201,120,48,0.16), transparent 65%)',
        }}
      />
    </div>
  );
}
