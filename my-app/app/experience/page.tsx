"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Briefcase, Calendar, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { EXPERIENCE_DATA } from '@/lib/data';
import { playHoverSound, playClickSound } from '@/lib/sound-utils';

// Custom Scramble Hook for clean usage
const useScramble = (text: string, isActive: boolean) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    useEffect(() => {
        if (!isActive) {
            setDisplayText(text);
            return;
        }

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                text.split("").map((char, index) => {
                    if (index < iteration / 2) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iteration >= text.length * 2) clearInterval(interval);
            iteration++;
        }, 30);

        return () => clearInterval(interval);
    }, [isActive, text]);

    return displayText;
};


const ExperienceCard = ({ item, index }: { item: any; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const scrambledTitle = useScramble(item.artist, isHovered);
    const scrambledCompany = useScramble(item.album, isHovered);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => {
                setIsHovered(true);
                playHoverSound();
            }}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative pl-8 pb-12 border-l border-white/10 last:pb-0"
        >
            {/* Timeline Dot */}
            <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-gray-800 border border-white/20 group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-all duration-300 group-hover:scale-150" />

            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                        <h3 className="text-xl font-bold tracking-tighter text-white group-hover:text-[var(--color-accent)] transition-colors font-mono">
                            {scrambledTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-[var(--color-accent)] font-mono text-xs uppercase tracking-widest mt-1">
                            <Briefcase size={12} />
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-1 group/link"
                            >
                                {scrambledCompany}
                                <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                            <span className="text-gray-600 px-2">|</span>
                            <span>{item.category}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-1">
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-tighter bg-white/5 px-2 py-1 rounded border border-white/10 font-mono">
                            <Calendar size={10} />
                            {item.year}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-tighter font-mono">
                            <MapPin size={10} />
                            {item.label}
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden group/content">
                    <p className="text-sm text-gray-400 leading-relaxed font-mono max-w-2xl group-hover:text-gray-300 transition-colors">
                        {item.description}
                    </p>

                    {/* Animated underline */}
                    <div className="absolute bottom-[-10px] left-0 w-0 h-[1px] bg-[var(--color-accent)]/30 group-hover:w-full transition-all duration-700" />
                </div>

                {/* Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-accent)]/0 to-[var(--color-accent)]/0 group-hover:from-[var(--color-accent)]/5 rounded-2xl -z-10 transition-all duration-500 opacity-0 group-hover:opacity-100" />
            </div>
        </motion.div>
    );
};

export default function ExperiencePage() {
    return (
        <div className="min-h-screen w-full font-mono selection:bg-[var(--color-accent)] selection:text-black relative">
            {/* Navigation */}
            <nav className="fixed top-4 left-4 right-4 z-50 mix-blend-difference flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity uppercase"
                    onClick={() => playClickSound()}
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <div className="text-[10px] text-gray-500 uppercase tracking-widest hidden md:block">
                    Professional Experience / Digital Resume
                </div>
            </nav>

            <main className="container mx-auto px-4 py-32 max-w-4xl">
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-3 py-1 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded text-[var(--color-accent)] text-[10px] uppercase tracking-widest font-bold mb-4"
                    >
                        Career Journey
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase"
                    >
                        Experience<span className="text-[var(--color-accent)]">.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-xl text-sm leading-relaxed"
                    >
                        Co-founder of HealthPilot.ai, where I head product and tech. Before that I worked across software engineering, AI development and leadership roles in the tech ecosystem.
                    </motion.p>
                </header>

                <div className="space-y-4">
                    {EXPERIENCE_DATA.map((item: any, index: number) => (
                        <ExperienceCard key={item.id} item={item} index={index} />
                    ))}
                </div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 pt-12 border-t border-white/5 text-center"
                >
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Want the full picture?</p>
                    <a
                        href="https://www.linkedin.com/in/vikranth-jagdish-b37798126/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white text-xs uppercase tracking-widest hover:bg-[var(--color-accent)] hover:text-black hover:border-[var(--color-accent)] transition-all duration-500 font-bold group"
                        onClick={() => playClickSound()}
                    >
                        Download Full Resume
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </main>

            {/* Subtle background elements */}
            <div className="fixed inset-0 pointer-events-none -z-20 opacity-20">
                <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[var(--color-accent)]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]" />
            </div>
        </div>
    );
}
