"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Pricing", href: "#pricing" },
    { name: "Blog", href: "#blog" },
    { name: "About", href: "#about" },
    { name: "Download", href: "#download" },
    { name: "Help", href: "#help" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-neutral-50 h-20 flex items-center">
      <div className="max-w-[1400px] mx-auto px-10 w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold tracking-tight text-black flex-shrink-0">
          savety
        </Link>

        {/* Center Nav */}
        <div className="hidden lg:flex items-center gap-x-10 text-[16px] font-medium text-neutral-600">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="hover:text-black transition-colors px-2"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Nav */}
        <div className="hidden md:flex items-center gap-8 flex-shrink-0">
          <Link 
            href="https://github.com" 
            className="flex items-center gap-3 text-[16px] font-medium text-neutral-600 hover:text-black transition-colors"
          >
            <FaGithub className="w-5 h-5 text-black" />
            <span>25k</span>
          </Link>
          <Link 
            href="/login" 
            className="btn-primary py-3 px-8 text-sm"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-neutral-600"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 lg:hidden bg-white border-b border-neutral-100 p-8 flex flex-col space-y-6 animate-reveal shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium text-neutral-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-4">
             <Link 
              href="/signup" 
              onClick={() => setIsOpen(false)}
              className="btn-primary text-center py-4"
            >
              Sign up
            </Link>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="btn-secondary text-center py-4"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
