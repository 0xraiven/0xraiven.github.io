"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlassSurface } from "@/components/chrome/GlassSurface";
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
  X,
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
    defaultOpen: false,
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

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileSidebar({ isOpen, onClose, onOpenSearch }: MobileSidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    NAV_GROUPS.forEach((group) => {
      state[group.title] = group.defaultOpen ?? true;
    });
    return state;
  });

  // Automatically close on navigation
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation drawer"
      className="fixed inset-0 z-50 md:hidden overflow-hidden"
    >
      {/* Dimmed backdrop - flat, unblurred per architecture §4.4 */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer with GlassSurface */}
      <aside
        className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] h-full z-10 transition-transform duration-200 ease-out transform translate-x-0 motion-reduce:transition-none"
      >
        <GlassSurface className="h-full w-full rounded-none border-r border-y-0 border-l-0 shadow-2xl flex flex-col p-0">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 h-12 border-b border-border/70 shrink-0">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2 font-mono text-sm tracking-tight"
            >
              <span className="font-bold text-text-primary">r41n</span>
              <span className="text-text-secondary text-xs">•</span>
              <span className="text-xs text-text-secondary">Knowledge Base</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Navigation List */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs font-mono select-none">
            {NAV_GROUPS.map((group) => {
              const isOpen = openGroups[group.title] ?? true;
              return (
                <div key={group.title} className="space-y-1">
                  {group.collapsible ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] uppercase tracking-wider text-text-secondary hover:text-text-primary rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <span>{group.title}</span>
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
                      )}
                    </button>
                  ) : (
                    <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-text-secondary">
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
                                onClick={() => {
                                  onClose();
                                  onOpenSearch();
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors text-left"
                              >
                                {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-accent" />}
                                <span className="truncate">{item.label}</span>
                              </button>
                            </li>
                          );
                        }

                        return (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
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
                  )}
                </div>
              );
            })}
          </nav>
        </GlassSurface>
      </aside>
    </div>
  );
}
