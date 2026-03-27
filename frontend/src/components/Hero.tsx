"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden px-6 bg-white">
      <div className="max-w-[1200px] mx-auto text-center w-full">
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-[120px] font-bold tracking-tight mb-8 leading-[1.1] md:leading-[1.1]"
        >
          <span className="text-[#00d300] block mb-2">Safe home</span>
          <span className="text-black">for your photos</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-3xl text-neutral-400 font-medium mb-20 max-w-4xl mx-auto"
        >
          End-to-end encrypted. Cross-platform. Open-source.
        </motion.p>
        
        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link href="/signup" className="btn-primary text-2xl px-14 py-6">
            Sign up
          </Link>
          <Link href="/login" className="btn-secondary text-2xl px-14 py-6">
            Login
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
