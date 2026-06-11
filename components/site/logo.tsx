import Image from "next/image";
import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="TerangaDev — Accueil"
      className={cn(
        "group font-display inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="TerangaDev"
        width={28}
        height={19}
        priority
        className="h-5 w-auto transition-transform duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:rotate-3"
      />
      {showWordmark && <span>TerangaDev</span>}
    </Link>
  );
}
