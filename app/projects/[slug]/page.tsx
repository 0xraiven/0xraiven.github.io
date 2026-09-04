import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { KnowledgeBaseLayout } from '@/components/layout/KnowledgeBaseLayout';
import { DocumentContent } from '@/components/content/DocumentRenderer';
import { StayTuned } from '@/components/content/StayTuned';
import { getProjectBySlug, getProjects } from '@/lib/projects';
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  ArrowLeft,
  Code2,
} from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found // r41n',
    };
  }

  return {
    title: `${project.title} // r41n`,
    description: project.description || `Technical documentation and architecture for ${project.title}.`,
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getProjects();
  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      href: `/projects/${p.slug}`,
      category: p.category,
      readingTime: `${p.technologies.length} techs`,
    }));

  const statusStyles = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    building: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    archived: 'text-text-secondary bg-surface-2 border-border',
    planned: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  const pillStyle =
    statusStyles[project.status as keyof typeof statusStyles] || statusStyles.active;

  return (
    <KnowledgeBaseLayout relatedItems={relatedProjects}>
      <article className="space-y-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border pb-3 font-mono">
          <div className="flex items-center gap-1.5">
            <Link href="/projects" className="hover:text-accent flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>projects</span>
            </Link>
            <span>/</span>
            <span className="text-text-primary">{project.slug}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-secondary">
              {project.category}
            </span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${pillStyle}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Project Header Dossier */}
        <header className="p-4 rounded border border-border bg-surface space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              {project.title}
            </h1>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1 shrink-0"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Source Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            {project.description}
          </p>

          {/* Telemetry Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-2 border-t border-border/60">
            {project.githubData && (
              <>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>{project.githubData.stars} stars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5" />
                  <span>{project.githubData.forks} forks</span>
                </div>
                {project.githubData.language && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-primary">Lang:</span>
                    <span>{project.githubData.language}</span>
                  </div>
                )}
              </>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border/70 text-text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Document Content Rendered from body.mdoc */}
        <div className="pt-2">
          {project.body ? (
            <DocumentContent document={project.body as unknown as Parameters<typeof DocumentContent>[0]['document']} />
          ) : (
            <StayTuned
              title="Project Architecture Dossier In Progress"
              category="documentation-pending"
              description="This project repository has been synchronized. Deep architecture notes, benchmark data, and exploit demonstrations are being compiled for publication."
              returnUrl="/projects"
              returnLabel="All Projects"
            />
          )}
        </div>

        {/* Footer Back Link */}
        <div className="pt-8 border-t border-border flex justify-between items-center text-xs">
          <Link
            href="/projects"
            className="text-text-secondary hover:text-accent flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects Directory</span>
          </Link>
          <span className="text-text-secondary text-[11px]">
            artifact: {project.slug}
          </span>
        </div>
      </article>
    </KnowledgeBaseLayout>
  );
}
