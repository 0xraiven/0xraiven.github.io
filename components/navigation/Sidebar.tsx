"use client";

import React, { useState, useEffect } from "react";
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
  items: NavItem[];
}

const MAIN_NAV_GROUPS: NavGroup[] = [
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
    items: [
      { label: "PhishGuard", href: "/projects/phishguard", icon: ShieldAlert },
      { label: "persistHunt", href: "/projects/persisthunt", icon: Terminal },
      { label: "View all projects", href: "/projects", icon: FolderGit2 },
    ],
  },
  {
    title: "WRITEUPS",
    collapsible: true,
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
    items: [
      { label: "Security Research", href: "/research", icon: FlaskConical },
      { label: "Lab Reports", href: "/research/lab-reports", icon: FlaskConical },
    ],
  },
];

const MISC_ITEMS: NavItem[] = [
  { label: "About", href: "/about", icon: User },
  { label: "Resume", href: "/resume", icon: FileDown },
];

function getActiveGroupForPath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/projects")) return "PROJECTS";
  if (path.startsWith("/writeups")) return "WRITEUPS";
  if (path.startsWith("/notes")) return "NOTES";
  if (path.startsWith("/research")) return "RESEARCH";
  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const { openCommandPalette } = useUI();

  // Only open the section containing the active page by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const active = getActiveGroupForPath(pathname);
    return {
      PROJECTS: active === "PROJECTS",
      WRITEUPS: active === "WRITEUPS",
      NOTES: active === "NOTES",
      RESEARCH: active === "RESEARCH",
    };
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // When route changes, sync open state so only current section is open
  useEffect(() => {
    const active = getActiveGroupForPath(pathname);
    setOpenGroups({
      PROJECTS: active === "PROJECTS",
      WRITEUPS: active === "WRITEUPS",
      NOTES: active === "NOTES",
      RESEARCH: active === "RESEARCH",
    });
  }, [pathname]);

  return (
    <aside
      aria-label="Sidebar navigation"
      className="w-64 shrink-0 bg-bg border-r border-border h-full flex flex-col justify-between text-xs select-none"
    >
      {/* Scrollable Documentation Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 terminal-scrollbar">
        {MAIN_NAV_GROUPS.map((group) => {
          const isOpen = group.collapsible ? Boolean(openGroups[group.title]) : true;
          return (
            <div key={group.title} className="space-y-1">
              {group.collapsible ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent group transition-colors"
                >
                  <span className="transition-colors group-hover:text-text-primary">{group.title}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ease-out ${
                      isOpen ? "rotate-0 text-text-primary" : "-rotate-90"
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href="/"
                  className="block px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  {group.title}
                </Link>
              )}

              <div
                className={
                  group.collapsible
                    ? isOpen
                      ? "accordion-content-expand"
                      : "accordion-content-collapse"
                    : "block"
                }
              >
                <div className={group.collapsible ? "accordion-inner" : ""}>
                  <ul className="space-y-0.5 pt-0.5">
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
                            className={`flex items-center gap-2 px-2 py-1.5 rounded font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                              isActive
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
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Pinned Bottom MISC Section - ALWAYS REACHABLE */}
      <div className="shrink-0 p-3 border-t border-border bg-surface/30 space-y-1">
        <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-text-secondary">
          MISC
        </div>
        <ul className="space-y-0.5">
          {MISC_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                    isActive
                      ? "bg-surface-2 text-text-primary font-medium text-accent border-l-2 border-accent pl-1.5"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
