import Header from "@/components/shared/Navbar";

export default function authLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
      <main
      >
        
          {children}
      </main>
  );
}
