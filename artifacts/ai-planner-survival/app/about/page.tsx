import type { Metadata } from "next";

import { getInfoMeta, InfoPage } from "../../src/components/info-page";

const meta = getInfoMeta("about");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <InfoPage kind="about" />;
}
