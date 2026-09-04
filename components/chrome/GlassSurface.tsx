import React from "react";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GlassSurface({
  children,
  className = "",
  style,
  ...props
}: GlassSurfaceProps) {
  return (
    <div
      className={`glass-surface ${className}`}
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--glass-radius)",
        boxShadow: "var(--glass-shadow)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
