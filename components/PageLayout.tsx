"use client";
import { ReactNode } from "react";

import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-24 pb-16">{children}</main>
      <Footer />
    </div>
  );
}
