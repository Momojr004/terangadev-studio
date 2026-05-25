"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { FloatingIcons } from "@/components/site/floating-icons";

export function ConditionalShell({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isManifeste =
    pathname === "/manifeste" || pathname.startsWith("/manifeste/");

  if (isManifeste) {
    // Act 1 — full bleed, no header / no footer / no top padding.
    // Manifeste owns its own (stronger) backdrop.
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <div className="flex min-h-dvh flex-col">
        <main className="relative flex-1 overflow-x-clip pt-16 md:pt-20">
          {/* Tech icons floating layer — absolute over the full page
              height, scrolls with content (no fixed wallpaper). */}
          <FloatingIcons />
          <div className="relative">{children}</div>
        </main>
        {footer}
      </div>
    </>
  );
}
