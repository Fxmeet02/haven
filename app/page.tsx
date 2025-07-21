'use client';

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
        Welcome to Happi
      </motion.h1>
      <p className="text-center max-w-md text-gray-700">
       Hey, you good?
If not, that’s okay. We’re here for the messy, the anxious, the overthinkers, the “I don’t even know what’s wrong” days. Meet your AI therapist: real talk, zero judgment, always on. Chat anytime. Vent, reflect, breathe — whatever you need, we got you.


      </p>
    </main>
  );
}
