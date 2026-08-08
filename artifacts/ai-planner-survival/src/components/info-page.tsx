import { Mail } from "lucide-react";

import { siteConfig } from "../data";
import { PageIntro, Shell } from "./layout";

type InfoKind = "about" | "contact" | "privacy" | "disclaimer";

const pages: Record<InfoKind, [string, string]> = {
  about: [
    "사이트 소개",
    "문제 정의 → 기획 → 구현 → 검증·운영까지, 실제로 손대고 결정한 과정과 그때의 판단을 남깁니다. 성공담보다, 방향을 바꾼 순간과 다시 확인한 방법을 더 많이 씁니다.\n\n### 이 사람이 씁니다\n- Hermes Agent 등 자동화 에이전트를 직접 운영하며, 역할·자동화 범위·품질 게이트를 설계합니다.\n- Supabase·Vercel·WordPress 등 실제 스택으로 소규모 앱과 사이트를 직접 만듭니다.\n- 콘텐츠 운영, 개인 브랜딩, 협업 툴 정책 등도 실험하고 기록합니다.\n- 이 블로그는 **개인 경험 기반의 AI 기획·개발 기록**입니다.",
  ],
  contact: [
    "연락하기",
    `${siteConfig.email}으로 편집 제안과 정정 요청을 보내주세요.`,
  ],
  privacy: [
    "개인정보처리방침",
    "이 블로그는 읽기 중심의 공개 기록입니다. 회원가입·로그인·댓글 등 사용자 계정 기능은 제공하지 않습니다.\n\n### 수집하는 정보\n- 방문 기록: 사이트 운영에 필요한 최소한의 접속 로그가 발생할 수 있습니다.\n- 분석 도구: Google AdSense 등 광고·분석 스크립트가 쿠키를 사용할 수 있습니다.\n\n### 보관과 접근\n- 편집실 데이터는 Supabase 인증과 접근 정책으로 보호합니다.\n- 외부 공유는 원칙적으로 하지 않습니다.\n\n### 문의\n- trend_curation@naver.com",
  ],
  disclaimer: [
    "면책조항",
    "본 블로그의 모든 콘텐츠는 1인 AI 기획자의 개인적인 경험과 견해이며, 소속 기관의 공식 입장과 무관합니다.\n\n도구·서비스·기술에 대한 평가는 당시의 맥락과 판단을 기록한 것이며, 오늘의 정답을 보장하지 않습니다. 정보를 활용한 결과에 대한 책임은 각자에게 있습니다.",
  ],
};

export function getInfoMeta(kind: InfoKind) {
  const [title, raw] = pages[kind];
  return { title, description: raw.split("\n")[0] };
}

export function InfoPage({ kind }: { kind: InfoKind }) {
  const [title, raw] = pages[kind];
  const firstLine = raw.split("\n")[0];
  const bodyLines = raw.split("\n");
  const renderedBody = bodyLines
    .map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={`br-${index}`} />;
      if (trimmed.startsWith("- "))
        return (
          <li key={`li-${index}`} className="ml-5 list-disc">
            {trimmed.slice(2)}
          </li>
        );
      if (trimmed.startsWith("### "))
        return (
          <h3
            key={`h-${index}`}
            className="mt-6 text-lg font-bold text-[hsl(var(--primary))]"
          >
            {trimmed.slice(4)}
          </h3>
        );
      return (
        <p
          key={`p-${index}`}
          className="mt-3 text-base leading-8 text-[hsl(var(--muted-foreground))]"
        >
          {trimmed}
        </p>
      );
    })
    .filter((_node, index) => !(kind === "about" && index === 0));

  return (
    <Shell>
      <main>
        <PageIntro
          eyebrow="TRUST / TRENQURA"
          title={title}
          description={kind === "about" ? firstLine : undefined}
        />
        <section className="container-editorial pb-20">
          {renderedBody}
          {kind === "contact" && (
            <section className="mt-8">
              <a
                className="button-primary inline-flex rounded-sm px-5 py-3"
                href={`mailto:${siteConfig.email}`}
              >
                <Mail className="mr-2" size={16} />
                메일 보내기
              </a>
            </section>
          )}
        </section>
      </main>
    </Shell>
  );
}
