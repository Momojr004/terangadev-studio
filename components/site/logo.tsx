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
        "group inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="transition-transform duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:rotate-3"
      >
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#4EA8F9" />
            <stop offset="1" stopColor="#0A68F7" />
          </linearGradient>
        </defs>
        <path
          d="M3 4.5 H17 L20 7.5 V11 H13 V20 L9.5 16.5 V11 H3 Z"
          fill="url(#logo-gradient)"
        />
      </svg>
      {showWordmark && <span>TerangaDev</span>}
    </Link>
  );
}
