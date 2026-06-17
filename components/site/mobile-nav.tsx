"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems, secondaryNavItems, siteConfig } from "@/lib/site-config";
import { useMounted } from "@/lib/client-hooks";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const t = useTranslations("Nav");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("ariaToggleMenu")}
        aria-expanded={open}
        className="text-fg/80 hover:text-teranga-primary inline-flex size-9 items-center justify-center rounded-full md:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Portal to <body> so the full-screen drawer escapes the header's
          backdrop-filter, which would otherwise become its containing block
          and clip `fixed inset-0` to the header's height. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile-drawer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-bg fixed inset-0 z-50 md:hidden"
              >
                <div className="flex items-center justify-between px-6 py-5">
                  <span className="text-teranga-primary font-mono text-xs tracking-[0.2em] uppercase">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t("ariaCloseMenu")}
                    className="text-fg/80 hover:text-teranga-primary inline-flex size-9 items-center justify-center rounded-full"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <motion.nav
                  aria-label="Mobile primary"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                    },
                  }}
                  className="flex flex-col gap-2 px-6 pt-12"
                >
                  {navItems.map((item) => (
                    <motion.div
                      key={item.key}
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="font-display block py-2 text-4xl font-medium tracking-tight"
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="border-border mt-8 border-t pt-6"
                  >
                    <div className="flex flex-col gap-2">
                      {secondaryNavItems.map((item) => (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="text-muted hover:text-teranga-primary text-base transition-colors"
                        >
                          {t(item.key)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="mt-8 flex flex-col gap-3"
                  >
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-medium text-white transition-colors"
                    >
                      {t("cta")}
                    </Link>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="border-border hover:bg-surface inline-flex h-12 w-full items-center justify-center rounded-full border px-6 text-sm font-medium transition-colors"
                    >
                      WhatsApp
                    </a>
                  </motion.div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
