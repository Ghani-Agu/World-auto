"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardPaste, Link2 } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { detectPlatform, platforms } from "@/lib/platforms";

export default function HeroPaste() {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const detected = url ? detectPlatform(url) : undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = url.trim();
    router.push(`/${locale}/quote${q ? `?url=${encodeURIComponent(q)}` : ""}`);
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      /* clipboard permission denied — ignore */
    }
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className="group relative flex flex-col gap-2 rounded-2xl border border-line-2 bg-panel/80 p-2 shadow-[0_30px_80px_-40px_rgb(255_90_31/0.6)] backdrop-blur focus-within:border-signal/60 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3 px-3">
          <Link2 className="h-5 w-5 shrink-0 text-signal" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={dict.home.pastePlaceholder}
            dir="ltr"
            className="h-12 w-full min-w-0 bg-transparent font-mono text-sm text-paper outline-none placeholder:text-fog/70"
            inputMode="url"
            aria-label={dict.quote.placeholder}
          />
          {detected ? (
            <span className="tag shrink-0 rounded-md px-2 py-1 text-white" style={{ background: detected.color }}>
              {detected.name}
            </span>
          ) : (
            <button type="button" onClick={paste} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-fog hover:bg-white/5 hover:text-paper" aria-label="Paste">
              <ClipboardPaste className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-signal px-6 text-sm font-semibold text-white transition hover:bg-signal-2">
          {dict.home.pasteCta}
          <ArrowRight className="rtl-flip h-4 w-4" />
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-fog">
        <span>{dict.home.pasteHint}</span>
        {platforms.slice(0, 6).map((p) => (
          <span key={p.key} className="rounded-md border border-line px-2 py-1 font-medium text-mist" dir="ltr">
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}
