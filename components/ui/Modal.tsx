"use client";

import React, { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/chrome/GlassSurface";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal dialog"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Dimmed backdrop - flat, unblurred per architecture §4.4 */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} z-10 transition-all duration-150 motion-reduce:transition-none ${className}`}
      >
        <GlassSurface className="w-full rounded border p-5 shadow-2xl space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            {title ? (
              <h2 className="text-sm font-semibold tracking-tight text-text-primary font-mono">
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
        </GlassSurface>
      </div>
    </div>
  );
}
