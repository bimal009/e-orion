// app/dashboard/layout.tsx
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {children}
      <Toaster />
    </main>
  );
}

// No ProtectRoute component needed!
