"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-neutral-100 antialiased">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Additional clean content can go here if needed, 
            but keeping it minimal to match the reference. */}
      </main>

      <Footer />
    </div>
  );
}

