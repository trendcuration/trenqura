import Link from "next/link";

import { Shell } from "../src/components/layout";

export default function NotFound() {
  return (
    <Shell>
      <main className="container-editorial py-28">
        <p className="rule-label">404 / NOT FOUND</p>
        <h1 className="font-display mt-5 text-5xl font-bold text-[hsl(var(--primary))]">
          페이지가 비어 있습니다.
        </h1>
        <Link
          href="/"
          className="button-primary mt-8 inline-flex rounded-sm px-5 py-3"
        >
          홈으로 돌아가기
        </Link>
      </main>
    </Shell>
  );
}
