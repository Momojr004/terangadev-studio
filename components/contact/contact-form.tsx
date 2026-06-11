"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";

const projectTypes = [
  "platforms",
  "support",
  "brand",
  "ecommerce",
  "audit",
  "marketing",
  "other",
] as const;

const budgets = [
  "<500k",
  "500k-1.5M",
  "1.5M-5M",
  "5M-15M",
  "15M+",
  "tbd",
] as const;

const timelines = [
  "urgent",
  "standard",
  "comfortable",
  "flexible",
  "tbd",
] as const;

const projectTypeLabelsFr: Record<(typeof projectTypes)[number], string> = {
  platforms: "Plateforme de gestion sur mesure",
  support: "Accompagnement A-Z (idée → prod)",
  brand: "Identité + site vitrine",
  ecommerce: "E-commerce",
  audit: "Audit SI ou sécurité",
  marketing: "Marketing digital",
  other: "Autre",
};

const budgetLabelsFr: Record<(typeof budgets)[number], string> = {
  "<500k": "< 500 000 FCFA",
  "500k-1.5M": "500 000 → 1 500 000 FCFA",
  "1.5M-5M": "1 500 000 → 5 000 000 FCFA",
  "5M-15M": "5 000 000 → 15 000 000 FCFA",
  "15M+": "15 000 000+ FCFA",
  tbd: "Pas encore défini",
};

const timelineLabelsFr: Record<(typeof timelines)[number], string> = {
  urgent: "Urgent (< 1 mois)",
  standard: "Standard (1 → 3 mois)",
  comfortable: "Confortable (3 → 6 mois)",
  flexible: "Flexible",
  tbd: "Pas encore défini",
};

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(1),
  projectType: z.enum(projectTypes),
  budget: z.enum(budgets),
  timeline: z.enum(timelines),
  message: z.string().min(10),
  // Honeypot — must stay empty for humans. Registered (so its value flows
  // through `data`) but unvalidated; the API drops any submission that fills it.
  company_url: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations("ContactPage");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-teranga-primary/30 bg-teranga-primary/5 flex items-center gap-3 rounded-2xl border p-6">
        <CheckCircle2 className="text-teranga-primary size-5 shrink-0" />
        <p className="text-sm">{t("formSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      {/* Honeypot — visually hidden, off the tab order, ignored by humans. */}
      <input
        {...register("company_url")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/5 p-4">
          <AlertCircle className="size-5 shrink-0 text-red-500" />
          <p className="text-sm">{t("formError")}</p>
        </div>
      )}

      <div className="grid gap-2">
        <label
          htmlFor="name"
          className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
        >
          {t("formName")}
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className="border-border bg-bg focus:border-teranga-primary h-11 rounded-full border px-5 text-sm outline-none transition-colors"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="email"
            className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
          >
            {t("formEmail")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="border-border bg-bg focus:border-teranga-primary h-11 rounded-full border px-5 text-sm outline-none transition-colors"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="company"
            className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
          >
            {t("formCompany")}
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            {...register("company")}
            className="border-border bg-bg focus:border-teranga-primary h-11 rounded-full border px-5 text-sm outline-none transition-colors"
          />
          {errors.company && (
            <p className="text-xs text-red-500">{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="projectType"
          className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
        >
          {t("formProjectType")}
        </label>
        <select
          id="projectType"
          {...register("projectType")}
          defaultValue=""
          className="border-border bg-bg focus:border-teranga-primary h-11 rounded-full border px-5 text-sm outline-none transition-colors"
        >
          <option value="" disabled>
            {t("formProjectTypePlaceholder")}
          </option>
          {projectTypes.map((p) => (
            <option key={p} value={p}>
              {projectTypeLabelsFr[p]}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p className="text-xs text-red-500">Champ requis</p>
        )}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="budget"
            className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
          >
            {t("formBudget")}
          </label>
          <select
            id="budget"
            {...register("budget")}
            defaultValue=""
            className="border-border bg-bg focus:border-teranga-primary h-11 rounded-full border px-5 text-sm outline-none transition-colors"
          >
            <option value="" disabled>
              {t("formBudgetPlaceholder")}
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {budgetLabelsFr[b]}
              </option>
            ))}
          </select>
          {errors.budget && (
            <p className="text-xs text-red-500">Champ requis</p>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="timeline"
            className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
          >
            {t("formTimeline")}
          </label>
          <select
            id="timeline"
            {...register("timeline")}
            defaultValue=""
            className="border-border bg-bg focus:border-teranga-primary h-11 rounded-full border px-5 text-sm outline-none transition-colors"
          >
            <option value="" disabled>
              {t("formTimelinePlaceholder")}
            </option>
            {timelines.map((tl) => (
              <option key={tl} value={tl}>
                {timelineLabelsFr[tl]}
              </option>
            ))}
          </select>
          {errors.timeline && (
            <p className="text-xs text-red-500">Champ requis</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="message"
          className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
        >
          {t("formMessage")}
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="border-border bg-bg focus:border-teranga-primary rounded-2xl border px-5 py-3 text-sm outline-none transition-colors"
        />
        {errors.message && (
          <p className="text-xs text-red-500">10 caractères minimum</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-teranga-primary hover:bg-teranga-secondary mt-2 inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-medium text-white transition-colors duration-300 disabled:opacity-50"
      >
        {isSubmitting ? t("formSubmitting") : t("formSubmit")}
      </button>
    </form>
  );
}
