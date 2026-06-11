import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  children,
  className,
  id,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "surface" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-24 md:py-32",
        // surface/dark variants kept transparent so the global site
        // backdrop is the single source of truth for color rhythm —
        // no more visible stripes between sections.
        variant === "dark" && "dark:bg-teranga-dark dark:text-white",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
      {children}
    </p>
  );
}

export function SectionHeadline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display mt-6 max-w-4xl text-4xl leading-[1.1] font-medium tracking-tight md:text-5xl lg:text-6xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionSubhead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("text-muted mt-6 max-w-2xl text-lg leading-relaxed", className)}
    >
      {children}
    </p>
  );
}
