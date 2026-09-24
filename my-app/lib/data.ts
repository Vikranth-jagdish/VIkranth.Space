import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Data Exports
export const ROOT_CATEGORIES = [
    {
        id: "founder",
        artist: "CO-FOUNDER",
        album: "HEALTHPILOT STORY",
        category: "0 -> PMF",
        label: "15 PEOPLE",
        year: "->",
        image: "",
        action: "/founder"
    },
    {
        id: "projects",
        artist: "PROJECTS",
        album: "SELECT WORKS",
        category: "ENGINEERING",
        label: "4 PROJECTS",
        year: "->",
        image: "",
        action: "/projects"
    },
    {
        id: "experience",
        artist: "EXPERIENCE",
        album: "CAREER PATH",
        category: "PROFESSIONAL",
        label: "5 ROLES",
        year: "->",
        image: "",
        action: "/experience"
    },
    {
        id: "videos",
        artist: "VIDEOS",
        album: "VISUAL MEDIA",
        category: "CONTENT",
        label: "YOUTUBE",
        year: "->",
        image: "",
        action: "/videos"
    },
    {
        id: "labs",
        artist: "LABS",
        album: "EXPERIMENTS",
        category: "R&D",
        label: "EXPLORE",
        year: "->",
        image: "",
        action: "/labs"
    },
    {
        id: "stats",
        artist: "STATS",
        album: "LIVE METRICS",
        category: "DASHBOARD",
        label: "LIVE",
        year: "->",
        image: "",
        action: "/stats"
    },
    {
        id: "photos",
        artist: "PHOTOS",
        album: "GALLERY",
        category: "PHOTOGRAPHY",
        label: "PINTEREST",
        year: "->",
        image: "",
        action: "/photos"
    },
    {
        id: "blogs",
        artist: "BLOGS",
        album: "ARTICLES",
        category: "WRITING",
        label: "NEW",
        year: "->",
        image: "",
        action: "/blogs"
    }
];

export const PROJECTS_DATA_DETAILED = [
    {
        id: 1,
        artist: "HEALTHPILOT.AI",
        album: "AI-NATIVE PLATFORM",
        category: "NEXT.JS",
        label: "CO-FOUNDER",
        year: "2025",
        image: "",
        link: "https://healthpilot.ai",
        techLogos: [
            "https://cdn.worldvectorlogo.com/logos/next-js.svg",
            "https://cdn.worldvectorlogo.com/logos/typescript.svg",
            "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg",
            "https://cdn.worldvectorlogo.com/logos/supabase.svg"
        ],
        description: "An AI-native platform designed specifically for obesity physicians to monitor patient progress and personalize weight-loss journeys with surgical precision. It handles complex medical datasets, treatment protocols, and real-time biometric monitoring.\n\nAs co-founder and head of product & tech, I grew the team from 0 to 15, rebuilt the product until it hit product-market fit, and closed two large hospitals on the platform.\n\nKey achievements:\n- Orchestrated a medical-grade data pipeline for real-time patient tracking.\n- Integrated AI-driven analytics to predict treatment outcomes.\n- Built a high-security environment for healthcare data management using Clerk and Supabase."
    },
    {
        id: 2,
        artist: "AGENTIC GRAPH RAG",
        album: "ICMR DOCUMENTS",
        category: "AGENTIC AI",
        label: "R&D",
        year: "2024",
        image: "",
        techLogos: [
            "https://cdn.worldvectorlogo.com/logos/python-5.svg",
            "https://cdn.worldvectorlogo.com/logos/fastapi-1.svg",
            "https://cdn.worldvectorlogo.com/logos/neo4j.svg",
            "https://cdn.worldvectorlogo.com/logos/postgresql.svg",
            "https://cdn.worldvectorlogo.com/logos/openai-2.svg"
        ],
        description: "Medical Knowledge Graph RAG - Clinical Decision Support System. An advanced AI-powered clinical system that combines traditional RAG with knowledge graph capabilities to provide evidence-based differential diagnosis and treatment planning based on ICMR guidelines.\n\nSystem Capabilities:\n- Clinical Reasoning: A Pydantic AI-powered agent interface that cross-references both vector databases (PostgreSQL) and knowledge graphs (Neo4j) to generate structured differential diagnoses and treatment plans.\n- Medical Entity Extraction: Specialized pipeline that identifies 200+ conditions, 150+ medications, and 250+ clinical tests from unstructured medical text.\n- Knowledge Graph Construction: Built using Graphiti for temporal tracking, mapping the relationships between conditions and their evidence-based interventions.\n- Document Ingestion: Processes complex ICMR guidelines using semantic chunking to preserve clinical context."
    },
    {
        id: 3,
        artist: "CODECHEF CLONE",
        album: "WEBSITE CLONE",
        category: "REACT",
        label: "STUDY",
        year: "2024",
        image: "",
        techLogos: [
            "https://cdn.worldvectorlogo.com/logos/react-2.svg",
            "https://cdn.worldvectorlogo.com/logos/typescript.svg",
            "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg",
            "https://cdn.worldvectorlogo.com/logos/framer-motion.svg"
        ],
        description: "A high-fidelity clone of the Codechef competitive programming platform. This project serves as a deep dive into complex UI components and high-performance real-time data handling.\n\nFeatures:\n- Real-time Leaderboards: Synchronized competitive programming rankings.\n- Problem Editor: A sophisticated code editor environment for practice.\n- Responsive Architecture: Optimized for all devices to ensure a seamless coding experience."
    },
    {
        id: 4,
        artist: "VOICE AGENT",
        album: "LIVEKIT AI",
        category: "HEALTHCARE",
        label: "NEW",
        year: "2024",
        image: "",
        techLogos: [
            "https://cdn.worldvectorlogo.com/logos/python-5.svg",
            "https://cdn.worldvectorlogo.com/logos/openai-2.svg",
            "https://cdn.worldvectorlogo.com/logos/fastapi-1.svg",
            "https://cdn.worldvectorlogo.com/logos/livekit.svg"
        ],
        description: "A voice-activated AI agent built with LiveKit that interactively asks patients questions during website visits and securely relays answers to healthcare providers. It streamlines the intake process and optimizes physician time.\n\nKey Components:\n- Real-time Voice Streaming: Low-latency communication using LiveKit Cloud powered by WebRTC.\n- AI Patient Assessment: Natural language understanding using GPT-4 to handle complex symptom reporting.\n- Healthcare Provider Dashboard: Securely relayed data for immediate physician review."
    }
];

export const EXPERIENCE_DATA = [
    {
        id: 1,
        artist: "CO-FOUNDER · HEAD OF PRODUCT & TECH",
        album: "HEALTHPILOT.AI",
        category: "CO-FOUNDER",
        label: "CHENNAI",
        year: "2025-PRES",
        description: "Built the HealthPilot team from 0 to 15 people and led both product and engineering. Iterated and rebuilt the product several times until we found product-market fit, then closed two large hospitals on the platform. Owned the roadmap, architecture and hiring, and shipped an AI-native patient engagement platform built on FHIR and SNOMED standards.",
        image: "https://images.unsplash.com/photo-1576091160550-217359f4ebf4?q=80&w=2670&auto=format&fit=crop",
        link: "https://healthpilot.ai"
    },
    {
        id: 2,
        artist: "AI SOFTWARE DEV",
        album: "BOTCODE TECHNOLOGIES",
        category: "FULL-TIME",
        label: "ON-SITE",
        year: "2025-PRES",
        description: "Developing autonomous, agentic AI tools for advanced healthcare systems using FastAPI and DevOps practices.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
        link: "https://botcode.com"
    },
    {
        id: 3,
        artist: "VICE PRESIDENT",
        album: "DAO COMMUNITY VIT",
        category: "LEADERSHIP",
        label: "VITC",
        year: "2023-PRES",
        description: "Overseeing department operations and strategy as Vice President. Previously led Web Development and Content divisions, scaling the community's digital presence.",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2574&auto=format&fit=crop",
        link: "https://daocommunity.in"
    },
    {
        id: 4,
        artist: "STRATEGY LEAD",
        album: "V-NEST",
        category: "STARTUP INC",
        label: "VITC",
        year: "2025-PRES",
        description: "Leading Strategy and Brand Management for VIT Chennai's startup incubator, supporting early-stage ventures.",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2670&auto=format&fit=crop",
        link: "https://vnest.org"
    },
    {
        id: 5,
        artist: "AI DEVELOPER",
        album: "THINKROOT",
        category: "INTERNSHIP",
        label: "REMOTE",
        year: "2025",
        description: "Designed and built an agentic AI astrology engine for personalized predictions, integrating Telegram and WhatsApp APIs.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
        link: "https://thinkroot.in"
    }
];

export const VIDEOS_DATA = [
    {
        id: 1,
        artist: "FE!N",
        album: "VALORANT EDIT",
        category: "LOCAL",
        label: "4K",
        year: "2024",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
        videoSrc: "/videos/FE!N (VALORANT EDIT)_1 logo edning.mp4"
    }
];

export const LABS_DATA = [
    {
        id: "vtop-mcp",
        artist: "VTOP-MCP",
        album: "CHATGPT CONNECTOR",
        category: "MCP SERVER",
        label: "NOW IN CHATGPT",
        year: "2026",
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2564&auto=format&fit=crop",
        link: "/labs/vtop-mcp"
    },
    {
        id: 1,
        artist: "N8N",
        album: "AUTOMATION",
        category: "WORKFLOW",
        label: "SELF-HOSTED",
        year: "2024",
        image: "https://images.unsplash.com/photo-1518433278981-16773f84841d?q=80&w=2564&auto=format&fit=crop",
        link: "https://n8n.vikranth.space"
    },
    {
        id: 2,
        artist: "SUPABASE",
        album: "BACKEND",
        category: "DATABASE",
        label: "CLOUD",
        year: "2024",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
        link: "https://supabase.vikranth.space"
    }
];

export const STATS_DATA = [
    { id: 1, artist: "GITHUB", album: "COMMITS", category: "CODE", label: "ACTIVE", year: "STATS", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2688&auto=format&fit=crop" },
    { id: 2, artist: "MONKEYTYPE", album: "SPEED", category: "WPM", label: "FAST", year: "STATS", image: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop" },
    { id: 3, artist: "SPOTIFY", album: "TOP ARTISTS", category: "MUSIC", label: "VIBE", year: "STATS", image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop" }
];

export const FOUNDER_STATS = [
    { value: 15, prefix: "0→", suffix: "", label: "People hired", detail: "Built the HealthPilot team from nobody to fifteen across engineering, product and operations." },
    { value: 2, prefix: "", suffix: "", label: "Hospitals closed", detail: "Signed two large hospitals on the platform after finding product-market fit." },
    { value: null, text: "PMF", label: "Product-market fit", detail: "Built, shipped, scrapped and rebuilt until clinics kept coming back." },
    { value: null, text: "P+T", label: "Product & Tech", detail: "Headed product strategy and engineering: roadmap, architecture and delivery." }
];

export const FOUNDER_CHAPTERS = [
    {
        id: "zero",
        index: "01",
        title: "ZERO",
        kicker: "An idea and an empty repo",
        body: "HealthPilot started with a simple observation: patients drop out of care between visits, and clinics have no way to see it coming. No team, no product, no customers, just the problem."
    },
    {
        id: "team",
        index: "02",
        title: "TEAM",
        kicker: "0 → 15 people",
        body: "I hired and led the team from the first engineer to fifteen people across engineering, product and operations. I set up the hiring bar, the rituals and the engineering culture along the way."
    },
    {
        id: "iterate",
        index: "03",
        title: "ITERATE",
        kicker: "Build · ship · learn · rebuild",
        body: "We built the product, put it in front of real doctors and patients, and threw away what didn't work. Then we did it again, several times, with each version shaped by what we heard in the clinic."
    },
    {
        id: "pmf",
        index: "04",
        title: "PMF",
        kicker: "The signal",
        body: "Eventually it clicked: an AI-native patient engagement platform that clinics actually used every day to keep patients on track and cut dropouts."
    },
    {
        id: "scale",
        index: "05",
        title: "SCALE",
        kicker: "2 large hospitals",
        body: "With product-market fit in hand, we took HealthPilot to enterprise and closed two large hospitals on the system."
    }
];

export const FOUNDER_ROLE = [
    "Product strategy & roadmap",
    "System architecture (FHIR · SNOMED)",
    "Hiring & team building",
    "Customer discovery with doctors",
    "AI agents & clinical workflows",
    "Closing enterprise hospital deals"
];

export const GLOBAL_CONFIG = {
    timeZone: "Asia/Kolkata",
    timeUpdateInterval: 1000,
    idleDelay: 4000,
    debounceDelay: 100
};

export const GLOBAL_SOCIAL_LINKS = {
    linkedin: "https://www.linkedin.com/in/vikranth-jagdish-b37798126/",
    instagram: "https://www.instagram.com/vikranth_jagdish/",
    email: "mailto:vicky@botcode.com",
    x: "https://x.com/TurtlePlays343"
};

export const GLOBAL_LOCATION = {
    display: true
};
