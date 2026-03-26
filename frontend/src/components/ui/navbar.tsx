import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between py-4 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-gray-100/50 -mx-6 px-6 md:-mx-12 md:px-12 transition-all">
      
      <div className="flex items-center gap-2 font-bold text-xl text-[#4A331A]">
        <img src="/logo.png" alt="AfroLingo logo" className="w-6 h-6" /> AfroLingo
      </div>

      <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
        <Link href="/courses" className="hover:text-black transition-colors">Courses</Link>
        <Link href="/community" className="hover:text-black transition-colors">Community</Link>
        <Link href="/about" className="hover:text-black transition-colors">About</Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-[#4A331A] hover:bg-[#3a2815] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95">
          Go Premium
        </button>
        <div className="w-10 h-10 rounded-full bg-[#f3e8d6] flex items-center justify-center text-[#4A331A] font-bold text-sm border-2 border-white shadow-sm">
          JD
        </div>
      </div>

    </nav>
  );
}