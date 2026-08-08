import Link from "next/link";
import type { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] tracking-[.08em] text-[hsl(var(--accent))]">
      {children}
    </span>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container-editorial flex min-h-[72px] items-center justify-between gap-3 py-2 text-sm md:gap-7">
        <Link
          href="/"
          className="brand-mark text-base font-bold leading-tight text-[hsl(var(--primary))] md:text-[1.18rem]"
        >
          AI<span>기획자</span>로 살아남기
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 md:gap-3 text-xs md:text-sm">
          <Link href="/categories" className="nav-link">
            카테고리
          </Link>
          <Link href="/about" className="nav-link">
            소개
          </Link>
          <Link href="/privacy" className="nav-link">
            개인정보처리방침
          </Link>
          <Link href="/disclaimer" className="nav-link">
            면책조항
          </Link>
          <Link
            href="/contact"
            className="button-primary inline-flex items-center justify-center rounded-sm px-3 py-2 text-xs font-semibold leading-none md:px-4 md:py-2 md:text-sm"
          >
            연락하기
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/.45)]">
      <div className="container-editorial flex flex-col justify-between gap-3 py-8 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row">
        <span>© 2026 Trenqura. 개인적인 편집 기록입니다.</span>
        <span>읽고, 확인하고, 다시 고칩니다.</span>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="container-editorial py-14 md:py-20">
      <p className="rule-label">{eyebrow}</p>
      <h1 className="font-display mt-5 max-w-4xl text-4xl font-bold leading-[1.25] tracking-[-.04em] text-[hsl(var(--primary))] md:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-6 max-w-2xl text-base leading-8 text-[hsl(var(--muted-foreground))]">
          {description}
        </p>
      )}
    </section>
  );
}

export function Notice({ text }: { text: string }) {
  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.5)] p-5 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
      {text}
    </div>
  );
}
