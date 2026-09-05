import React from "react";
import Link from "next/link";
import { RelatedItem } from "@/types";
import { Link2 } from "lucide-react";

export interface RelatedContentProps {
  items?: RelatedItem[];
}

export function RelatedContent({ items }: RelatedContentProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 text-xs font-mono select-none pt-4 border-t border-border">
      <div className="flex items-center gap-1.5 text-[11px] font-pixel uppercase tracking-wider text-text-secondary font-semibold">
        <Link2 className="w-3.5 h-3.5" />
        <span>Related</span>
      </div>

      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block p-2 rounded border border-border bg-surface hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <div className="text-text-primary group-hover:text-accent font-medium truncate transition-colors">
                {item.title}
              </div>
              {item.category && (
                <div className="text-[10px] text-text-secondary truncate mt-0.5">
                  {item.category}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
