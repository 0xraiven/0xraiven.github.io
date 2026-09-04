"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Terminal, Shield, Cpu } from "lucide-react";

export interface GlyphMatrixSpinnerProps {
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
  className?: string;
}

const BRAILLE_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const BRACKET_FRAMES = [
  "[=       ]",
  "[==      ]",
  "[===     ]",
  "[ ===    ]",
  "[  ===   ]",
  "[   ===  ]",
  "[    === ]",
  "[     ===]",
  "[      ==]",
  "[       =]",
];

const GLYPH_CHARS = "01010101ΔΩΨΣΞπλθδ0x8F0x2A0xC40x9B0x1E░▒▓█";

function generateMatrixLine(cols: number = 8): string[] {
  const line: string[] = [];
  for (let i = 0; i < cols; i++) {
    const r = Math.random();
    if (r < 0.2) {
      line.push("0x" + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, "0"));
    } else if (r < 0.4) {
      const idx = Math.floor(Math.random() * GLYPH_CHARS.length);
      line.push(GLYPH_CHARS[idx]);
    } else if (r < 0.6) {
      line.push(Math.random() > 0.5 ? "1" : "0");
    } else if (r < 0.8) {
      const symbols = ["▓▒░", "░▒▓", "█▒█", "⠋⠙", "⠸⠴", "[OK]"];
      line.push(symbols[Math.floor(Math.random() * symbols.length)]);
    } else {
      line.push("░░░");
    }
  }
  return line;
}

export function GlyphMatrixSpinner({
  title = "r41n // SYSTEM_KERNEL",
  subtitle = "DECRYPTING MATRIX STREAM",
  size = "md",
  className = "",
}: GlyphMatrixSpinnerProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [matrixGrid, setMatrixGrid] = useState<string[][]>(() =>
    Array.from({ length: 4 }, () => generateMatrixLine(6))
  );
  const [memoryOffset, setMemoryOffset] = useState("0x7FFF" + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase());
  const [entropy, setEntropy] = useState(99.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % BRAILLE_FRAMES.length);

      // Randomly update matrix lines
      setMatrixGrid((prev) => {
        const next = [...prev];
        const replaceIdx = Math.floor(Math.random() * next.length);
        next[replaceIdx] = generateMatrixLine(6);
        return next;
      });

      // Fluctuate simulated memory address
      if (Math.random() > 0.6) {
        setMemoryOffset("0x7FFF" + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase());
        setEntropy(Number((98.5 + Math.random() * 1.4).toFixed(1)));
      }
    }, 90);

    return () => clearInterval(interval);
  }, []);

  const spinnerGlyph = BRAILLE_FRAMES[frameIdx];
  const bracketGlyph = BRACKET_FRAMES[frameIdx % BRACKET_FRAMES.length];

  if (size === "sm") {
    return (
      <div className={`inline-flex items-center gap-2 font-mono text-xs text-accent ${className}`}>
        <span className="font-bold text-accent animate-pulse">{spinnerGlyph}</span>
        <span className="text-text-secondary">{bracketGlyph}</span>
        <span className="text-[11px] text-text-primary tracking-tight">{title}</span>
      </div>
    );
  }

  const containerClasses =
    size === "fullscreen"
      ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/90 backdrop-blur-md"
      : `my-6 p-4 rounded border border-border bg-surface shadow-xl relative overflow-hidden ${className}`;

  return (
    <div className={containerClasses}>
      <div className="relative font-mono text-xs space-y-3 w-full max-w-lg mx-auto select-none">
        {/* Top telemetry bar */}
        <div className="flex items-center justify-between border-b border-border/80 pb-2 text-[11px] text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold animate-pulse">{spinnerGlyph}</span>
            <span className="text-text-primary font-semibold tracking-wider">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-2 border border-border text-accent font-mono">
              {memoryOffset}
            </span>
            <span className="text-emerald-500 font-bold hidden xs:inline">[SYNC {entropy}%]</span>
          </div>
        </div>

        {/* ASCII Matrix Grid Stream */}
        <div className="p-3 rounded bg-surface-2/70 border border-border/70 space-y-1 overflow-hidden relative">
          <div className="text-[10px] text-accent/80 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-border/50">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-accent" />
              <span>CIPHER_MATRIX_BUFFER</span>
            </span>
            <span className="text-text-secondary">{bracketGlyph}</span>
          </div>

          <div className="space-y-0.5 pt-1 font-mono text-[11px]">
            {matrixGrid.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center justify-between font-mono tracking-wider">
                <span className="text-accent/60 w-8 select-none text-[10px]">
                  0{rIdx}F:
                </span>
                <div className="flex-1 flex items-center justify-between text-text-secondary">
                  {row.map((cell, cIdx) => {
                    const isHighlight = (rIdx + cIdx + frameIdx) % 5 === 0;
                    return (
                      <span
                        key={cIdx}
                        className={`transition-colors duration-150 ${
                          isHighlight
                            ? "text-accent font-bold"
                            : "text-text-secondary/80"
                        }`}
                      >
                        {cell}
                      </span>
                    );
                  })}
                </div>
                <span className="text-[10px] text-text-secondary w-10 text-right select-none">
                  {rIdx === 0 ? "[OK]" : "···"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtitle & Frame Progress */}
        <div className="flex items-center justify-between text-[11px] text-text-secondary pt-0.5">
          <span className="flex items-center gap-1.5 text-text-primary">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping inline-block" />
            <span>{subtitle}</span>
          </span>
          <span className="font-mono text-accent">{bracketGlyph}</span>
        </div>
      </div>
    </div>
  );
}
