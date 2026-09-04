import React from "react";
import Link from "next/link";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { TerminalBlock } from "@/components/content/TerminalBlock";
import { FileText, ArrowUpRight, FolderGit2, Shield, Terminal, Layers } from "lucide-react";
import { RelatedItem } from "@/types";

const PINNED_RELATED: RelatedItem[] = [
  {
    title: "Aegis · Persistence Hunter",
    href: "/projects/aegis",
    category: "red-team-tooling",
  },
  {
    title: "PhishGuard Specification",
    href: "/projects/phishguard",
    category: "browser-security",
  },
  {
    title: "Linux Observe",
    href: "/projects/linux-observe",
    category: "detection-engineering",
  },
  {
    title: "Active Directory Lab",
    href: "/projects/ad-lab",
    category: "lab-environment",
  },
];

export default function Home() {
  return (
    <KnowledgeBaseLayout relatedItems={PINNED_RELATED}>
      <article className="space-y-10 text-text-primary">
        {/* Document Header (README file header) */}
        <header className="border-b border-border pb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>~/0xraiven/README.md</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight font-mono text-text-primary">
              README.md
            </h1>
            <p className="text-base text-text-secondary font-mono">
              r41n <span className="text-border">::</span> Offensive Security • Red Team • Cloud Security
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
            <a
              href="https://github.com/0xraiven"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span>github.com/0xraiven</span>
              <ArrowUpRight className="w-3 h-3 text-text-secondary" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span>linkedin.com/in</span>
              <ArrowUpRight className="w-3 h-3 text-text-secondary" />
            </a>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>telemetry :: active</span>
            </span>
          </div>
        </header>

        {/* Section 1: Technical Profile Configuration */}
        <section id="technical-configuration" className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2 border-b border-border pb-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span>Technical Configuration</span>
          </h2>

          <p className="text-xs text-text-secondary font-mono">
            Host configuration and active research domains:
          </p>

          <TerminalBlock
            title="r41n.conf — /etc/profile"
            commands={[
              {
                cmd: "cat /etc/profile/r41n.conf",
                output: `handle      :: r41n
focus       :: Offensive Security
               Red Team Tooling
               Cloud Security
               Detection Engineering

environment :: Linux (Arch / Debian)
               Windows Active Directory
               AWS Cloud Architecture
               Docker / Podman Containers
               KVM / Proxmox Virtualization

status      :: building
               breaking
               documenting`,
              },
            ]}
          />
        </section>

        {/* Section 2: Repository Index */}
        <section id="repository-index" className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2 border-b border-border pb-2">
            <FolderGit2 className="w-4 h-4 text-accent" />
            <span>Repository Index</span>
          </h2>

          <p className="text-xs text-text-secondary font-mono">
            Navigation taxonomy for technical writeups, source repositories, and research notes:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-border rounded">
              <thead>
                <tr className="bg-surface-2 border-b border-border text-text-secondary text-left">
                  <th className="py-2 px-3 font-semibold">Directory</th>
                  <th className="py-2 px-3 font-semibold">Classification</th>
                  <th className="py-2 px-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/projects" className="text-accent hover:underline">
                      /projects
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Engineering</td>
                  <td className="py-2 px-3 text-text-primary">
                    Security tools, defensive telemetry sensors, and lab architectures
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/writeups" className="text-accent hover:underline">
                      /writeups
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Walkthroughs</td>
                  <td className="py-2 px-3 text-text-primary">
                    In-depth attack path walkthroughs, lab investigations, and CTF analyses
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/notes" className="text-accent hover:underline">
                      /notes
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Reference</td>
                  <td className="py-2 px-3 text-text-primary">
                    Concise command cheatsheets, syntax references, and incident runbooks
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/research" className="text-accent hover:underline">
                      /research
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Laboratory</td>
                  <td className="py-2 px-3 text-text-primary">
                    Security vulnerability research, threat modeling, and lab reports
                  </td>
                </tr>
                <tr className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-2 px-3">
                    <Link href="/about" className="text-accent hover:underline">
                      /about
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">Profile</td>
                  <td className="py-2 px-3 text-text-primary">
                    Operator scope, background overview, and system hardware specifications
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Pinned Proof-of-Work */}
        <section id="pinned-proof-of-work" className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2 border-b border-border pb-2">
            <Layers className="w-4 h-4 text-accent" />
            <span>Pinned Proof-of-Work</span>
          </h2>

          <p className="text-xs text-text-secondary font-mono">
            Sample research projects and engineering artifacts (specifications and prototypes):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-2 border border-border">
                  red-team-tooling
                </span>
                <span className="text-[11px] text-text-secondary">planned</span>
              </div>
              <h3 className="font-semibold text-text-primary text-sm">
                Aegis · Persistence Hunter
              </h3>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                Triage and enumeration utility scanning Linux persistence mechanisms (systemd units, cron, udev rules, shell rc files).
              </p>
            </div>

            <div className="p-3.5 rounded border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-2 border border-border">
                  browser-security
                </span>
                <span className="text-[11px] text-emerald-400">spec ready</span>
              </div>
              <h3 className="font-semibold text-text-primary text-sm">
                PhishGuard
              </h3>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                Client-side browser extension utilizing DOM entropy heuristics and visual similarity checks to detect credential-harvesting pages.
              </p>
            </div>

            <div className="p-3.5 rounded border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-2 border border-border">
                  detection-engineering
                </span>
                <span className="text-[11px] text-text-secondary">prototype</span>
              </div>
              <h3 className="font-semibold text-text-primary text-sm">
                Linux Observe
              </h3>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                Auditd and eBPF event stream collector forwarding structured JSON telemetry into detection analysis pipelines.
              </p>
            </div>

            <div className="p-3.5 rounded border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-2 border border-border">
                  lab-environment
                </span>
                <span className="text-[11px] text-text-secondary">active</span>
              </div>
              <h3 className="font-semibold text-text-primary text-sm">
                Active Directory Attack Lab
              </h3>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                Dual-forest Windows Server environment configured with intentional misconfigurations for Kerberos delegation research.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Operational Philosophy */}
        <section id="operational-philosophy" className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2 border-b border-border pb-2">
            <Shield className="w-4 h-4 text-accent" />
            <span>Operational Philosophy</span>
          </h2>

          <div className="space-y-2 text-xs font-mono text-text-secondary leading-relaxed">
            <div className="p-3 rounded border border-border bg-surface space-y-1">
              <div className="text-text-primary font-semibold">1. Proof of Work Over Claims</div>
              <p>
                Capabilities are proven through reproducible lab walk-throughs, custom scripts, and architectural teardowns rather than lists of buzzwords or credentials.
              </p>
            </div>

            <div className="p-3 rounded border border-border bg-surface space-y-1">
              <div className="text-text-primary font-semibold">2. Documentation-First Unix Architecture</div>
              <p>
                Designed as a high-density, fast-loading personal wiki and notebook. Clean typography, dark mode by default, keyboard-friendly navigation, and zero marketing clutter.
              </p>
            </div>

            <div className="p-3 rounded border border-border bg-surface space-y-1">
              <div className="text-text-primary font-semibold">3. Code-Free Publishing</div>
              <p>
                Content remains separate from presentation. All knowledge base entries are file-backed Markdown/MDX documents rendered statically without runtime overhead.
              </p>
            </div>
          </div>
        </section>
      </article>
    </KnowledgeBaseLayout>
  );
}
