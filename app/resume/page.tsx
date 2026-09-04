import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { reader } from "@/lib/keystatic-reader";
import {
  FileDown,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  Cpu,
  Server,
  GraduationCap,
  Briefcase,
  GitBranch,
  ExternalLink,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { ScrambleText } from "@/components/animation/ScrambleText";

export const metadata: Metadata = {
  title: "Resume // r41n",
  description: "Curriculum vitae, technical competencies, practical security work, and engineering projects.",
};

export default async function ResumePage() {
  const resumeData = await reader.singletons.resume.read();
  const summary = resumeData ? await resumeData.summary() : null;

  const competencies = [
    {
      category: "Offensive Security & Web Security",
      icon: Terminal,
      skills: [
        "Manual Web Exploitation (Burp Suite, Firefox, Chromium)",
        "OWASP Top 10 Manual Reproduction (SQLi, XSS, CSRF, SSRF)",
        "Linux Privilege Escalation & Primitives",
        "Controlled Exploitation & Payload Construction",
        "Kali Linux & Metasploitable Lab Environments",
      ],
    },
    {
      category: "Detection Engineering & Telemetry",
      icon: ShieldCheck,
      skills: [
        "Wazuh Deployment (Manager, Indexer, Dashboard, Agent)",
        "Auditd Kernel & Syscall Auditing",
        "File Integrity Monitoring (Syscheck / FIM)",
        "Security Configuration Assessment (SCA / CIS Baselines)",
        "Process, Network & Authentication Telemetry Analysis",
      ],
    },
    {
      category: "Systems & Infrastructure",
      icon: Layers,
      skills: [
        "Arch Linux (Primary OS & System Administration)",
        "KVM / libvirt Virtualization Hypervisors",
        "Docker & Portainer Container Management",
        "Tailscale Encrypted Mesh Networking",
        "Nginx Proxy Manager & Netdata Monitoring",
      ],
    },
    {
      category: "Software & Security Tooling",
      icon: Cpu,
      skills: [
        "Python, TypeScript, JavaScript, Bash",
        "Flask, Next.js, React, React Native",
        "Supabase, PostgreSQL, REST APIs",
        "Chrome Extension APIs (MV3)",
        "Git & GitHub Version Control Workflows",
      ],
    },
  ];

  const practicalTraining = [
    {
      title: "OverTheWire — Bandit",
      badge: "Levels 0 → 33 Completed",
      status: "Completed",
      description:
        "Practical foundational training covering Linux CLI navigation, multi-tier filesystem permissions, SSH configurations, shell pipes and redirection, process inspection, text processing, and command-line security problem solving.",
    },
    {
      title: "PortSwigger Web Security Academy",
      badge: "Hands-on Labs Completed",
      status: "Active Practice",
      description:
        "Practiced manual vulnerability exploitation including Path Traversal, Unprotected Admin Functionality, Cookie Tampering, Horizontal and Vertical Privilege Escalation, Authentication Vulnerabilities, and Server-Side Request Forgery (SSRF against local loopback services).",
    },
    {
      title: "DVWA (Damn Vulnerable Web Application)",
      badge: "Manual OWASP Top 10 Exploitation",
      status: "Completed Labs",
      description:
        "Executed controlled manual exploitation against intentionally vulnerable web application behaviors: SQL Injection, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), Command Injection, File Inclusion, File Upload, and Broken Authentication.",
    },
  ];

  const projects = [
    {
      name: "Persistence Hunter",
      type: "Endpoint Security Tooling",
      status: "In Progress",
      desc: "Security tool development project focused on identifying and auditing endpoint persistence mechanisms across operating systems.",
      tech: ["Python", "Endpoint Telemetry", "Persistence Analysis"],
      githubUrl: "https://github.com/0xraiven/persistHunt",
    },
    {
      name: "PhishGuard",
      type: "Open Source // Browser Security",
      status: "In Progress",
      desc: "Privacy-first machine-learning phishing detection platform and browser extension (Chrome MV3, Edge) with a decoupled Flask backend evaluating Random Forest and CNN models with explainability. Licensed under Apache 2.0.",
      tech: ["Python", "Flask", "Chrome MV3", "Machine Learning", "Render"],
      githubUrl: "https://github.com/0xraiven/phishGuard",
    },
    {
      name: "OWT Bandit",
      type: "Linux Security Fundamentals",
      status: "Active",
      desc: "Hands-on Linux command-line security exercises, shell scripting, permission escalation analysis, and terminal problem solving.",
      tech: ["Linux", "Bash", "SSH", "Security Primitives"],
      githubUrl: "https://github.com/0xraiven/OWT-bandit",
    },
  ];

  return (
    <KnowledgeBaseLayout>
      <article className="space-y-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border pb-3 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary">operator</span>
            <span>/</span>
            <span className="text-text-primary">resume</span>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-accent font-mono font-semibold">
            curriculum vitae
          </span>
        </div>

        {/* Resume Header */}
        <header className="p-5 rounded border border-border bg-surface space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* GitHub Profile Picture - Circular Cyber Badge */}
              <div className="relative group shrink-0 p-1">
                <div className="relative p-1 rounded-full border border-border/80 bg-surface-2 transition-all duration-300 group-hover:border-accent/60 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 bg-surface transition-all duration-300 group-hover:border-accent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://github.com/0xraiven.png"
                      alt="0xraiven profile"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                <span
                  className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg shadow-sm z-10"
                  title="Status: Active"
                >
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <ScrambleText
                    text="r41n"
                    as="h1"
                    className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-mono"
                  />
                  <span className="text-text-secondary text-xs">•</span>
                  <span className="text-xs text-text-secondary font-mono">Curriculum Vitae</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono ml-1">
                    active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <a
                    href="https://github.com/0xraiven"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/15 border border-accent/35 text-accent hover:bg-accent/25 transition-colors font-mono text-xs font-semibold"
                  >
                    <span>@0xraiven</span>
                  </a>
                  <span className="text-xs text-text-secondary font-mono">
                    Computer Science Engineering Student
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              <a
                href="https://x.com/0xraiven"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-surface-2 hover:bg-surface text-text-primary text-xs font-mono transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
                <span>X (@0xraiven)</span>
              </a>
              {resumeData?.pdfFile ? (
                <a
                  href={resumeData.pdfFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-bg text-xs font-mono font-semibold hover:bg-accent/90 transition-colors shadow-sm"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              ) : (
                <a
                  href="https://github.com/0xraiven"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-surface-2 hover:bg-surface text-text-primary text-xs font-mono transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-accent" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Coordinate Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-[11px] font-mono text-text-secondary">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Focus</span>
              <span className="text-text-primary">Offensive &amp; Detection</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Primary OS</span>
              <span className="text-text-primary">Arch Linux</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Homelab</span>
              <span className="text-text-primary">KVM · Docker · Wazuh</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">Workflow</span>
              <span className="text-text-primary">Build · Break · Detect</span>
            </div>
          </div>

          {/* Render Summary Document from CMS if present */}
          {summary && (
            <div className="pt-3 border-t border-border/60 text-xs text-text-secondary leading-relaxed font-mono">
              <DocumentContent document={summary as unknown as Parameters<typeof DocumentContent>[0]["document"]} />
            </div>
          )}
        </header>

        {/* Education & Academic Discipline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Education" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Academic Foundation</span>
          </div>

          <div className="p-4 rounded border border-border bg-surface space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/40 pb-2">
              <div>
                <h3 className="text-xs font-bold text-text-primary font-mono">
                  Computer Science Engineering
                </h3>
                <span className="text-[11px] font-mono text-text-secondary">
                  Undergraduate Engineering Student
                </span>
              </div>
              <span className="text-[10px] font-mono text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20 self-start sm:self-auto">
                In Progress
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-text-secondary pt-1">
              <div className="flex items-center gap-2">
                <span className="text-accent">›</span>
                <span>Operating Systems &amp; Linux Internals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">›</span>
                <span>Computer Network Protocols &amp; Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">›</span>
                <span>Applied Cryptography &amp; Information Security</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">›</span>
                <span>Web Technologies &amp; Distributed Systems</span>
              </div>
            </div>
          </div>
        </section>

        {/* Practical Security Training & Proof of Work */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Practical Security Work & Labs" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Hands-On Practice</span>
          </div>

          <div className="space-y-3">
            {practicalTraining.map((train) => (
              <div
                key={train.title}
                className="p-4 rounded border border-border bg-surface space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-text-primary font-mono">
                      {train.title}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-border/60 text-accent font-semibold">
                      {train.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 self-start sm:self-auto">
                    {train.status}
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-mono leading-relaxed">
                  {train.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Competencies Matrix */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Technical Competencies Matrix" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">4 core areas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {competencies.map((comp) => {
              const Icon = comp.icon;
              return (
                <div
                  key={comp.category}
                  className="p-4 rounded border border-border bg-surface space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-accent" />
                    <h3 className="text-xs font-semibold text-text-primary font-mono">
                      {comp.category}
                    </h3>
                  </div>

                  <ul className="space-y-1.5 text-xs text-text-secondary font-mono">
                    {comp.skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2">
                        <span className="text-accent/70 select-none mt-0.5">›</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Projects */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Selected Projects" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Open Source Repositories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projects.map((proj) => (
              <div
                key={proj.name}
                className="p-4 rounded border border-border bg-surface space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-text-primary font-mono">
                      {proj.name}
                    </h3>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${proj.status === "Active"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-accent block">
                    {proj.type}
                  </span>
                  <p className="text-xs text-text-secondary font-mono leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex flex-wrap gap-1">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 border border-border/60 text-text-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-accent hover:underline pt-1"
                  >
                    <span>Inspect Repository</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dedicated Homelab & Cyber Range Infrastructure */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold tracking-wider text-text-primary font-mono uppercase">
                <ScrambleText text="Homelab & Cyber Range Infrastructure" as="span" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-secondary">Self-Hosted</span>
          </div>

          <div className="p-4 rounded border border-border bg-surface space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/40 pb-2">
              <span className="font-bold text-text-primary">Arch Linux Host · KVM / libvirt Hypervisor</span>
              <span className="text-text-secondary text-[11px]">Controlled Testing &amp; Monitoring</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Virtualization</span>
                <p className="text-[11px] text-text-secondary">
                  KVM / libvirt hosting Kali Linux (attack) &amp; Metasploitable (target) VMs.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Detection Stack</span>
                <p className="text-[11px] text-text-secondary">
                  Dockerized Wazuh (Manager, Indexer, Dashboard, Agent) + auditd telemetry.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Networking</span>
                <p className="text-[11px] text-text-secondary">
                  Tailscale encrypted mesh overlay &amp; Nginx Proxy Manager service routing.
                </p>
              </div>

              <div className="p-2.5 rounded bg-surface-2/60 border border-border/60 space-y-1">
                <span className="text-accent font-semibold text-[11px] block">Management</span>
                <p className="text-[11px] text-text-secondary">
                  Portainer for container orchestration &amp; Netdata for system performance monitoring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Proof of Work Cross-Links */}
        <section className="p-4 rounded border border-border bg-surface-2/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <p className="font-semibold text-text-primary">Explore Proof-of-Work &amp; Technical Notes</p>
            <p className="text-text-secondary text-[11px] mt-0.5">
              Inspect open-source tools, lab reports, vulnerability writeups, and technical notes.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary flex items-center gap-1 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-accent" />
              <span>Projects</span>
              <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />
            </Link>
            <Link
              href="/writeups"
              className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary flex items-center gap-1 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>Writeups</span>
              <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />
            </Link>
          </div>
        </section>
      </article>
    </KnowledgeBaseLayout>
  );
}
