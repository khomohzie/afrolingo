import Navbar from './ui/navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-[#4A331A] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}