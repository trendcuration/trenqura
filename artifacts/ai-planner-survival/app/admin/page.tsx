import type { Metadata } from "next";

import { AdminApp } from "../../src/components/admin-app";

export const metadata: Metadata = {
  title: "편집실",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
