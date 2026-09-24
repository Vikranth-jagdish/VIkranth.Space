"use client";
import React from 'react';
import MusicPortfolio from "@/components/ui/music-portfolio";
import { useRouter } from 'next/navigation';
import { FounderHero } from "@/components/motion/founder-hero";
import {
    ROOT_CATEGORIES,
    GLOBAL_CONFIG,
    GLOBAL_SOCIAL_LINKS,
    GLOBAL_LOCATION
} from '@/lib/data';

export default function DemoPortfolio() {
    const router = useRouter();

    const handleProjectClick = (item: any) => {
        if (item.action) {
            router.push(item.action);
        }
    };

    const callbacks = {
        onProjectHover: (project: any) => {
            // Optional: Change shader params on hover?
        },
        onProjectClick: (project: any) => handleProjectClick(project)
    };

    return (
        <MusicPortfolio
            PROJECTS_DATA={ROOT_CATEGORIES}
            CONFIG={GLOBAL_CONFIG}
            SOCIAL_LINKS={GLOBAL_SOCIAL_LINKS}
            LOCATION={GLOBAL_LOCATION}
            CALLBACKS={callbacks}
            hideHoverBackground={true}
            header={<FounderHero />}
        />
    );
}
