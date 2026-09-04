import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { ArrowLeft, Calendar, Clock, Tag, FileText } from "lucide-react";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("notes", slug);

  if (!article) {
    return {
      title: "Note Not Found // r41n",
    };
  }

  return {
    title: `${article.meta.title} // r41n`,
    description: article.meta.description || "Operational note and technical reference.",
  };
}

export async function generateStaticParams() {
  const notes = await getArticles("note");
  return notes.map((n) => ({ slug: n.slug }));
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug("notes", slug);

  if (!article) {
    notFound();
  }

  const allNotes = await getArticles("note");
  const relatedItems = allNotes
    .filter((n) => n.slug !== article.meta.slug)
    .slice(0, 3)
    .map((n) => ({
      title: n.title,
      href: `/notes/${n.slug}`,
      category: n.category,
      readingTime: `${n.readingTime}m read`,
    }));

  return (
    <KnowledgeBaseLayout relatedItems={relatedItems}>
      <article className="space-y-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border pb-3 font-mono">
          <div className="flex items-center gap-1.5">
            <Link href="/notes" className="hover:text-accent flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>notes</span>
            </Link>
            <span>/</span>
            <span className="text-text-primary">{article.meta.slug}</span>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-primary font-semibold">
            {article.meta.category}
          </span>
        </div>

        {/* Note Header Dossier */}
        <header className="p-4 rounded border border-border bg-surface space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <h1 className="text-xl font-bold tracking-tight text-text-primary font-mono">
              {article.meta.title}
            </h1>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed font-sans">
            {article.meta.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary pt-2 border-t border-border/60">
            {article.meta.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-text-secondary" />
                <span>{article.meta.date}</span>
              </div>
            )}
            {article.meta.readingTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>{article.meta.readingTime} min read</span>
              </div>
            )}

            {article.meta.tags && article.meta.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-text-secondary/60 shrink-0" />
                {article.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.2 rounded bg-surface-2 border border-border/70 text-text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Document Content */}
        <div className="pt-2">
          {article.body ? (
            <DocumentContent document={article.body as unknown as Parameters<typeof DocumentContent>[0]["document"]} />
          ) : (
            <p className="text-xs text-text-secondary italic">
              No technical note body available.
            </p>
          )}
        </div>

        {/* Footer Back Link */}
        <div className="pt-8 border-t border-border flex justify-between items-center text-xs font-mono">
          <Link
            href="/notes"
            className="text-text-secondary hover:text-accent flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Notes Directory</span>
          </Link>
          <span className="text-text-secondary text-[11px]">
            artifact: {article.meta.slug}
          </span>
        </div>
      </article>
    </KnowledgeBaseLayout>
  );
}
