"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/categories", label: "카테고리" },
  { href: "/about", label: "소개" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/disclaimer", label: "면책조항" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center text-[hsl(var(--primary))]"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-6 text-base shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link py-3"
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="button-primary mt-3 inline-flex items-center justify-center rounded-sm px-4 py-3 text-sm font-semibold"
            onClick={close}
          >
            연락하기
          </Link>
        </nav>
      )}
    </div>
  );
}
