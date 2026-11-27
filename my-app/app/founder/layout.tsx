import type { Metadata } from "next";

const description =
  "Building HealthPilot: from an empty repo, through several product rebuilds with doctors, to product-market fit and into hospitals.";

export const metadata: Metadata = {
  title: "Co-founder Story | Vikranth Jagdish",
  description,
  openGraph: {
    title: "Co-founder Story | Vikranth Jagdish",
    description,
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
