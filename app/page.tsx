import React from "react";
import Link from "next/link";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { TerminalBlock } from "@/components/content/TerminalBlock";
import { FileText, ArrowUpRight, FolderGit2, Shield, Terminal, Layers, ArrowRight } from "lucide-react";
import { RelatedItem } from "@/types";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjects();
  const pinnedRelated: RelatedItem[] = projects.slice(0, 4).map((p) => ({
    title: p.title,
    href: `/projects/${p.slug}`,
    category: p.category,
  }));

  return (
    <KnowledgeBaseLayout relatedItems={pinnedRelated}>
      <article className="space-y-10 text-text-primary">
        {/* Document Header (Technical README dossier) */}
        <header className="border-b border-border pb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>~/0xraiven/README.md</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            {/* GitHub Profile Picture */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-border/90 bg-surface-2 shrink-0 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github.com/0xraiven.png"
                alt="0xraiven profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
              <span
                className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface"
                title="Status: Active"
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-text-primary">
                r41n
              </h1>

              {/* Highlighted GitHub Username */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://github.com/0xraiven"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 border border-accent/35 text-accent hover:bg-accent/25 transition-colors font-mono text-xs font-semibold shadow-xs"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <span>@0xraiven</span>
                </a>

                <span className="text-xs text-text-secondary font-mono">
                  Offensive Security • Red Team • Cloud Security
                </span>
              </div>
            </div>
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
              href="https://x.com/0xraiven"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span>x.com/0xraiven</span>
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
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-base font-semibold tracking-tight font-mono text-text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span>Pinned Proof-of-Work</span>
            </h2>
            <Link
              href="/projects"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>View all ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-text-secondary font-mono">
            Security engineering repositories, machine learning models, and telemetry artifacts:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {projects.slice(0, 4).map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="p-3.5 rounded border border-border bg-surface space-y-2 hover:border-accent/40 transition-colors block group"
              >
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-2 border border-border font-semibold">
                    {project.category}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      project.status === "active"
                        ? "text-emerald-400"
                        : project.status === "building"
                        ? "text-amber-400"
                        : "text-text-secondary"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <h3 className="font-semibold text-text-primary text-sm group-hover:text-accent transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-1 py-0.5 rounded bg-surface-2 text-text-secondary border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
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
