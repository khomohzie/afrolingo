import { Geist } from "next/font/google";
import Layout from "../components/Layout";
// import Image from "next/image"; // Uncomment this when you have your image file!

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <Layout>
      <div className={`${geistSans.className} font-sans`}>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-16 pb-24">
          
          <div className="flex flex-col gap-8 text-left">
            <header className="space-y-4">
              <span className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                Learn African Dialects
              </span>
              <h1 className="text-6xl md:text-[84px] font-black text-[#1B252E] leading-[0.9] tracking-tighter">
                Unlock the <br />
                <span className="text-[#4A331A]">voices</span> of <br />
                Africa.
              </h1>
            </header>

            <p className="text-gray-500 text-lg max-w-md leading-relaxed">
              Master indigenous languages like Yoruba, Hausa, and Igbo. Connect deeply with a vibrant community of learners from across the globe. Professional courses for real-world fluency.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="bg-[#4A331A] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#3a2815] transition-all shadow-lg shadow-amber-900/20 active:scale-95">
                Start Learning Now
              </button>
              <button className="border-2 border-gray-100 bg-white text-[#4A331A] px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95">
                View Courses
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-[#FAFAFA] bg-[#FFD29D] shadow-sm" />
                ))}
              </div>
              <p className="text-sm font-bold text-gray-400">
                <span className="text-black">2,500+</span> learners joined this week
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#E8E1D5] rounded-[40px] rotate-3" />
            
            <div className="relative aspect-[5/6] w-full bg-[#f3e8d6] rounded-[32px] overflow-hidden border-[12px] border-white shadow-2xl flex items-center justify-center">
              <span className="text-gray-400 italic font-medium">Illustration Placeholder</span>
            </div>
          </div>

        </section>
      </div>
    </Layout>
  );
}