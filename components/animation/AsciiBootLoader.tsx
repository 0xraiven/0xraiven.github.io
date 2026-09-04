"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Terminal, Shield, ArrowRight, X } from "lucide-react";

const ASCII_BANNER = `
██████╗      ██╗  ██╗       ██╗     ███╗   ██╗
██╔══██╗     ██║  ██║      ███║     ████╗  ██║
██████╔╝     ███████║      ╚██║     ██╔██╗ ██║
██╔══██╗     ╚════██║       ██║     ██║╚██╗██║
██║  ██║          ██║       ██║     ██║ ╚████║
╚═╝  ╚═╝          ╚═╝       ╚═╝     ╚═╝  ╚═══╝
`;

const BOOT_STEPS = [
  { time: "[0.012]", msg: "INITIALIZING KERNEL DRIVERS", status: "OK" },
  { time: "[0.048]", msg: "MOUNTING CRYPTOGRAPHIC VOLUMES", status: "OK" },
  { time: "[0.092]", msg: "LOADING TOOLSETS", status: "OK" },
  { time: "[0.141]", msg: "VERIFYING MATRIX CIPHER STREAMS", status: "OK" },
  { time: "[0.195]", msg: "SYNCHRONIZING 0xRAIVEN GATEWAY", status: "OK" },
];

export function AsciiBootLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("r41n_booted", "true");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Only display on the first visit of the browser session
    try {
      const alreadyBooted = sessionStorage.getItem("r41n_booted");
      if (!alreadyBooted) {
        setIsVisible(true);
      }
    } catch {
      // ignore
    }

    const handleReboot = () => {
      setIsVisible(true);
      setCurrentStep(0);
      setProgress(0);
      setIsDone(false);
    };

    window.addEventListener("r41n:boot", handleReboot);
    return () => window.removeEventListener("r41n:boot", handleReboot);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Handle Escape key to skip instantly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Progressive step sequence
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < BOOT_STEPS.length) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 140);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsDone(true);
          // Auto dismiss after completion
          setTimeout(() => {
            dismiss();
          }, 350);
          return 100;
        }
        return prev + 12;
      });
    }, 90);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible, dismiss]);

  if (!isVisible) return null;

  // Build 24-character ASCII progress bar
  const totalBarWidth = 24;
  const filledChars = Math.min(totalBarWidth, Math.floor((progress / 100) * totalBarWidth));
  const progressBarString = "█".repeat(filledChars) + "░".repeat(Math.max(0, totalBarWidth - filledChars));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Terminal bootloader"
      onClick={dismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-bg/95 backdrop-blur-md select-none cursor-pointer transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded border border-accent/40 bg-surface p-4 sm:p-6 font-mono text-xs shadow-2xl space-y-4 overflow-hidden"
      >
        {/* Window Top Bar */}
        <div className="flex items-center justify-between border-b border-border pb-2.5 text-[11px] text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse inline-block" />
            <span className="font-bold text-text-primary uppercase tracking-wider">
              r41n // SEC_OPS_BOOT_SEQUENCE
            </span>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Skip boot sequence"
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
          >
            <span>SKIP [ESC]</span>
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* ASCII Banner */}
        <div className="text-center overflow-x-auto select-none py-1">
          <pre className="text-[9px] sm:text-[11px] leading-[1.15] text-accent font-bold inline-block text-left">
            {ASCII_BANNER}
          </pre>
          <div className="text-[10px] text-text-secondary tracking-widest uppercase mt-1">
            OFFENSIVE SECURITY • RED TEAM • TECHNICAL KB
          </div>
        </div>

        {/* Boot Sequence Lines */}
        <div className="space-y-1 py-1 text-[11px] font-mono border-t border-b border-border/70 my-2">
          {BOOT_STEPS.slice(0, currentStep).map((step, idx) => (
            <div key={idx} className="flex items-center justify-between animate-page-reveal">
              <span className="text-text-secondary">
                <span className="text-accent">{step.time}</span> {step.msg}
              </span>
              <span className="text-emerald-500 font-bold ml-2">[{step.status}]</span>
            </div>
          ))}
          {currentStep < BOOT_STEPS.length && (
            <div className="flex items-center gap-2 text-accent">
              <span className="animate-pulse">⠋</span>
              <span className="animate-terminal-blink">EXECUTING_SYSCALL...</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-text-secondary">BUFFER_INITIALIZATION</span>
            <span className="text-accent font-bold">{progress}%</span>
          </div>
          <div className="flex items-center gap-2 text-accent font-mono text-xs">
            <span>[</span>
            <span className="tracking-wider">{progressBarString}</span>
            <span>]</span>
          </div>
        </div>

        {/* Click to enter action bar */}
        <div className="pt-2 flex items-center justify-between text-[10px] text-text-secondary border-t border-border/60">
          <span className="hidden sm:inline">ARCH: x86_64_LINUX // 0xRAIVEN</span>
          <button
            type="button"
            onClick={dismiss}
            className="flex items-center gap-1 text-accent hover:underline ml-auto font-semibold"
          >
            <span>{isDone ? "ENTER CONSOLE >>" : "PRESS ANY KEY TO SKIP"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
