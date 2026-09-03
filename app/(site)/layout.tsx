import { Navbar } from "@/components/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-brand-page">
      <Navbar />
      {children}
    </div>
  );
}
