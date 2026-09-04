import React from "react";
import { TopBar } from "@/components/chrome/TopBar";
import { Sidebar } from "@/components/navigation/Sidebar";
import { PageAside } from "@/components/navigation/PageAside";
import { TOCItem, RelatedItem } from "@/types";

export interface KnowledgeBaseLayoutProps {
  children: React.ReactNode;
  headings?: TOCItem[];
  relatedItems?: RelatedItem[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export function KnowledgeBaseLayout({
  children,
  headings,
  relatedItems,
  githubUrl,
  linkedinUrl,
}: KnowledgeBaseLayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      {/* MANDATORY FIXED TOPBAR */}
      <TopBar githubUrl={githubUrl} linkedinUrl={linkedinUrl} />

      {/* THREE-COLUMN SHELL (Desktop: Sidebar | Main | PageAside) */}
      <div className="pt-12 flex flex-1 w-full max-w-[1600px] mx-auto">
        {/* DESKTOP/TABLET SIDEBAR (drops on mobile) */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto w-full">
          {children}
        </main>

        {/* CONDITIONAL PAGE ASIDE (TOC + RelatedContent, drops on tablet/mobile) */}
        <PageAside headings={headings} relatedItems={relatedItems} />
      </div>
    </div>
  );
}
