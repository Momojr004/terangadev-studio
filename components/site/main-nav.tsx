import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/site-config";
import { cn } from "@/lib/cn";

export function MainNav({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  return (
    <nav
      aria-label="Primary"
      className={cn("hidden items-center gap-8 md:flex", className)}
    >
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="text-fg/80 hover:text-teranga-primary text-sm font-medium transition-colors duration-200"
        >
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}
