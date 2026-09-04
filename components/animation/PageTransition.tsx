"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface PageTransitionProps {
  children: React.ReactNode;
}

const BRAILLE_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [frameIdx, setFrameIdx] = useState(0);
  const [routeChecksum, setRouteChecksum] = useState("0x4A1F");

  useEffect(() => {
    // Generate simulated dynamic checksum for this route
    const hash = Array.from(pathname || "root").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    setRouteChecksum("0x" + (hash * 31).toString(16).toUpperCase().slice(-4));

    setIsTransitioning(true);

    // Frame spinner interval during transition
    const frameInterval = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % BRAILLE_FRAMES.length);
    }, 45);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      clearInterval(frameInterval);
    }, 280);

    return () => {
      clearTimeout(timer);
      clearInterval(frameInterval);
    };
  }, [pathname]);

  const safePath = pathname || "/";
  const activeSector = safePath === "/" ? "README // ROOT" : safePath.replace("/", "").replace(/-/g, "_").toUpperCase();

  return (
    <div className="relative min-w-0 w-full overflow-hidden">
      {/* Cyber Route Telemetry Bar */}
      <div
        className={`transition-all duration-300 font-mono text-[10px] sm:text-[11px] select-none flex items-center justify-between px-3 py-1.5 mb-4 rounded border border-border bg-surface-2/80 text-text-secondary ${
          isTransitioning
            ? "opacity-100 translate-y-0 border-accent/40 shadow-sm"
            : "opacity-60 -translate-y-0.5 border-border"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-accent font-bold">
            {isTransitioning ? BRAILLE_FRAMES[frameIdx] : "✓"}
          </span>
          <span className="text-text-primary font-semibold truncate">
            NODE://{activeSector}
          </span>
          <span className="text-text-secondary hidden sm:inline">•</span>
          <span className="text-[10px] text-accent hidden sm:inline">
            GATEWAY_SYNC
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary font-mono">
            {routeChecksum}
          </span>
          <span className={`text-[9px] uppercase font-bold tracking-wider ${isTransitioning ? "text-accent animate-pulse" : "text-emerald-500"}`}>
            {isTransitioning ? "ROUTING..." : "LIVE"}
          </span>
        </div>
      </div>

      {/* Progressive Page Content Container */}
      <div
        key={pathname}
        className="animate-page-reveal w-full"
      >
        {children}
      </div>
    </div>
  );
}
