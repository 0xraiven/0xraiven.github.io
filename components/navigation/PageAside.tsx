"use client";

import React, { useEffect, useState } from "react";
import { TableOfContents } from "./TableOfContents";
import { RelatedContent } from "./RelatedContent";
import { TOCItem, RelatedItem } from "@/types";

export interface PageAsideProps {
  headings?: TOCItem[];
  relatedItems?: RelatedItem[];
}

export function PageAside({ headings: initialHeadings, relatedItems }: PageAsideProps) {
  const [discoveredHeadings, setDiscoveredHeadings] = useState<TOCItem[]>([]);

  const headings = initialHeadings ?? discoveredHeadings;

  useEffect(() => {
    if (initialHeadings) return;

    const headingElements = document.querySelectorAll("main h2, main h3");
    if (headingElements.length < 2) {
      return;
    }

    const discovered: TOCItem[] = Array.from(headingElements).map((el, index) => {
      let id = el.id;
      if (!id) {
        id =
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `heading-${index}`;
        el.id = id;
      }
      return {
        id,
        text: el.textContent || "",
        level: el.tagName.toLowerCase() === "h2" ? (2 as const) : (3 as const),
      };
    });

    const raf = requestAnimationFrame(() => {
      setDiscoveredHeadings(discovered);
    });

    return () => cancelAnimationFrame(raf);
  }, [initialHeadings]);

  const hasHeadings = headings.length >= 2;
  const hasRelated = Boolean(relatedItems && relatedItems.length > 0);

  // Strict architectural condition: render null if fewer than 2 headings and no related content
  if (!hasHeadings && !hasRelated) {
    return null;
  }

  return (
    <aside
      aria-label="Table of contents and related documents"
      className="hidden xl:block w-60 shrink-0 border-l border-border bg-bg h-full overflow-y-auto px-4 py-6 space-y-6 select-none terminal-scrollbar"
    >
      <TableOfContents headings={headings} />
      <RelatedContent items={relatedItems} />
    </aside>
  );
}
