'use client'
import { motion } from 'motion/react'
import { Search } from 'lucide-react'
import { Input } from './input'

export default function SearchBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#CEF431]/60" />
                <Input
                    placeholder="Search technical articles, guides, and solutions..."
                    className="pl-14 h-16 rounded-none border-2 border-[#CEF431]/30 bg-[#1B3A4B]/50 text-[#CEF431] placeholder:text-[#CEF431]/40 focus:border-[#CEF431] focus:ring-2 focus:ring-[#CEF431]/20"
                />
            </div>
        </motion.div>
    )
}