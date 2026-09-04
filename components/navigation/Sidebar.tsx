"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/providers";
import {
  BookOpen,
  Search,
  FolderGit2,
  FileCode2,
  FileText,
  FlaskConical,
  User,
  FileDown,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Terminal,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  isSearch?: boolean;
}

interface NavGroup {
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "START HERE",
    items: [
      { label: "README", href: "/", icon: BookOpen },
      { label: "Search (⌘K)", href: "#search", icon: Search, isSearch: true },
    ],
  },
  {
    title: "PROJECTS",
    collapsible: true,
    defaultOpen: true,
    items: [
      { label: "PhishGuard", href: "/projects/phishguard", icon: ShieldAlert },
      { label: "persistHunt", href: "/projects/persisthunt", icon: Terminal },
      { label: "View all projects", href: "/projects", icon: FolderGit2 },
    ],
  },
  {
    title: "WRITEUPS",
    collapsible: true,
    defaultOpen: true,
    items: [
      { label: "Web Security", href: "/writeups/web-security", icon: FileCode2 },
      { label: "Linux", href: "/writeups/linux", icon: FileCode2 },
      { label: "Active Directory", href: "/writeups/active-directory", icon: FileCode2 },
      { label: "Cloud Security", href: "/writeups/cloud-security", icon: FileCode2 },
      { label: "Detection Engineering", href: "/writeups/detection-engineering", icon: FileCode2 },
      { label: "Red Team", href: "/writeups/red-team", icon: FileCode2 },
      { label: "CTF", href: "/writeups/ctf", icon: FileCode2 },
    ],
  },
  {
    title: "NOTES",
    collapsible: true,
    defaultOpen: true,
    items: [
      { label: "Web Security", href: "/notes/web-security", icon: FileText },
      { label: "Linux", href: "/notes/linux", icon: FileText },
      { label: "Active Directory", href: "/notes/active-directory", icon: FileText },
      { label: "Cloud Security", href: "/notes/cloud-security", icon: FileText },
      { label: "Detection Engineering", href: "/notes/detection-engineering", icon: FileText },
      { label: "Red Team", href: "/notes/red-team", icon: FileText },
      { label: "CTF", href: "/notes/ctf", icon: FileText },
    ],
  },
  {
    title: "RESEARCH",
    collapsible: true,
    defaultOpen: true,
    items: [
      { label: "Security Research", href: "/research", icon: FlaskConical },
      { label: "Lab Reports", href: "/research/lab-reports", icon: FlaskConical },
    ],
  },
  {
    title: "MISC",
    items: [
      { label: "About", href: "/about", icon: User },
      { label: "Resume", href: "/resume", icon: FileDown },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { openCommandPalette } = useUI();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    NAV_GROUPS.forEach((group) => {
      state[group.title] = group.defaultOpen ?? true;
    });
    return state;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className="w-64 shrink-0 bg-bg border-r border-border h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto px-3 py-4 text-xs select-none"
    >
      <nav className="space-y-6">
        {NAV_GROUPS.map((group) => {
          const isOpen = openGroups[group.title] ?? true;
          return (
            <div key={group.title} className="space-y-1">
              {group.collapsible ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span>{group.title}</span>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
                  )}
                </button>
              ) : (
                <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                  {group.title}
                </div>
              )}

              {isOpen && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isSearch) {
                      return (
                        <li key={item.label}>
                          <button
                            type="button"
                            onClick={openCommandPalette}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded font-mono transition-colors text-text-secondary hover:text-text-primary hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent text-left"
                          >
                            {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-accent" />}
                            <span className="truncate">{item.label}</span>
                            <kbd className="ml-auto text-[10px] px-1 rounded bg-surface border border-border text-text-secondary">
                              ⌘K / ctrl+K
                            </kbd>
                          </button>
                        </li>
                      );
                    }

                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${isActive
                              ? "bg-surface-2 text-text-primary font-medium text-accent border-l-2 border-accent pl-1.5"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                            }`}
                        >
                          {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[10px] px-1 rounded bg-surface border border-border text-text-secondary">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
