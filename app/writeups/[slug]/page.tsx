import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { KnowledgeBaseLayout } from '@/components/layout/KnowledgeBaseLayout';
import { DocumentContent } from '@/components/content/DocumentRenderer';
import { getArticleBySlug, getArticles } from '@/lib/articles';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

interface WriteupPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WriteupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug('writeups', slug);

  if (!article) {
    return {
      title: 'Writeup Not Found // r41n',
    };
  }

  return {
    title: `${article.meta.title} // r41n`,
    description: article.meta.description || `Security writeup and technical walkthrough.`,
  };
}

export async function generateStaticParams() {
  const writeups = await getArticles('writeup');
  return writeups.map((w) => ({ slug: w.slug }));
}

export default async function WriteupDetailPage({ params }: WriteupPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug('writeups', slug);

  if (!article) {
    notFound();
  }

  const allWriteups = await getArticles('writeup');
  const relatedItems = allWriteups
    .filter((w) => w.slug !== article.meta.slug)
    .slice(0, 3)
    .map((w) => ({
      title: w.title,
      href: `/writeups/${w.slug}`,
      category: w.category,
      readingTime: `${w.readingTime}m read`,
    }));

  return (
    <KnowledgeBaseLayout relatedItems={relatedItems}>
      <article className="space-y-6 font-mono">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border pb-3">
          <div className="flex items-center gap-1.5">
            <Link href="/writeups" className="hover:text-accent flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>writeups</span>
            </Link>
            <span>/</span>
            <span className="text-text-primary">{article.meta.slug}</span>
          </div>

          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-primary font-semibold">
            {article.meta.category}
          </span>
        </div>

        {/* Article Header Dossier */}
        <header className="p-4 rounded border border-border bg-surface space-y-3">
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            {article.meta.title}
          </h1>

          <p className="text-xs text-text-secondary leading-relaxed">
            {article.meta.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-2 border-t border-border/60">
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
                    className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border/70 text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Document Content Rendered from body.mdoc */}
        <div className="pt-2">
          {article.body ? (
            <DocumentContent document={article.body as unknown as Parameters<typeof DocumentContent>[0]['document']} />
          ) : (
            <p className="text-xs text-text-secondary italic">
              No writeup body currently available.
            </p>
          )}
        </div>

        {/* Footer Back Link */}
        <div className="pt-8 border-t border-border flex justify-between items-center text-xs">
          <Link
            href="/writeups"
            className="text-text-secondary hover:text-accent flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Writeups</span>
          </Link>
          <span className="text-text-secondary text-[11px]">
            artifact: {article.meta.slug}
          </span>
        </div>
      </article>
    </KnowledgeBaseLayout>
  );
}
