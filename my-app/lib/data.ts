import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const PROFILE = {
    name: "Vikranth Jagdish",
    role: "Co-founder, HealthPilot",
    location: "Chennai",
    timeZone: "Asia/Kolkata",
    intro: [
        "I co-founded HealthPilot, where I lead product and engineering. We build software that helps clinics stay close to their patients between visits.",
        "I like taking a rough idea all the way to something people use every day: sitting with doctors, deciding what to build, and writing a good share of the code myself.",
        "Away from work I play piano, cut video edits and take photos."
    ]
};

export const PROJECTS = [
    {
        id: "healthpilot",
        title: "HealthPilot",
        kind: "Patient engagement platform",
        year: "2025",
        stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
        link: "https://healthpilot.ai",
        description: "A platform for obesity clinics to follow each patient's progress between visits and adjust their weight-loss plan. It brings treatment protocols, clinical records and day-to-day tracking into one place. I co-founded the company and lead product and engineering."
    },
    {
        id: "guideline-search",
        title: "Clinical guideline search",
        kind: "Decision support",
        year: "2024",
        stack: ["Python", "FastAPI", "Neo4j", "PostgreSQL"],
        link: "/blogs/agentic-graph-rag",
        description: "A decision-support tool that answers clinical questions from ICMR guidelines. It pairs document search with a knowledge graph of conditions, medicines and tests, so every suggestion points back to the guideline it came from."
    },
    {
        id: "voice-intake",
        title: "Voice intake assistant",
        kind: "Healthcare, LiveKit",
        year: "2024",
        stack: ["Python", "FastAPI", "LiveKit"],
        link: "/blogs/livekit-voice",
        description: "A voice assistant that asks patients intake questions on a clinic's website and passes the answers to their doctor before the visit. Built on LiveKit for low-latency audio."
    },
    {
        id: "codechef-clone",
        title: "CodeChef clone",
        kind: "Front-end study",
        year: "2024",
        stack: ["React", "TypeScript", "Tailwind", "Framer Motion"],
        link: "",
        description: "A close rebuild of the CodeChef competitive programming site, made to practise complex interface work: live leaderboards, a problem editor and a layout that holds up on every screen size."
    }
];

export const EXPERIENCE = [
    {
        id: "healthpilot",
        title: "Co-founder, Head of Product & Tech",
        company: "HealthPilot",
        kind: "Co-founder",
        place: "Chennai",
        years: "2025 – now",
        link: "https://healthpilot.ai",
        description: "Lead product and engineering. Built the team, shaped the product with doctors through several rebuilds, and brought it into hospitals. I own the roadmap, the architecture and hiring. The platform is built on FHIR and SNOMED standards."
    },
    {
        id: "botcode",
        title: "Software Developer",
        company: "Botcode Technologies",
        kind: "Full-time",
        place: "On-site",
        years: "2025 – now",
        link: "https://botcode.com",
        description: "Build backend tools for healthcare systems with FastAPI, and look after how they are deployed and run."
    },
    {
        id: "dao",
        title: "Vice President",
        company: "DAO Community VIT",
        kind: "Leadership",
        place: "VIT Chennai",
        years: "2023 – now",
        link: "https://daocommunity.in",
        description: "Run the community's operations and strategy. Earlier I led its web development and content teams and grew its presence online."
    },
    {
        id: "vnest",
        title: "Strategy Lead",
        company: "V-NEST",
        kind: "Startup incubator",
        place: "VIT Chennai",
        years: "2025 – now",
        link: "https://vnest.org",
        description: "Lead strategy and brand for VIT Chennai's startup incubator, working with early-stage student ventures."
    },
    {
        id: "thinkroot",
        title: "Developer",
        company: "ThinkRoot",
        kind: "Internship",
        place: "Remote",
        years: "2025",
        link: "https://thinkroot.in",
        description: "Designed and built an astrology prediction engine with Telegram and WhatsApp integrations."
    }
];

export type VideoItem = {
    id: string;
    title: string;
    note: string;
    kind: "Piano" | "Edit";
    youtube?: string;
    src?: string;
    wide?: boolean;
};

export const VIDEOS: VideoItem[] = [
    { id: "interstellar", title: "Interstellar", note: "Hans Zimmer", kind: "Piano", youtube: "XyiqNG1PJUg" },
    { id: "golden-brown", title: "Golden Brown x Love Story", note: "Mashup", kind: "Piano", youtube: "Ke3Reo7UaFA" },
    { id: "drowning-love", title: "Drowning Love", note: "Chasing Kou", kind: "Piano", youtube: "pV5mWhzP7ko" },
    { id: "interstellar-experience", title: "Interstellar experience", note: "Hans Zimmer", kind: "Piano", youtube: "FnqCrOnE_vU" },
    { id: "interstellar-2", title: "Interstellar, another take", note: "Hans Zimmer", kind: "Piano", youtube: "Iq_SBReu9H0" },
    { id: "drowning-love-2", title: "Drowning Love, overhead take", note: "Chasing Kou", kind: "Piano", youtube: "rluvRskglkI" },
    { id: "fein", title: "FE!N", note: "Valorant edit", kind: "Edit", src: "/videos/FE!N (VALORANT EDIT)_1 logo edning.mp4", wide: true }
];

export const LABS = [
    {
        id: "vtop-mcp",
        title: "vtop-mcp",
        kind: "MCP server, npm package",
        year: "2026",
        link: "/labs/vtop-mcp",
        description: "Lets VIT Chennai students check attendance, marks and timetables from ChatGPT, Claude, Cursor or VS Code."
    },
    {
        id: "n8n",
        title: "n8n",
        kind: "Self-hosted automation",
        year: "2024",
        link: "https://n8n.vikranth.space",
        description: "My own workflow automation server, used for small jobs that should run without me."
    },
    {
        id: "supabase",
        title: "Supabase",
        kind: "Self-hosted backend",
        year: "2024",
        link: "https://supabase.vikranth.space",
        description: "A self-hosted database and auth stack that backs my side projects."
    }
];

export const BLOGS = [
    {
        slug: "shipping-an-npm-package",
        title: "Shipping a Tiny Tool Was Harder Than Building It",
        preview: "A plain-words story of publishing an npm package. What a tarball is, why Windows physically could not ship it, and the bug that had nothing to do with the code.",
        date: "2026-05-19"
    },
    {
        slug: "livekit-voice",
        title: "Building Real-time Voice Applications with LiveKit",
        preview: "From telehealth to online education: how LiveKit makes real-time voice practical to build and run.",
        date: "2025-03-10"
    },
    {
        slug: "how-ai-actually-works",
        title: "How AI Actually Works: Why It Has No Memory",
        preview: "An interactive look at why language models remember nothing between messages, and how passing context creates the feeling of memory.",
        date: "2025-02-28"
    },
    {
        slug: "agentic-graph-rag",
        title: "Agentic Graph RAG: The Future of Knowledge Retrieval",
        preview: "What happens when graph-based knowledge meets a system that can plan its own searches. A walk through the architecture.",
        date: "2025-01-15"
    }
];

export const FOUNDER_CHAPTERS = [
    {
        id: "zero",
        title: "Zero",
        kicker: "An idea and an empty repo",
        body: "HealthPilot started with a simple observation: patients drop out of care between visits, and clinics have no way to see it coming. No team, no product, no customers. Just the problem."
    },
    {
        id: "team",
        title: "Team",
        kicker: "Finding the people",
        body: "I hired and led the team from the first engineer onwards, across engineering, product and operations. Along the way I set the hiring bar, the rituals and the way we build."
    },
    {
        id: "iterate",
        title: "Iterate",
        kicker: "Build, ship, learn, rebuild",
        body: "We built the product, put it in front of real doctors and patients, and threw away what didn't work. Then we did it again, several times, with each version shaped by what we heard in the clinic."
    },
    {
        id: "fit",
        title: "Fit",
        kicker: "The signal",
        body: "Eventually it clicked: a patient engagement platform that clinics opened every day to keep patients on track and cut dropouts."
    },
    {
        id: "scale",
        title: "Scale",
        kicker: "Into hospitals",
        body: "With that in hand we took HealthPilot to larger customers and brought hospitals onto the system."
    }
];

export const FOUNDER_ROLE = [
    "Product strategy and roadmap",
    "System architecture (FHIR, SNOMED)",
    "Hiring and team building",
    "Customer discovery with doctors",
    "Clinical workflows and automation",
    "Closing hospital deals"
];

export const SOCIAL_LINKS = {
    linkedin: "https://www.linkedin.com/in/vikranth-jagdish-b37798126/",
    instagram: "https://www.instagram.com/vikranth_jagdish/",
    x: "https://x.com/TurtlePlays343",
    github: "https://github.com/Vikranth-jagdish",
    youtube: "https://www.youtube.com/@vikranthjagdish5803",
    email: "vicky@botcode.com"
};
