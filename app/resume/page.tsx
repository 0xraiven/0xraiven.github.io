import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { reader } from "@/lib/keystatic-reader";
import { FileDown, ArrowRight, ShieldCheck, Terminal, Layers, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume // r41n",
  description: "Curriculum vitae, technical competencies, security credentials, and engineering experience.",
};

export default async function ResumePage() {
  const resumeData = await reader.singletons.resume.read();
  const summary = resumeData ? await resumeData.summary() : null;

  const competencies = [
    {
      category: "Offensive Security & Red Teaming",
      icon: Terminal,
      skills: ["Linux Host Exploitation", "Active Directory Persistence", "C2 Infrastructure", "Web Exploitation (OWASP Top 10)", "Privilege Escalation"],
    },
    {
      category: "Detection Engineering & Telemetry",
      icon: ShieldCheck,
      skills: ["Auditd / eBPF Tracing", "Systemd Anomaly Detection", "Suricata / Zeek Analysis", "SIEM Detection Rules (Sigma)", "Threat Hunting"],
    },
    {
      category: "Applied Machine Learning & XAI",
      icon: Cpu,
      skills: ["CatBoost & GBDT Inference", "SHAP Feature Attribution", "Lexical Feature Extraction", "Phishing Classification", "Adversarial Robustness"],
    },
    {
      category: "Cloud Security & Systems",
      icon: Layers,
      skills: ["AWS IAM Policies & SCPs", "IMDSv2 Enforcement", "Docker / Container Isolation", "Proxmox / KVM Lab Virtualization", "Linux Kernel Hardening"],
    },
  ];

  return (
    <KnowledgeBaseLayout>
      <article className="space-y-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border pb-3 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary">operator</span>
            <span>/</span>
            <span className="text-text-primary">resume</span>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-secondary font-mono">
            curriculum vitae
          </span>
        </div>

        {/* Header Dossier */}
        <header className="p-4 rounded border border-border bg-surface space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-text-primary font-mono">
                Resume &amp; Technical Dossier
              </h1>
              <p className="text-xs text-text-secondary font-mono mt-1">
                handle: r41n • security researcher &amp; engineer
              </p>
            </div>

            {resumeData?.pdfFile && (
              <a
                href={resumeData.pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-bg text-xs font-mono font-medium hover:bg-accent/90 transition-colors shadow-sm self-start sm:self-auto"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            )}
          </div>

          {/* Render Summary Document from CMS if present */}
          {summary && (
            <div className="pt-2 border-t border-border/60">
              <DocumentContent document={summary as unknown as Parameters<typeof DocumentContent>[0]["document"]} />
            </div>
          )}
        </header>

        {/* Technical Competencies Matrix */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h2 className="text-sm font-semibold tracking-tight text-text-primary font-mono uppercase">
              Core Technical Competencies
            </h2>
            <span className="text-[10px] font-mono text-text-secondary">4 domains</span>
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

                  <ul className="space-y-1 text-xs text-text-secondary font-mono">
                    {comp.skills.map((skill) => (
                      <li key={skill} className="flex items-center gap-1.5">
                        <span className="text-accent/70 select-none">›</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Proof of Work Cross-Links */}
        <section className="p-4 rounded border border-border bg-surface-2/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <p className="font-semibold text-text-primary">Operational Repositories &amp; Field Reports</p>
            <p className="text-text-secondary text-[11px] mt-0.5">
              Inspect open-source tooling, telemetry frameworks, and research writeups.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary flex items-center gap-1 transition-colors"
            >
              <span>Projects</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </Link>
            <Link
              href="/writeups"
              className="px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-2 text-text-primary flex items-center gap-1 transition-colors"
            >
              <span>Writeups</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </Link>
          </div>
        </section>
      </article>
    </KnowledgeBaseLayout>
  );
}
