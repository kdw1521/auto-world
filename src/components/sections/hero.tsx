'use client';

import { motion } from "motion/react";

const sparkPositions = [
    { top: 12, left: 18 },
    { top: 28, left: 43 },
    { top: 35, left: 72 },
    { top: 8, left: 55 },
    { top: 48, left: 22 },
    { top: 62, left: 67 },
    { top: 74, left: 30 },
    { top: 86, left: 82 },
];

const arcPaths = [
    "M 0 10 L 5 6 L 10 10 L 15 10",
    "M 0 10 L 5 8.5 L 10 11 L 15 10",
    "M 0 10 L 5 11.5 L 10 9 L 15 10",
    "M 0 10 L 5 13 L 10 11 L 15 10",
];

export default function HeroSection() {
    return (
        <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Hero Introduction Section - Refined & Minimal */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-20 max-w-6xl relative"
            >
                <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                        {/* Main Title with Neon Effect */}
                        <h2 className="text-3xl md:text-5xl font-normal text-[#EAF4F4] mb-2 leading-relaxed tracking-tight">
                            자동화에 미친자들의
                        </h2>

                        {/* 25시 Auto World - Neon Sign */}
                        <div className="relative inline-block mb-6">
                            <motion.h2
                                className="text-4xl md:text-6xl font-bold text-[#CEF431] leading-tight tracking-tight relative z-10"
                                style={{
                                    textShadow: `
                      0 0 5px #CEF431,
                      0 0 10px #CEF431
                    `
                                }}
                                animate={{
                                    opacity: [1, 0.95, 1, 0.9, 1, 1, 0.85, 1],
                                }}
                                transition={{
                                    duration: 0.15,
                                    times: [0, 0.1, 0.2, 0.25, 0.3, 0.7, 0.75, 1],
                                    repeat: Infinity,
                                    repeatDelay: 3 + Math.random() * 2
                                }}
                            >
                                25시 Auto World
                            </motion.h2>

                            {/* Electric Sparks - More Chaotic */}
                            {sparkPositions.map((pos, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-0.5 h-0.5 bg-[#CEF431] rounded-full"
                                    style={{
                                        top: `${pos.top}%`,
                                        left: `${pos.left}%`,
                                        boxShadow: "0 0 8px #CEF431, 0 0 12px #CEF431",
                                    }}
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        scale: [0, 2, 1.5, 0],
                                        x: [0, 6, -4, 0],
                                        y: [0, -5, 4, 0],
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        repeat: Infinity,
                                        delay: 0.1 * i,
                                        repeatDelay: 2 + 0.2 * i,
                                    }}
                                />
                            ))}

                            {/* Electric Arcs */}
                            {arcPaths.map((path, i) => (
                                <motion.div
                                    key={`arc-${i}`}
                                    className="absolute"
                                    style={{
                                        top: `${20 + i * 20}%`,
                                        right: `-${15 + i * 3}px`,
                                    }}
                                    animate={{
                                        opacity: [0, 0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 0.1,
                                        repeat: Infinity,
                                        delay: i * 0.05 + Math.random() * 2,
                                        repeatDelay: 3 + Math.random() * 3
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20">
                                        <path
                                            d={path}
                                            stroke="#CEF431"
                                            strokeWidth="1"
                                            fill="none"
                                            filter="url(#glow)"
                                        />
                                        <defs>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>
                                    </svg>
                                </motion.div>
                            ))}
                        </div>

                        {/* Description */}
                        <p className="text-lg text-[#EAF4F4]/75 mb-10 max-w-xl font-light">
                            '영감은 내가, 반복은 기계가.' 자동화에 미친자들의 놀이터입니다<br />
                            단 1분의 귀찮음을 참지 못해 10시간을 설계하는, 우리들의 고귀한 25시.
                        </p>

                        {/* Key Values - Minimal */}
                        <div className="flex gap-8 items-center border-l border-[#CEF431]/20 pl-5">
                            {[
                                { label: '누구나 환영', icon: '◆' },
                                { label: '경험 공유', icon: '◆' },
                                { label: '진입 장벽 X', icon: '◆' },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                                    className="flex items-center gap-2 group"
                                >
                                    <span className="text-[#CEF431]/60 text-base group-hover:text-[#03D26F] transition-colors">
                                        {item.icon}
                                    </span>
                                    <span className="text-md text-[#EAF4F4]/60 font-light group-hover:text-[#EAF4F4]/80 transition-colors">
                                        {item.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Neon Sign Board - Right Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="hidden md:block"
                    >
                        <div className="relative">
                            {/* Neon Box */}
                            <motion.div
                                className="relative px-6 py-8 border-4 border-[#CEF431] bg-[#014651]/50"
                                style={{
                                    boxShadow: `
                      0 0 10px #CEF431,
                      0 0 20px #CEF431,
                      0 0 30px #03D26F,
                      inset 0 0 20px rgba(206, 244, 49, 0.1)
                    `
                                }}
                                animate={{
                                    boxShadow: [
                                        `0 0 10px #CEF431, 0 0 20px #CEF431, 0 0 30px #03D26F, inset 0 0 20px rgba(206, 244, 49, 0.1)`,
                                        `0 0 15px #CEF431, 0 0 25px #CEF431, 0 0 40px #03D26F, inset 0 0 30px rgba(206, 244, 49, 0.15)`,
                                        `0 0 10px #CEF431, 0 0 20px #CEF431, 0 0 30px #03D26F, inset 0 0 20px rgba(206, 244, 49, 0.1)`,
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {/* OPEN Sign */}
                                <motion.div
                                    className="text-center mb-3"
                                    animate={{
                                        opacity: [1, 0.7, 1]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div
                                        className="text-2xl font-bold text-[#CEF431] tracking-wider"
                                        style={{
                                            textShadow: `
                          0 0 5px #CEF431,
                          0 0 10px #CEF431,
                          0 0 15px #03D26F
                        `
                                        }}
                                    >
                                        OPEN
                                    </div>
                                </motion.div>

                                {/* 25/7 */}
                                <div className="text-center">
                                    <div
                                        className="text-4xl font-bold text-[#03D26F] font-mono"
                                        style={{
                                            textShadow: `
                          0 0 5px #03D26F,
                          0 0 10px #03D26F,
                          0 0 20px #03D26F
                        `
                                        }}
                                    >
                                        25/7
                                    </div>
                                    <div className="text-xs text-[#CEF431]/70 mt-1 tracking-widest">
                                        ALWAYS ON
                                    </div>
                                </div>

                                {/* Corner Bolts */}
                                {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
                                    <div
                                        key={i}
                                        className={`absolute ${pos} w-2 h-2 bg-[#EAF4F4] rounded-full`}
                                        style={{
                                            boxShadow: '0 0 5px #EAF4F4'
                                        }}
                                    />
                                ))}
                            </motion.div>

                            {/* Power Cable */}
                            <div className="absolute -bottom-8 right-4 w-1 h-8 bg-[#EAF4F4]/30" />
                            <div className="absolute -bottom-8 right-4 w-3 h-3 bg-[#EAF4F4]/50 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </main>
    );
}
