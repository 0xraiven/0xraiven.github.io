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

    const discovered: TOCItem[] = headingElements
      .map((el, index) => {
        const rawText = (el.textContent || "").replace(/^#+\s*/, "").trim();
        let id = el.id;
        if (!id) {
          id =
            rawText
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${index}`;
          el.id = id;
        }
        return {
          id,
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -60% 0%",
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
    if (target) {
      const topOffset = 64; // Account for fixed TopBar
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="space-y-2 text-xs font-mono select-none">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
        <AlignLeft className="w-3.5 h-3.5" />
        <span>On this page</span>
      </div>

      <ul className="space-y-1 border-l border-border pl-2">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
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
