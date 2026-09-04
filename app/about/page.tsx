import React from "react";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { reader } from "@/lib/keystatic-reader";
import { User, Shield, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "About // r41n",
  description: "Operator overview, technical background, research scope, and security philosophy.",
};

export default async function AboutPage() {
  const about = await reader.singletons.about.read();
  const body = about ? await about.body() : null;

  return (
    <KnowledgeBaseLayout>
      <article className="space-y-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border pb-3 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary">operator</span>
            <span>/</span>
            <span className="text-text-primary">about</span>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-accent font-semibold">
            profile
          </span>
        </div>

        {/* Dossier Header */}
        <header className="p-4 rounded border border-border bg-surface space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-bold tracking-tight text-text-primary font-mono">
                Operator Profile // r41n
              </h1>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono">
              active
            </span>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed font-sans">
            Offensive security practitioner, telemetry instrumentor, and cloud security architect.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span>Specialization: Red Team &amp; Detection Engineering</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-text-secondary" />
              <span>Host: Linux / x86_64</span>
            </div>
          </div>
        </header>

        {/* Main Document Body */}
        <div className="pt-2">
          {body ? (
            <DocumentContent document={body as unknown as Parameters<typeof DocumentContent>[0]["document"]} />
          ) : (
            <p className="text-sm text-text-secondary italic">
              Profile documentation currently being synchronized.
            </p>
          )}
        </div>
      </article>
    </KnowledgeBaseLayout>
  );
}
