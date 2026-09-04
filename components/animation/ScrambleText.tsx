"use client";

import React, { useEffect, useState, useRef } from "react";

export interface ScrambleTextProps {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
  speed?: number;
  delay?: number;
  className?: string;
}

const CIPHER_GLYPHS = "01!@#$%&*<>[]{}~=+/\\λπΩΨΔ";

export function ScrambleText({
  text,
  as: Component = "span",
  speed = 28,
  delay = 0,
  className = "",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  // Trigger when visible in viewport
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      // Show initial scrambled placeholder
      setDisplayText(
        text
          .split("")
          .map((char) =>
            char === " " ? " " : CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)]
          )
          .join("")
      );
      return;
    }

    let frame = 0;
    const totalFrames = text.length * 3;
    let timeoutId: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealedChars = Math.floor(progress * text.length);

        const current = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < revealedChars) return char;
            return CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
          })
          .join("");

        setDisplayText(current);

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, speed);

      timeoutId = interval as unknown as NodeJS.Timeout;
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (timeoutId) clearInterval(timeoutId);
    };
  }, [hasStarted, text, speed, delay]);

  return (
    // @ts-expect-error Component dynamic tag type
    <Component ref={elementRef} className={`font-mono inline-block ${className}`}>
      {displayText || text}
    </Component>
  );
}
