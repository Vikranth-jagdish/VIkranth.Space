import DemoPortfolio from "@/components/demo";
import LinkedInBadge from "@/components/linkedin-badge";
import { ElectricGaze } from "@/components/motion/electric-gaze";

export default function Home() {
  return (
    <main className="w-full h-screen relative">
      <div className="fixed right-0 top-1/2 -translate-y-1/2 w-[min(58vw,820px)] aspect-square pointer-events-none z-0 opacity-45 [mask-image:radial-gradient(circle_at_center,black_45%,transparent_72%)]">
        <ElectricGaze className="w-full h-full" />
      </div>
      <DemoPortfolio />
      <LinkedInBadge />
    </main>
  );
}
