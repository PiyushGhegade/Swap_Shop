import { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  
  // Don't show header and footer on auth page
  const isAuthPage = location === "/auth";
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
