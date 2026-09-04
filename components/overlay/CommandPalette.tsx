"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GlassSurface } from "@/components/chrome/GlassSurface";
import {
  Search,
  X,
  FileCode2,
  FolderGit2,
  FlaskConical,
  FileText,
  Compass,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import type { SearchItem } from "@/lib/search-index";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [rawSelectedIndex, setSelectedIndex] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Lazy-load static search index on first open
  useEffect(() => {
    if (!isOpen || hasLoaded) return;

    let ignore = false;
    fetch("/search-index.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchItem[]) => {
        if (!ignore) {
          setItems(data);
          setHasLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setItems([]);
          setHasLoaded(true);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isOpen, hasLoaded]);

  // Focus input when opened
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Default / empty query view: show primary pages + top projects
      return items.slice(0, 8);
    }

    const tokens = trimmed.split(/\s+/);
    return items.filter((item) => {
      const searchTarget = [
        item.title,
        item.description,
        item.category || "",
        ...(item.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((token) => searchTarget.includes(token));
    });
  }, [items, query]);

  // Clamped selected index
  const selectedIndex = Math.min(
    rawSelectedIndex,
    Math.max(0, filteredItems.length - 1)
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (filteredItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          onClose();
          router.push(selected.url);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, router]);

  // Scroll active item into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;
    const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const isLoading = !hasLoaded;

  const getKindIcon = (kind: SearchItem["kind"]) => {
    switch (kind) {
      case "project":
        return <FolderGit2 className="w-4 h-4 text-accent" />;
      case "writeup":
        return <FileCode2 className="w-4 h-4 text-emerald-400" />;
      case "research":
      case "lab-report":
        return <FlaskConical className="w-4 h-4 text-purple-400" />;
      case "note":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "page":
      default:
        return <Compass className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search and command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
    >
      {/* Dimmed backdrop - flat, unblurred per architecture §4.4 */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl z-10 animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
        <GlassSurface className="w-full rounded-lg border border-border shadow-2xl overflow-hidden flex flex-col">
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/70 bg-surface/40">
            <Search className="w-4 h-4 text-text-secondary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search projects, writeups, research, pages..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none font-mono"
              aria-label="Search query"
              autoComplete="off"
              spellCheck="false"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedIndex(0);
                }}
                aria-label="Clear search query"
                className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-border text-text-secondary select-none">
                ESC
              </kbd>
            )}
          </div>

          {/* Results List */}
          <div
            ref={resultsContainerRef}
            className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-border/30 text-xs font-mono select-none"
          >
            {isLoading ? (
              <div className="p-6 text-center text-text-secondary text-xs">
                Loading index...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <p className="text-text-primary font-medium">No results found</p>
                <p className="text-text-secondary text-[11px]">
                  No matches found for &quot;{query}&quot;. Try searching for a technology or category.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {!query.trim() && (
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-secondary/70 font-semibold">
                    Quick Navigation
                  </div>
                )}

                {filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      onClick={() => {
                        onClose();
                        router.push(item.url);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-2.5 rounded cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-surface-2 text-text-primary border-l-2 border-accent pl-2"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0">{getKindIcon(item.kind)}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary truncate text-xs">
                              {item.title}
                            </span>
                            {item.category && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-surface border border-border text-text-secondary shrink-0">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-secondary truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3 text-text-secondary">
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] text-accent">
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                        <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "opacity-100 text-accent" : "opacity-0"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Palette Footer Help Bar */}
          <div className="px-4 py-2 bg-surface/60 border-t border-border/70 flex items-center justify-between text-[11px] text-text-secondary select-none font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border text-[9px]">↑</kbd>
                <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border text-[9px]">↓</kbd>
                <span className="text-[10px]">to navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9px]">↵</kbd>
                <span className="text-[10px]">to select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9px]">esc</kbd>
              <span className="text-[10px]">to close</span>
            </span>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
