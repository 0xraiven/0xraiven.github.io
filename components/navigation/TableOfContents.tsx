"use client";

import React, { useEffect, useState } from "react";
import { TOCItem } from "@/types";
import { AlignLeft } from "lucide-react";

export interface TableOfContentsProps {
  headings?: TOCItem[];
}

export function TableOfContents({ headings: initialHeadings }: TableOfContentsProps) {
  const [discoveredHeadings, setDiscoveredHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  const headings = initialHeadings ?? discoveredHeadings;

  // Discover headings from DOM if not passed statically
  useEffect(() => {
    if (initialHeadings) return;

    const headingElements = Array.from(
      document.querySelectorAll("main h2, main h3")
    );

    const idCounts = new Map<string, number>();

    const discovered: TOCItem[] = headingElements
      .map((el, index) => {
        const rawText = (el.textContent || "").replace(/^#+\s*/, "").trim();
        const baseSlug =
          rawText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `heading-${index}`;

        // Ensure unique ID for both DOM element and TOC link
        const count = idCounts.get(baseSlug) || 0;
        idCounts.set(baseSlug, count + 1);

        const uniqueId = count === 0 ? baseSlug : `${baseSlug}-${count}`;
        el.id = uniqueId;

        return {
          id: uniqueId,
          text: rawText,
          level: el.tagName.toLowerCase() === "h2" ? (2 as const) : (3 as const),
        };
      })
      .filter((h) => h.text.length > 0);

    const raf = requestAnimationFrame(() => {
      setDiscoveredHeadings(discovered);
    });

    return () => cancelAnimationFrame(raf);
  }, [initialHeadings]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const mainContainer = document.getElementById("main-content") || document.querySelector("main");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: mainContainer || null,
        rootMargin: "-20px 0% -60% 0%",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    const mainContainer = document.getElementById("main-content") || document.querySelector("main");
    if (target && mainContainer) {
      const targetRect = target.getBoundingClientRect();
      const mainRect = mainContainer.getBoundingClientRect();
      const offsetPosition = targetRect.top - mainRect.top + mainContainer.scrollTop - 24;

      mainContainer.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="space-y-2 text-xs font-mono select-none">
      <div className="flex items-center gap-1.5 text-[11px] font-pixel uppercase tracking-wider text-text-secondary">
        <AlignLeft className="w-3.5 h-3.5" />
        <span>On this page</span>
      </div>

      <ul className="space-y-1 border-l border-border pl-2">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={`${heading.id}-${index}`}
              className={`${heading.level === 3 ? "pl-3 text-[11px]" : ""}`}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block truncate transition-colors py-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  isActive
                    ? "text-accent font-medium border-l-2 -ml-[9px] pl-[7px] border-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
