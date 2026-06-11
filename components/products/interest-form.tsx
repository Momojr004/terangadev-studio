"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(1),
  message: z.string().optional(),
  // Honeypot — must stay empty for humans; the API drops filled submissions.
  company_url: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function InterestForm({ product }: { product?: string }) {
  const t = useTranslations("ProductDetail");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormValues) {
    setError(false);
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, product }),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
    } catch {
      setError(true);
    }
  }

  if (submitted) {
    return (
      <div className="border-teranga-primary/30 bg-teranga-primary/5 flex items-center gap-3 rounded-2xl border p-6">
        <CheckCircle2 className="text-teranga-primary size-5 shrink-0" />
        <p className="text-sm">{t("formSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {/* Honeypot — visually hidden, off the tab order, ignored by humans. */}
      <input
        {...register("company_url")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {error && (
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

      <div className="grid gap-2">
        <label
          htmlFor="message"
          className="text-fg/80 font-mono text-xs uppercase tracking-[0.15em]"
        >
          {t("formMessage")}
        </label>
        <textarea
          id="message"
          rows={3}
          {...register("message")}
          className="border-border bg-bg focus:border-teranga-primary rounded-2xl border px-5 py-3 text-sm outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-teranga-primary hover:bg-teranga-secondary mt-2 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-white transition-colors duration-300 disabled:opacity-50"
      >
        {isSubmitting ? "…" : t("formSubmit")}
      </button>
    </form>
  );
}
