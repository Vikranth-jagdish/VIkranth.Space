import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Co-founder Story | Vikranth Jagdish",
  description:
    "Building HealthPilot.ai: from zero to a team of 15, through several product rebuilds to product-market fit, and on to two large hospitals.",
  openGraph: {
    title: "Co-founder Story | Vikranth Jagdish",
    description:
      "Building HealthPilot.ai: from zero to a team of 15, through several product rebuilds to product-market fit, and on to two large hospitals.",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
