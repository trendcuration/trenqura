import type { Metadata } from "next";

import { getInfoMeta, InfoPage } from "../../src/components/info-page";

const meta = getInfoMeta("contact");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <InfoPage kind="contact" />;
}
