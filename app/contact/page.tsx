import React from "react";
import type { Metadata } from "next";
import { KnowledgeBaseLayout } from "@/components/layout/KnowledgeBaseLayout";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Communications // r41n",
  description: "Verified social coordinates, encrypted communication channels, PGP keys, and direct operator dispatch for 0xraiven.",
};

const RELATED_SECTIONS = [
  { title: "Operator Profile", href: "/about", category: "operator" },
  { title: "Resume & Credentials", href: "/resume", category: "operator" },
  { title: "Projects & Repositories", href: "/projects", category: "projects" },
  { title: "Hack The Box Writeups", href: "/writeups/htb", category: "writeups" },
];

export default function ContactPage() {
  return (
    <KnowledgeBaseLayout relatedItems={RELATED_SECTIONS}>
      <ContactClient />
    </KnowledgeBaseLayout>
  );
}
