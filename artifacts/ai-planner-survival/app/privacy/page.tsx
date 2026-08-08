import type { Metadata } from "next";

import { getInfoMeta, InfoPage } from "../../src/components/info-page";

const meta = getInfoMeta("privacy");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <InfoPage kind="privacy" />;
}
