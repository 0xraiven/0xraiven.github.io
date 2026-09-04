"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export interface TerminalCommand {
  cmd: string;
  output?: string;
}

export interface TerminalBlockProps {
  title?: string;
  commands: TerminalCommand[];
  className?: string;
}

export function TerminalBlock({
  title = "bash",
  commands,
  className = "",
}: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const fullCommandString = commands.map((c) => c.cmd).join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullCommandString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
    }
  };

  return (
    <div
      className={`rounded border border-border bg-surface overflow-hidden text-xs font-mono select-text my-4 ${className}`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-2 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary ml-2">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            <span className="truncate">{title}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy commands"
          className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary px-1.5 py-0.5 rounded hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Content: Visual Presentation Only */}
      <div className="p-4 space-y-3 overflow-x-auto">
        {commands.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-start gap-2 text-text-primary">
              <span className="text-accent select-none shrink-0">$</span>
              <span className="font-medium whitespace-pre">{item.cmd}</span>
            </div>
            {item.output && (
              <pre className="text-text-secondary whitespace-pre-wrap pl-4 leading-relaxed border-l border-border/50">
                {item.output}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
