import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, Calendar, MapPin, MessageCircle, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("ContactPage");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28 md:pb-16">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>
        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] font-medium tracking-tight md:text-6xl lg:text-7xl">
          {t("headline")}
        </h1>
        <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          {t("subhead")}
        </p>
      </section>

      {/* Form + Channels */}
      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
              {t("formTitle")}
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
              {t("channelsTitle")}
            </p>
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="https://cal.com/terangadev"
                  target="_blank"
                  rel="noreferrer"
                  className="border-border bg-bg hover:border-teranga-primary/40 group flex items-start gap-4 rounded-2xl border p-6 transition-colors"
                >
                  <span className="bg-teranga-primary/10 text-teranga-primary inline-flex size-10 shrink-0 items-center justify-center rounded-full">
                    <Calendar className="size-4" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-medium tracking-tight">
                      {t("calendlyTitle")}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-relaxed">
                      {t("calendlyBody")}
                    </p>
                    <span className="text-teranga-primary mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                      {t("calendlyCta")}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="border-border bg-bg hover:border-teranga-primary/40 group flex items-start gap-4 rounded-2xl border p-6 transition-colors"
                >
                  <span className="bg-teranga-primary/10 text-teranga-primary inline-flex size-10 shrink-0 items-center justify-center rounded-full">
                    <MessageCircle className="size-4" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-medium tracking-tight">
                      {t("whatsappTitle")}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-relaxed">
                      {t("whatsappBody")}
                    </p>
                    <span className="text-teranga-primary mt-3 inline-flex items-center gap-1.5 font-mono text-sm">
                      {t("whatsappCta")}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="border-border bg-bg hover:border-teranga-primary/40 group flex items-start gap-4 rounded-2xl border p-6 transition-colors"
                >
                  <span className="bg-teranga-primary/10 text-teranga-primary inline-flex size-10 shrink-0 items-center justify-center rounded-full">
                    <Mail className="size-4" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-medium tracking-tight">
                      {t("emailTitle")}
                    </h3>
                    <p className="text-muted mt-2 font-mono text-sm">
                      {t("emailValue")}
                    </p>
                  </div>
                </a>
              </li>

              <li className="border-border bg-bg flex items-start gap-4 rounded-2xl border p-6">
                <span className="bg-teranga-primary/10 text-teranga-primary inline-flex size-10 shrink-0 items-center justify-center rounded-full">
                  <MapPin className="size-4" />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-medium tracking-tight">
                    {t("addressTitle")}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {t("addressLine1")}
                    <br />
                    {t("addressLine2")}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
