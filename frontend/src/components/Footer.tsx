import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-neutral-500 py-12 px-6 border-t border-neutral-100">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight text-black">
            savety
          </Link>
          <p className="text-sm">End-to-end encrypted storage.</p>
        </div>

        <div className="flex gap-8 text-sm font-medium">
          <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-black transition-colors">Terms</Link>
          <Link href="#" className="hover:text-black transition-colors">Security</Link>
          <Link href="#" className="hover:text-black transition-colors">Contact</Link>
        </div>

        <div className="flex gap-6 items-center">
          <Link href="#" className="hover:text-black transition-colors"><FaTwitter className="w-5 h-5" /></Link>
          <Link href="#" className="hover:text-black transition-colors"><FaGithub className="w-5 h-5" /></Link>
          <Link href="#" className="hover:text-black transition-colors"><FaLinkedinIn className="w-5 h-5" /></Link>
          <Link href="#" className="hover:text-black transition-colors"><FaEnvelope className="w-5 h-5" /></Link>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-neutral-50 text-center text-xs">
        <p>© 2026 Savety Systems Inc. Built for the future.</p>
      </div>
    </footer>
  );
}
