"use client";

import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/chrome/TopBar";
import { Sidebar } from "@/components/navigation/Sidebar";
import { PageAside } from "@/components/navigation/PageAside";
import { PageTransition } from "@/components/animation/PageTransition";
import { TOCItem, RelatedItem } from "@/types";

export interface KnowledgeBaseLayoutProps {
  children: React.ReactNode;
  headings?: TOCItem[];
  relatedItems?: RelatedItem[];
  githubUrl?: string;
  xUrl?: string;
  linkedinUrl?: string;
}

export function KnowledgeBaseLayout({
  children,
  headings,
  relatedItems,
  githubUrl,
  xUrl,
  linkedinUrl,
}: KnowledgeBaseLayoutProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);

  // Scroll to top of main content when navigating between pages
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <div className="h-screen w-full overflow-hidden bg-bg text-text-primary">
      {/* MANDATORY FIXED TOPBAR (48px) */}
      <TopBar githubUrl={githubUrl} xUrl={xUrl} linkedinUrl={linkedinUrl} />

      {/* THREE-COLUMN SHELL: Definite bounds from top-12 (48px) to bottom-0 */}
      <div className="fixed top-12 bottom-0 left-0 right-0 flex w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* DESKTOP/TABLET SIDEBAR (drops on mobile) */}
        <div className="hidden md:flex shrink-0 h-full overflow-hidden">
          <Sidebar />
        </div>

        {/* MAIN CONTENT AREA - Isolated scroll container */}
        <main
          ref={mainRef}
          id="main-content"
          className="flex-1 min-w-0 h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto w-full terminal-scrollbar"
        >
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* CONDITIONAL PAGE ASIDE (TOC + RelatedContent, drops on tablet/mobile) */}
        <PageAside headings={headings} relatedItems={relatedItems} />
      </div>
    </div>
  );
}
