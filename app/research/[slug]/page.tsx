import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { DocumentContent } from "@/components/content/DocumentRenderer";
import { StayTuned } from "@/components/content/StayTuned";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, Microscope, FlaskConical } from "lucide-react";

interface ResearchPageProps {
  params: Promise<{ slug: string }>;
}

function formatCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: ResearchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("research", slug);

  if (article) {
    return {
      title: `${article.meta.title} // r41n`,
      description: article.meta.description || "Security research, vulnerability advisory, and whitepaper.",
    };
  }

  const label = formatCategoryLabel(slug);
  return {
    title: `${label} // Security Research // r41n`,
    description: `Vulnerability assessments and whitepapers for ${label}.`,
  };
}

export async function generateStaticParams() {
  const research = await getArticles("research");
  const slugs = new Set(research.map((r) => r.slug));

  slugs.add("security-research");

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function ResearchDetailPage({ params }: ResearchPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug("research", slug);

  if (article) {
    const allResearch = await getArticles("research");
    const relatedItems = allResearch
      .filter((r) => r.slug !== article.meta.slug)
      .slice(0, 3)
      .map((r) => ({
        title: r.title,
        href: `/research/${r.slug}`,
        category: r.category,
        readingTime: `${r.readingTime}m read`,
      }));

    return (
      <KnowledgeBaseLayout relatedItems={relatedItems}>
        <article className="space-y-6 font-mono">
          {/* Navigation & Breadcrumb */}
          <div className="flex items-center justify-between text-xs text-text-secondary border-b border-border pb-3">
            <div className="flex items-center gap-1.5">
              <Link href="/research" className="hover:text-accent flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>research</span>
              </Link>
              <span>/</span>
              <span className="text-text-primary">{article.meta.slug}</span>
            </div>

            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border text-text-primary font-semibold">
              {article.meta.category}
            </span>
          </div>

          {/* Research Header */}
          <header className="p-4 rounded border border-border bg-surface space-y-3">
            <div className="flex items-center gap-2">
              <Microscope className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                {article.meta.title}
              </h1>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed font-sans">
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
                      className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border/70 text-text-primary"
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
              <StayTuned
                sector={`Security Research // ${article.meta.title}`}
                category={article.meta.category}
                returnUrl="/research"
                returnLabel="Back to Research"
              />
            )}
          </div>

          {/* Footer Back Link */}
          <div className="pt-8 border-t border-border flex justify-between items-center text-xs">
            <Link
              href="/research"
              className="text-text-secondary hover:text-accent flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Research Directory</span>
            </Link>
            <span className="text-text-secondary text-[11px]">
              artifact: {article.meta.slug}
            </span>
          </div>
        </article>
      </KnowledgeBaseLayout>
    );
  }

  // If slug is the category "security-research"
  if (slug === "security-research") {
    const allResearch = await getArticles("research");
    const label = "Security Research";

    return (
      <KnowledgeBaseLayout>
        <div className="space-y-8 font-mono">
          {/* Navigation & Breadcrumb */}
          <header className="space-y-2 border-b border-border pb-4">
            <div className="text-xs text-text-secondary flex items-center gap-1.5">
              <Link href="/research" className="hover:text-accent flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>research</span>
              </Link>
              <span>/</span>
              <span className="text-text-primary">{slug}</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight text-text-primary uppercase flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-accent" />
                <span>{label}</span>
              </h1>
              <span className="text-xs text-text-secondary">
                [{allResearch.length} papers]
              </span>
            </div>
          </header>

          {allResearch.length === 0 ? (
            <StayTuned
              sector={`Security Research // ${label}`}
              category={slug}
              description="Security vulnerability research, exploit primitives, and protocol analysis are actively undergoing validation and peer review."
              returnUrl="/research"
              returnLabel="Research Directory"
            />
          ) : (
            <div className="space-y-3">
              {allResearch.map((item) => (
                <article
                  key={item.slug}
                  className="p-4 rounded border border-border bg-surface hover:border-accent/40 transition-colors group space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-secondary">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-border font-semibold text-text-primary">
                      {item.category}
                    </span>
                    {item.date && <span>{item.date}</span>}
                  </div>

                  <div>
                    <Link
                      href={`/research/${item.slug}`}
                      className="text-base font-bold text-text-primary group-hover:text-accent transition-colors flex items-center justify-between"
                    >
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-accent shrink-0 ml-2" />
                    </Link>

                    {item.description && (
                      <p className="text-xs text-text-secondary leading-relaxed mt-1 font-sans">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </KnowledgeBaseLayout>
    );
  }

  notFound();
}
