"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Pin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type NoticeDetailClientProps = {
  title: string;
  content: string;
  createdAt: string | null;
  isPinned: boolean;
};

function formatDate(value: string | null) {
  if (!value) return "";
  const date = dayjs(value);
  if (!date.isValid()) return "";
  return date.format("YYYY.MM.DD");
}

export default function NoticeDetailClient({
  title,
  content,
  createdAt,
  isPinned,
}: NoticeDetailClientProps) {
  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge className="rounded-none border border-[#E3EF26]/30 bg-[#E3EF26]/20 text-[#E3EF26]">
              공지사항
            </Badge>
            {isPinned ? (
              <Badge className="rounded-none bg-[#E3EF26] text-[#0D1B2A] border-0">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            ) : null}
          </div>
          <h1 className="text-4xl font-bold text-[#E3EF26] mb-4 leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[#E3EF26]/60">
            <Calendar className="w-4 h-4" />
            {formatDate(createdAt)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 bg-[#1B3A4B]/30 border-2 border-[#E3EF26]/20 rounded-none">
            <div className="text-sm text-[#E3EF26]/80 whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
          </Card>
        </motion.div>

        <div className="mt-10">
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-sm text-[#E3EF26] hover:text-[#E3EF26]/80"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>
        </div>
      </main>
    </div>
  );
}
