import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-m3-surface text-m3-on-surface">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
