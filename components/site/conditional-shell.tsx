"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

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
    // Act 1 — full bleed, no header / no footer / no top padding
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <div className="flex min-h-dvh flex-col">
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        {footer}
      </div>
    </>
  );
}
