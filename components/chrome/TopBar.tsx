"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassSurface } from "./GlassSurface";
import { Sun, Moon, MoreVertical, Menu, Search } from "lucide-react";
import { useUI } from "@/providers";

export interface TopBarProps {
  githubUrl?: string;
  linkedinUrl?: string;
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function TopBar({
  githubUrl = "https://github.com/0xraiven",
  linkedinUrl = "https://linkedin.com",
}: TopBarProps) {
  const { openCommandPalette, openMobileSidebar } = useUI();
  const [isDark, setIsDark] = useState(true);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-12">
      <GlassSurface
        className="w-full h-full rounded-none border-t-0 border-x-0 border-b px-3 sm:px-4 flex items-center justify-between"
        style={{ borderRadius: 0 }}
      >
        {/* LEFT: Mobile hamburger + r41n • Security Knowledge Base */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openMobileSidebar}
            aria-label="Open mobile navigation menu"
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors md:hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm tracking-tight font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1 py-0.5 group"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border group-hover:border-accent/60 transition-colors shrink-0 bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github.com/0xraiven.png"
                alt="0xraiven"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">
              r41n
            </span>
            <span className="text-text-secondary text-xs">•</span>
            <span className="text-xs text-text-secondary hidden sm:inline truncate max-w-[200px] md:max-w-none">
              Security Knowledge Base
            </span>
          </Link>
        </div>

        {/* RIGHT: Search bar, GitHub, LinkedIn, Theme toggle, overflow menu */}
        <div className="flex items-center gap-2">
          {/* Expanded Search Bar (⌘K) */}
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Search knowledge base (⌘K)"
            className="w-36 xs:w-48 sm:w-64 md:w-80 lg:w-96 h-8 px-2.5 sm:px-3 rounded border border-border bg-surface-2/60 hover:bg-surface-2 hover:border-accent/40 transition-all flex items-center justify-between text-xs font-mono text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-accent shrink-0 group-hover:scale-105 transition-transform" />
              <span className="truncate text-[11px] sm:text-xs">
                <span className="hidden md:inline">Search knowledge base...</span>
                <span className="inline md:hidden">Search...</span>
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border/80 text-text-secondary font-mono">
              ⌘K / ctrl+K
            </kbd>
          </button>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOverflowOpen(!overflowOpen)}
              aria-label="More options"
              aria-expanded={overflowOpen}
              className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent sm:hidden"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {overflowOpen && (
              <div className="absolute right-0 mt-1 w-48 py-1 rounded bg-surface border border-border shadow-lg z-50 text-xs font-mono">
                <div className="px-3 py-1.5 text-text-secondary border-b border-border">
                  r41n knowledge base
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOverflowOpen(false);
                    openCommandPalette();
                  }}
                  className="w-full text-left px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2 flex items-center justify-between"
                >
                  <span>Search</span>
                  <span className="text-[10px] text-accent">⌘K</span>
                </button>
                <Link
                  href="/"
                  onClick={() => setOverflowOpen(false)}
                  className="block px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2"
                >
                  README
                </Link>
                <Link
                  href="/projects"
                  onClick={() => setOverflowOpen(false)}
                  className="block px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2"
                >
                  Projects
                </Link>
                <Link
                  href="/writeups"
                  onClick={() => setOverflowOpen(false)}
                  className="block px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2"
                >
                  Writeups
                </Link>
              </div>
            )}
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
