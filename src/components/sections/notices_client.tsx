"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { Megaphone, Search, Bell, ChevronRight, Pin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type NoticeItem = {
  id: number;
  title: string;
  content: string | null;
  created_at: string | null;
  is_pinned: boolean | null;
};

type NoticesClientProps = {
  notices: NoticeItem[];
};

function formatDate(value: string | null) {
  if (!value) return "";
  const date = dayjs(value);
  if (!date.isValid()) return "";
  return date.format("YYYY.MM.DD");
}

function getExcerpt(value: string | null, maxLength = 140) {
  if (!value) return "내용이 없습니다.";
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength)}...`;
}

type CategoryKey = "all" | "pinned";

export default function NoticesClient({ notices }: NoticesClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const counts = useMemo(() => {
    const pinnedCount = notices.filter((notice) => notice.is_pinned).length;
    return {
      all: notices.length,
      pinned: pinnedCount,
    };
  }, [notices]);

  const filteredNotices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return notices.filter((notice) => {
      if (activeCategory === "pinned" && !notice.is_pinned) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      const title = notice.title?.toLowerCase() ?? "";
      const content = notice.content?.toLowerCase() ?? "";
      return title.includes(normalized) || content.includes(normalized);
    });
  }, [activeCategory, notices, query]);

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-8 h-8 text-[#E3EF26]" />
            <h1 className="text-4xl font-bold text-[#E3EF26]">
              공지사항
            </h1>
          </div>
          <p className="text-[#E3EF26]/70 text-lg">
            업데이트 소식부터 보안 공지까지, Auto World의 필수 정보를 확인하세요.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E3EF26]/60" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search announcements..."
              className="pl-14 h-16 rounded-none border-2 border-[#E3EF26]/30 bg-[#1B3A4B]/50 text-[#E3EF26] placeholder:text-[#E3EF26]/40 focus:border-[#E3EF26] focus:ring-2 focus:ring-[#E3EF26]/20"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-[#1B3A4B]/30 border-2 border-[#E3EF26]/20 rounded-none">
                <h3 className="text-sm font-bold text-[#E3EF26] mb-4">카테고리</h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className={`w-full text-left px-4 py-3 border transition-colors text-sm ${activeCategory === "all"
                      ? "bg-[#E3EF26]/20 border-[#E3EF26]/40 text-[#E3EF26]"
                      : "bg-[#0D1B2A]/50 border-[#E3EF26]/10 text-[#E3EF26]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>All</span>
                      <span className="text-xs text-[#E3EF26]/60">{counts.all}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory("pinned")}
                    className={`w-full text-left px-4 py-3 border transition-colors text-sm ${activeCategory === "pinned"
                      ? "bg-[#E3EF26]/20 border-[#E3EF26]/40 text-[#E3EF26]"
                      : "bg-[#0D1B2A]/50 border-[#E3EF26]/10 text-[#E3EF26]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Pinned</span>
                      <span className="text-xs text-[#E3EF26]/60">{counts.pinned}</span>
                    </div>
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Subscribe => 이후 추가!?*/}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-[#E3EF26]/10 to-[#E3EF26]/5 border-2 border-[#E3EF26]/30 rounded-none">
                <Bell className="w-10 h-10 text-[#E3EF26] mb-4" />
                <h3 className="text-lg text-[#E3EF26] mb-2">구독 신청</h3>
                <p className="text-sm text-[#E3EF26]/70 mb-4">
                  {`서비스 이용에 필요한 핵심 변경 사항과 주요 소식을 정기적으로 전해드립니다 :)`}
                </p>
                <Button className="w-full bg-[#E3EF26] text-[#0D1B2A] hover:bg-[#E3EF26]/90 rounded-none">
                  구독
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Announcements List */}
          <div className="lg:col-span-3 space-y-6">
            {filteredNotices.length === 0 ? (
              <Card className="p-8 bg-[#1B3A4B]/30 border-2 border-[#E3EF26]/20 rounded-none">
                <p className="text-sm text-[#E3EF26]/70">
                  일치하는 공지사항이 없습니다.
                </p>
              </Card>
            ) : (
              filteredNotices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card
                    className={`p-8 bg-[#1B3A4B]/30 border-2 transition-all duration-300 rounded-none hover:border-[#E3EF26] ${notice.is_pinned ? "border-[#E3EF26]/50" : "border-[#E3EF26]/20"
                      }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        {notice.is_pinned && (
                          <Badge className="bg-[#E3EF26] text-[#0D1B2A] border-0 rounded-none">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        <Badge className="border rounded-none bg-[#E3EF26]/20 text-[#E3EF26] border-[#E3EF26]/30">
                          공지사항
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#E3EF26]/60">
                        <Calendar className="w-3 h-3" />
                        {formatDate(notice.created_at)}
                      </div>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/notices/${notice.id}`}
                      className="text-2xl text-[#E3EF26] mb-4 hover:text-[#E3EF26]/80 cursor-pointer transition-colors block"
                    >
                      {notice.title}
                    </Link>

                    {/* Content */}
                    <div className="text-sm text-[#E3EF26]/70 mb-6 leading-relaxed whitespace-pre-line">
                      {getExcerpt(notice.content)}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#E3EF26]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-[#E3EF26]/20 to-[#E3EF26]/10 border border-[#E3EF26]/30 flex items-center justify-center">
                          <span className="text-xs text-[#E3EF26]">AW</span>
                        </div>
                        <div>
                          <p className="text-sm text-[#E3EF26]">AutoWorld</p>
                          <p className="text-xs text-[#E3EF26]/60">Admin</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#E3EF26]/60">
                        <span>공지사항</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
