"use client"

import React, { useMemo } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Star, GitFork, Book, Trophy, Calendar } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function GithubStats() {
    const { data, error, isLoading } = useSWR('/api/github-stats', fetcher)

    const contributionData = useMemo(() => {
        if (!data) return null
        return data.contributionsCollection?.contributionCalendar ?? null
    }, [data])

    const stats = useMemo(() => {
        if (!contributionData) return { total: 0, longestStreak: 0 }

        let longest = 0
        let current = 0

        const allDays = contributionData.weeks.flatMap((w: any) => w.contributionDays)

        allDays.forEach((day: any) => {
            if (day.contributionCount > 0) {
                current++
                if (current > longest) longest = current
            } else {
                current = 0
            }
        })

        return {
            total: contributionData.totalContributions,
            longestStreak: longest
        }
    }, [contributionData])

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            <div className="h-32 bg-white/[0.03] rounded-xl border border-black/10" />
            <div className="h-32 bg-white/[0.03] rounded-xl border border-black/10" />
            <div className="h-32 bg-white/[0.03] rounded-xl border border-black/10" />
        </div>
    )

    if (error || !data || !contributionData) return (
        <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center text-red-500 font-mono text-sm">
            GitHub data is not available right now.
        </div>
    )

    const topRepos = data.repositories?.nodes?.slice(0, 6) || []

    return (
        <div className="space-y-8 font-mono">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-black/10 p-6 rounded-2xl  group hover:border-[var(--color-accent)]/50 transition-all duration-300 "
                >
                    <div className="flex items-center gap-3 text-neutral-500 mb-2">
                        <Trophy size={18} className="text-[var(--color-accent)]" />
                        <span className="text-xs uppercase tracking-widest">Contributions</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tighter text-neutral-900 group-hover:scale-105 transition-transform origin-left">
                        {stats.total.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-2 uppercase">Last 365 Days</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.03] border border-black/10 p-6 rounded-2xl  group hover:border-[var(--color-accent)]/50 transition-all duration-300 "
                >
                    <div className="flex items-center gap-3 text-neutral-500 mb-2">
                        <Star size={18} className="text-yellow-500" />
                        <span className="text-xs uppercase tracking-widest">Total Stars</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tighter text-neutral-900 group-hover:scale-105 transition-transform origin-left">
                        {data.repositories?.nodes?.reduce((acc: number, repo: any) => acc + repo.stargazerCount, 0) || 0}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-2 uppercase">Earned across repos</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/[0.03] border border-black/10 p-6 rounded-2xl  group hover:border-[var(--color-accent)]/50 transition-all duration-300 "
                >
                    <div className="flex items-center gap-3 text-neutral-500 mb-2">
                        <Calendar size={18} className="text-blue-500" />
                        <span className="text-xs uppercase tracking-widest">Longest Streak</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tighter text-neutral-900 group-hover:scale-105 transition-transform origin-left">
                        {stats.longestStreak}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-2 uppercase font-bold">Consecutive Days</div>
                </motion.div>
            </div>

            {/* Contribution Grid - Full Width */}
            <div className="bg-white/[0.03] border border-black/10 p-6 rounded-2xl  overflow-hidden ">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-neutral-800">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                        Activity Graph
                    </h3>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">365 Days of Code</span>
                </div>

                <div className="flex flex-col gap-1 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-1.5 min-w-max">
                        {contributionData?.weeks.map((week: any, wIndex: number) => (
                            <div key={wIndex} className="flex flex-col gap-1.5">
                                {week.contributionDays.map((day: any, dIndex: number) => (
                                    <motion.div
                                        key={day.date}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: (wIndex * 0.003) + (dIndex * 0.01),
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20
                                        }}
                                        className="w-3 h-3 rounded-[1px] transition-all duration-300 hover:scale-150 hover:z-10 cursor-help"
                                        style={{
                                            backgroundColor: day.contributionCount > 0 ? 'var(--color-accent)' : '#e9e9e6',
                                            opacity: day.contributionCount > 0 ? Math.min(0.2 + (day.contributionCount * 0.2), 1) : 1,
                                            boxShadow: day.contributionCount > 0 ? `0 0 10px var(--color-accent-transparent)` : 'none'
                                        }}
                                        title={`${day.contributionCount} contributions on ${day.date}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between mt-6 text-[10px] text-neutral-500 uppercase font-black tracking-widest px-1">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Legend</span>
                        <div className="flex gap-2 items-center ml-2">
                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#e9e9e6]" title="No contributions" />
                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[var(--color-accent)] opacity-30" />
                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[var(--color-accent)] opacity-60" />
                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[var(--color-accent)] opacity-100" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span>Less</span>
                        <span className="text-neutral-800">More</span>
                    </div>
                </div>
            </div>

            {/* Top Repos */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/10 pb-2 mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-neutral-800">
                        <Book size={18} className="text-[var(--color-accent)]" />
                        Featured Repositories
                    </h3>
                    <span className="text-[10px] text-neutral-500 lowercase font-normal italic pr-2">Sorted by stargazers</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topRepos.map((repo: any, index: number) => (
                        <motion.a
                            key={repo.name}
                            href={repo.url}
                            target="_blank"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className="group flex flex-col p-6 bg-white/[0.03] border border-black/10 rounded-2xl hover:border-[var(--color-accent)]/40 hover:bg-white/[0.04] transition-all duration-300 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                            </div>
                            <div className="font-bold text-base mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-1 pr-6">
                                {repo.name}
                            </div>
                            <div className="text-xs text-neutral-500 mb-6 line-clamp-2 h-10 leading-relaxed overflow-hidden">
                                {repo.description || "Experimental repository focusing on clean code and performance."}
                            </div>
                            <div className="mt-auto flex items-center justify-between text-[11px] text-neutral-500 pt-4 border-t border-black/10">
                                <div className="flex items-center gap-4 font-bold uppercase tracking-tighter">
                                    <span className="flex items-center gap-1.5"><Star size={12} className="text-yellow-500" /> {repo.stargazerCount}</span>
                                    <span className="flex items-center gap-1.5"><GitFork size={12} className="text-blue-400" /> {repo.forkCount}</span>
                                </div>
                                <div className="flex gap-2 shrink-0 overflow-hidden font-bold uppercase">
                                    {repo.languages.nodes.slice(0, 2).map((lang: any) => (
                                        <span key={lang.name} className="flex items-center gap-1.5 whitespace-nowrap">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                                            {lang.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </div>
    )
}
