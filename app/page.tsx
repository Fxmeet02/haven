'use client';
Happi
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.h1
        className="text-4xl font-bold text-brand mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Haven Calmi Clone
      </motion.h1>
      <p className="text-center max-w-md text-gray-700">
        A clean, minimal Next.js + Tailwind + Framer Motion starter to replace calmi.so easily with your flow and animations.
      </p>
    </main>
  );
}
