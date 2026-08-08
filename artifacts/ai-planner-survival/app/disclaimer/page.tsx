import type { Metadata } from "next";

import { getInfoMeta, InfoPage } from "../../src/components/info-page";

const meta = getInfoMeta("disclaimer");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return <InfoPage kind="disclaimer" />;
}
