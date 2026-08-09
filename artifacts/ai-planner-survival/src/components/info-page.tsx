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
    `이 블로그(trencub.com, 이하 '사이트')는 읽기 중심의 개인 운영 블로그입니다. 회원가입, 로그인, 댓글 등 방문자가 계정을 만들어야 하는 기능은 제공하지 않습니다.\n\n### 수집하는 정보\n- 접속 로그: 서버 운영 과정에서 방문 시각, 접속 페이지, 기기·브라우저 정보, IP 기반의 대략적인 접속 지역 등이 자동으로 기록될 수 있습니다.\n- 광고 쿠키: 이 사이트는 Google AdSense 등 제3자 광고 서비스를 이용할 수 있습니다. Google을 포함한 제3자 공급업체는 쿠키를 사용하여 이용자가 이 사이트 또는 다른 사이트를 방문한 기록을 바탕으로 광고를 게재합니다.\n- 분석 도구: 방문자 수, 인기 게시글 등을 파악하기 위한 분석 스크립트가 쿠키를 사용할 수 있습니다.\n\n### 쿠키와 광고 개인화\n- Google의 광고 쿠키 사용 방식과 광고 개인화를 끄는 방법은 Google 광고 센터(myadcenter.google.com) 또는 www.aboutads.info/choices 에서 확인할 수 있습니다.\n- 브라우저 설정에서 쿠키 저장을 거부하거나 이미 저장된 쿠키를 삭제할 수 있으며, 이 경우 일부 기능이 정상적으로 동작하지 않을 수 있습니다.\n\n### 정보의 보관과 접근\n- 편집실(관리자) 데이터는 Supabase 인증과 접근 정책(Row Level Security)으로 보호되며, 운영자 본인만 접근할 수 있습니다.\n- 수집된 정보를 광고·분석 목적 외의 용도로 제3자에게 판매하거나 제공하지 않습니다.\n- 법령에 따라 요구되는 경우를 제외하고 정보를 외부에 공유하지 않습니다.\n\n### 만 14세 미만 이용자\n- 이 사이트는 만 14세 미만 어린이를 대상으로 하지 않으며, 어린이의 개인정보를 의도적으로 수집하지 않습니다.\n\n### 방침의 변경\n- 이 방침은 서비스 변경이나 관련 법령 개정에 따라 사전 예고 없이 수정될 수 있으며, 변경 시 이 페이지에 갱신된 내용을 게시합니다.\n- 최종 수정일: 2026년 8월 9일\n\n### 문의\n- ${siteConfig.email}`,
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
