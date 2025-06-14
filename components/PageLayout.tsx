"use client";
import { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: ReactNode;
  showNavFooter?: boolean;
}

export function PageLayout({ children, showNavFooter = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {showNavFooter && <Navigation />}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-24 pb-16">{children}</main>
      {showNavFooter && <Footer />}
    </div>
  );
}
