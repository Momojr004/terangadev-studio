import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { navItems, secondaryNavItems, siteConfig } from "@/lib/site-config";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface mt-32 border-t">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="font-display mt-5 max-w-sm text-2xl leading-tight tracking-tight">
              {t("tagline")}
            </p>
            <div className="text-muted mt-8 space-y-1.5 text-sm">
              <p>{t("address")}</p>
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-teranga-primary transition-colors"
                >
                  {siteConfig.email}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teranga-primary transition-colors"
                >
                  {t("whatsappLabel")} · {t("whatsapp")}
                </a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-fg/70 font-mono text-xs uppercase tracking-[0.2em]">
              {t("navTitle")}
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-muted hover:text-teranga-primary transition-colors"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
              {secondaryNavItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-muted hover:text-teranga-primary transition-colors"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-fg/70 font-mono text-xs uppercase tracking-[0.2em]">
              {t("stackTitle")}
            </h3>
            <ul className="text-muted mt-5 flex flex-wrap gap-2 font-mono text-xs">
              {siteConfig.stack.map((tech) => (
                <li
                  key={tech}
                  className="border-border bg-bg rounded-full border px-3 py-1.5"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border mt-16 flex flex-col gap-3 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-muted text-xs">
            © {year} TerangaDev — {t("rights")}
          </p>
          <div className="text-muted flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link
              href="/mentions-legales"
              className="hover:text-teranga-primary transition-colors"
            >
              {t("mentionsLegales")}
            </Link>
            <Link
              href="/confidentialite"
              className="hover:text-teranga-primary transition-colors"
            >
              {t("confidentialite")}
            </Link>
            <span>{t("hosted")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
