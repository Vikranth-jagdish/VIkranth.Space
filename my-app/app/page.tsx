import DemoPortfolio from "@/components/demo";
import LinkedInBadge from "@/components/linkedin-badge";
import { EcgLine } from "@/components/motion/ecg-line";

export default function Home() {
  return (
    <main className="w-full h-screen relative">
      <div className="fixed inset-x-0 bottom-20 pointer-events-none opacity-50 z-0">
        <EcgLine className="w-full h-14" />
      </div>
      <DemoPortfolio />
      <LinkedInBadge />
    </main>
  );
}
