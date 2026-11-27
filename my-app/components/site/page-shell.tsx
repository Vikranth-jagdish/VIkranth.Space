import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SoundToggle } from "@/components/site/sound-layer";

type Props = {
    title: string;
    kicker?: string;
    lede?: string;
    back?: { href: string; label: string };
    wide?: boolean;
    children: React.ReactNode;
};

/** The white sheet on a grey wall that every inner page sits on. */
export function PageShell({ title, kicker, lede, back = { href: "/", label: "Home" }, wide, children }: Props) {
    return (
        <div className="min-h-dvh px-4 pb-16 md:px-8">
            <header className={`mx-auto flex items-center justify-between py-5 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
                <Link href={back.href} className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
                    <ArrowLeft size={15} /> {back.label}
                </Link>
                <SoundToggle />
            </header>
            <main className={`sheet mx-auto px-6 py-10 md:px-14 md:py-16 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
                {kicker && <p className="label mb-4">{kicker}</p>}
                <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-none">{title}</h1>
                {lede && <p className="mt-5 max-w-xl text-[var(--ink-soft)] leading-relaxed">{lede}</p>}
                <div className="mt-12">{children}</div>
            </main>
        </div>
    );
}
