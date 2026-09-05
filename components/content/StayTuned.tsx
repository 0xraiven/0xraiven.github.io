import React from "react";
import Link from "next/link";
import { Terminal, Shield, ArrowRight, FolderGit2, BookOpen } from "lucide-react";

export interface StayTunedProps {
  sector?: string;
  title?: string;
  category?: string;
  description?: string;
  returnUrl?: string;
  returnLabel?: string;
  pipelineStages?: { label: string; status: "PASSED" | "IN_PROGRESS" | "PENDING" | "SCHEDULED" }[];
}

export function StayTuned({
  sector = "Tactical Knowledge Sector",
  title,
  category = "in-development",
  description,
  returnUrl = "/projects",
  returnLabel = "Explore Active Repositories",
  pipelineStages = [
    { label: "Laboratory Verification", status: "PASSED" },
    { label: "Redaction & Sanitization", status: "IN_PROGRESS" },
    { label: "Public Release", status: "PENDING" },
  ],
}: StayTunedProps) {
  const displayTitle = title || `${sector} // Content Pending Release`;
  const displayDescription =
    description ||
    `This sector (${sector}) has been registered in the knowledge base routing table. Operational notes, vulnerability findings, and code examples for this domain are actively being compiled, audited, and formatted for release.`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASSED":
        return "text-emerald-400";
      case "IN_PROGRESS":
        return "text-amber-400";
      case "SCHEDULED":
        return "text-blue-400";
      case "PENDING":
      default:
        return "text-accent";
    }
  };

  return (
    <div className="space-y-6 font-mono text-text-primary">
      {/* ASCII Banner & Status Box */}
      <div className="p-5 sm:p-6 rounded-lg border border-border bg-surface relative overflow-hidden space-y-5 shadow-sm">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Hardware Status Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-xs text-text-secondary tracking-widest">
              ( 00 )
            </span>
            <div className="h-3 w-px bg-border" />
            {/* 5-dot micro array */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 border border-border/80 shadow-inner">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < 3 ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
            <span className="font-pixel text-[11px] uppercase tracking-wider text-text-primary">
              RELEASE PIPELINE // MATRIX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] uppercase tracking-wider text-text-secondary">
              PENDING RELEASE
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-2 border-t border-border/70 pt-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-semibold text-[10px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>sector: {category}</span>
            </span>

            <span className="text-text-secondary text-[11px]">
              telemetry :: status [compiling_artifacts]
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
            {displayTitle}
          </h2>

          <p className="text-xs text-text-secondary font-sans leading-relaxed max-w-2xl">
            {displayDescription}
          </p>
        </div>

        {/* Diagnostic Pipeline Matrix */}
        <div className="p-3.5 rounded border border-border/80 bg-surface-2/60 text-xs space-y-2.5">
          <div className="flex items-center gap-2 text-text-secondary text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            <span>release_pipeline.matrix // {category}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            {pipelineStages.map((stage) => (
              <div
                key={stage.label}
                className="p-2 rounded bg-surface border border-border/60 flex items-center justify-between"
              >
                <span className="text-text-secondary truncate mr-1">{stage.label}</span>
                <span className={`font-semibold shrink-0 ${getStatusColor(stage.status)}`}>
                  {stage.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
          <Link
            href={returnUrl}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-accent text-bg text-xs font-semibold hover:bg-accent/90 transition-colors shadow-xs"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{returnLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <Link
            href="/writeups"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-surface-2 hover:bg-surface-2/80 text-text-primary hover:text-accent transition-colors text-xs"
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>View Published Writeups</span>
          </Link>

          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-surface-2 hover:bg-surface-2/80 text-text-secondary hover:text-text-primary transition-colors text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>All Notes</span>
          </Link>

          <a
            href="https://github.com/0xraiven"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-surface-2 hover:bg-surface-2/80 text-text-secondary hover:text-text-primary transition-colors text-xs"
          >
            <span>GitHub Profile</span>
            <ArrowRight className="w-3 h-3 text-text-secondary" />
          </a>
        </div>
      </div>
    </div>
  );
}
