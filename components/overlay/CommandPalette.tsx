"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GlassSurface } from "@/components/chrome/GlassSurface";
import {
  Search,
  X,
  FolderGit2,
  FlaskConical,
  CornerDownLeft,
  Terminal,
  ShieldAlert,
  BookOpen,
  Microscope,
  UserCheck,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import type { SearchItem } from "@/lib/search-index";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterCategory = "all" | "project" | "writeup" | "note" | "research" | "page";

const FILTER_TABS: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "project", label: "Projects" },
  { id: "writeup", label: "Writeups" },
  { id: "note", label: "Notes" },
  { id: "research", label: "Research" },
  { id: "page", label: "Pages" },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
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

  // Focus input and reset selection when opened
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery("");
    setActiveFilter("all");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  // Filter items based on query and active category filter
  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by tab
    if (activeFilter !== "all") {
      if (activeFilter === "research") {
        result = result.filter((i) => i.kind === "research" || i.kind === "lab-report");
      } else {
        result = result.filter((i) => i.kind === activeFilter);
      }
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return result;
    }

    const tokens = trimmed.split(/\s+/);
    return result.filter((item) => {
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
  }, [items, query, activeFilter]);

  // Clamped selected index
  const selectedIndex = Math.min(
    rawSelectedIndex,
    Math.max(0, filteredItems.length - 1)
  );

  const navigateToItem = useCallback(
    (item: SearchItem) => {
      handleClose();
      router.push(item.url);
    },
    [handleClose, router]
  );

  // Keyboard navigation & Tab cycle
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      // Tab cycles through filter categories
      if (e.key === "Tab") {
        e.preventDefault();
        const currentIndex = FILTER_TABS.findIndex((t) => t.id === activeFilter);
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + FILTER_TABS.length) % FILTER_TABS.length
          : (currentIndex + 1) % FILTER_TABS.length;
        setActiveFilter(FILTER_TABS[nextIndex].id);
        setSelectedIndex(0);
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
          navigateToItem(selected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, activeFilter, handleClose, navigateToItem]);

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

  // Semantic icon with container styling for each item
  const getItemIcon = (item: SearchItem) => {
    // Specific iconic overrides for top-level pages
    if (item.id === "page-readme") {
      return (
        <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
          <Terminal className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (item.id === "page-projects") {
      return (
        <div className="w-7 h-7 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
          <FolderGit2 className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (item.id === "page-writeups") {
      return (
        <div className="w-7 h-7 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (item.id === "page-notes") {
      return (
        <div className="w-7 h-7 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
          <BookOpen className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (item.id === "page-research") {
      return (
        <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
          <Microscope className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (item.id === "page-about") {
      return (
        <div className="w-7 h-7 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
          <UserCheck className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (item.id === "page-resume") {
      return (
        <div className="w-7 h-7 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
          <Award className="w-3.5 h-3.5" />
        </div>
      );
    }

    // Default icon mappings by item kind
    switch (item.kind) {
      case "project":
        return (
          <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/25 text-blue-400 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-3.5 h-3.5" />
          </div>
        );
      case "writeup":
        return (
          <div className="w-7 h-7 rounded-md bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        );
      case "research":
      case "lab-report":
        return (
          <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
            <FlaskConical className="w-3.5 h-3.5" />
          </div>
        );
      case "note":
        return (
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
        );
      case "page":
      default:
        return (
          <div className="w-7 h-7 rounded-md bg-accent/10 border border-accent/25 text-accent flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  // Color-coded badge for category tags
  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case "red-team-tooling":
      case "field-reports":
        return "text-rose-400 bg-rose-500/10 border-rose-500/25";
      case "cloud-security":
      case "projects":
        return "text-blue-400 bg-blue-500/10 border-blue-500/25";
      case "research":
      case "lab-environment":
        return "text-accent bg-accent/10 border-accent/25";
      case "knowledge-base":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
      case "operator":
      case "system":
      default:
        return "text-accent bg-accent/10 border-accent/25";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search and command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[12vh] px-3 sm:px-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-150"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl z-10 animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
        <GlassSurface className="w-full rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/70 bg-surface/50">
            <Search className="w-4 h-4 text-accent shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search writeups, projects, notes, research, commands..."
              className="flex-1 bg-transparent text-sm sm:text-base text-text-primary placeholder:text-text-secondary/50 focus:outline-none font-mono"
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
                  inputRef.current?.focus();
                }}
                aria-label="Clear search query"
                className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-border text-text-secondary select-none">
                ESC
              </kbd>
            )}
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/40 bg-surface/30 overflow-x-auto text-xs font-mono select-none scrollbar-none">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary/60 font-semibold mr-1 shrink-0">
              Filter:
            </span>
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setSelectedIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                    isActive
                      ? "bg-accent/20 text-accent border border-accent/40 shadow-xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Results List */}
          <div
            ref={resultsContainerRef}
            className="max-h-[58vh] overflow-y-auto p-2 divide-y divide-border/20 text-xs font-mono select-none"
          >
            {isLoading ? (
              <div className="p-8 text-center text-text-secondary text-xs flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>Loading index...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <p className="text-text-primary font-medium text-sm">No matches found</p>
                <p className="text-text-secondary text-xs">
                  No records match &quot;{query}&quot;
                  {activeFilter !== "all" && ` in ${activeFilter} category`}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveFilter("all");
                  }}
                  className="mt-2 text-xs text-accent hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Clear filters and reset</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Result count or Header */}
                <div className="px-3 py-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-text-secondary/70 font-semibold">
                  <span>{query.trim() ? "Search Results" : "Quick Navigation & Index"}</span>
                  <span className="font-normal text-text-secondary/50">
                    {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
                  </span>
                </div>

                {filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      onClick={() => navigateToItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border ${
                        isSelected
                          ? "bg-surface-2 border-accent/40 text-text-primary shadow-xs"
                          : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {getItemIcon(item)}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary truncate text-xs group-hover:text-accent transition-colors">
                              {item.title}
                            </span>
                            {item.category && (
                              <span
                                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-semibold shrink-0 ${getCategoryBadgeClass(
                                  item.category
                                )}`}
                              >
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-secondary truncate mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center shrink-0 text-text-secondary">
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 text-[10px] font-mono font-medium animate-in fade-in duration-100">
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Palette Footer Status Bar */}
          <div className="px-4 py-2.5 bg-surface/70 border-t border-border/70 flex items-center justify-between text-[11px] text-text-secondary select-none font-mono">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border text-[9px]">↑</kbd>
                <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border text-[9px]">↓</kbd>
                <span className="text-[10px]">navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9px]">↵</kbd>
                <span className="text-[10px]">select</span>
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9px]">tab</kbd>
                <span className="text-[10px]">filter</span>
              </span>
            </div>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9px]">esc</kbd>
              <span className="text-[10px]">close</span>
            </span>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
