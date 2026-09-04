"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CommandPalette } from "@/components/overlay/CommandPalette";
import { MobileSidebar } from "@/components/navigation/MobileSidebar";

interface UIContextType {
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  mobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function useUI(): UIContextType {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a Providers tree");
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);
  const toggleCommandPalette = useCallback(
    () => setCommandPaletteOpen((prev) => !prev),
    []
  );

  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const toggleMobileSidebar = useCallback(
    () => setMobileSidebarOpen((prev) => !prev),
    []
  );

  // Global keyboard shortcuts (⌘K on macOS, Ctrl+K on Windows/Linux, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette on ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Close overlays on Escape if any are open
      if (e.key === "Escape") {
        if (commandPaletteOpen) {
          e.preventDefault();
          setCommandPaletteOpen(false);
        } else if (mobileSidebarOpen) {
          e.preventDefault();
          setMobileSidebarOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, mobileSidebarOpen]);

  const value: UIContextType = {
    commandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
    mobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={closeCommandPalette}
      />
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={closeMobileSidebar}
        onOpenSearch={openCommandPalette}
      />
    </UIContext.Provider>
  );
}
