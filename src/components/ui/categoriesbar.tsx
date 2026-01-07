'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Zap, Terminal, Cpu, Code } from "lucide-react";

import { Button } from "./button";

const categories = [
    { id: 1, name: 'CI/CD Pipeline', icon: Zap },
    { id: 2, name: 'Testing & QA', icon: Terminal },
    { id: 3, name: 'Infrastructure', icon: Cpu },
    { id: 4, name: 'Deployment', icon: Code },
];

export default function CategoriesBar() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
        >
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-none border-2 transition-all ${selectedCategory === null
                        ? 'bg-[#CEF431] text-[#0D1B2A] border-[#CEF431]'
                        : 'bg-transparent text-[#CEF431] border-[#CEF431]/30 hover:border-[#CEF431] hover:bg-[#CEF431]/10'
                        }`}
                >
                    All Topics
                </Button>
                {/* {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant="outline"
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`rounded-none border-2 transition-all ${selectedCategory === cat.name
                            ? 'bg-[#CEF431] text-[#0D1B2A] border-[#CEF431]'
                            : 'bg-transparent text-[#CEF431] border-[#CEF431]/30 hover:border-[#CEF431] hover:bg-[#CEF431]/10'
                            }`}
                    >
                        <cat.icon className="w-4 h-4 mr-2" />
                        {cat.name}
                    </Button>
                ))} */}
            </div>
        </motion.div>

    )
}
