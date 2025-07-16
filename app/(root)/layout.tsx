// app/dashboard/layout.tsx
import Header from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="min-h-screen">
        <Header />
        {children}
        <Toaster />
      </main>
  );
}

// No ProtectRoute component needed!