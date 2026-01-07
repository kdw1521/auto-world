"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LikeButton from "@/components/posts/like-button";

type FeedPost = {
  id: number;
  title: string | null;
  content_text: string | null;
  created_at: string | null;
  author_username: string | null;
  views: number | null;
  likes: number | null;
};

type FeedClientProps = {
  posts: FeedPost[];
  likedPostIds: number[];
};

type SortKey = "latest" | "popular" | "views";

const sortOptions: { id: SortKey; name: string }[] = [
  { id: "latest", name: "최신순" },
  { id: "popular", name: "인기순" },
  { id: "views", name: "조회순" },
];

function formatDate(value: string | null) {
  if (!value) return "";
  const date = dayjs(value);
  if (!date.isValid()) return "";
  return date.format("YYYY.MM.DD");
}

function estimateReadTime(text?: string | null) {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

function getExcerpt(value: string | null, maxLength = 140) {
  if (!value) return "내용이 없습니다.";
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength)}...`;
}

export default function FeedClient({ posts, likedPostIds }: FeedClientProps) {
  const [selectedSort, setSelectedSort] = useState<SortKey>("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const likedIds = useMemo(() => new Set(likedPostIds), [likedPostIds]);

  const filteredPosts = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    const result = posts.filter((post) => {
      if (!normalized) return true;
      const title = post.title?.toLowerCase() ?? "";
      const content = post.content_text?.toLowerCase() ?? "";
      return title.includes(normalized) || content.includes(normalized);
    });

    return result.sort((a, b) => {
      if (selectedSort === "views") {
        return (b.views ?? 0) - (a.views ?? 0);
      }
      if (selectedSort === "popular") {
        return (b.likes ?? 0) - (a.likes ?? 0);
      }
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });
  }, [posts, searchQuery, selectedSort]);

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-[#CEF431] mb-3">
                  정렬
                </h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedSort(option.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all border rounded-none ${
                        selectedSort === option.id
                          ? "bg-[#CEF431]/10 border-[#CEF431]/50 text-[#CEF431]"
                          : "bg-[#161514]/30 border-[#EAF4F4]/10 text-[#EAF4F4]/70 hover:border-[#CEF431]/30"
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#CEF431]/60"
                  strokeWidth={1.5}
                />
                <Input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#161514]/30 border border-[#CEF431]/20 text-[#EAF4F4] placeholder:text-[#EAF4F4]/40 rounded-none focus:border-[#CEF431]/50"
                />
              </div>
            </motion.div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <Card className="p-6 bg-[#161514]/30 border border-[#EAF4F4]/10 rounded-none">
                  <p className="text-sm text-[#EAF4F4]/60">
                    일치하는 게시글이 없습니다.
                  </p>
                </Card>
              ) : (
                filteredPosts.map((post, index) => {
                  const authorName = post.author_username ?? "익명";
                  const initial =
                    authorName.trim().charAt(0).toUpperCase() || "A";
                  const viewCount = Number.isFinite(post.views ?? 0)
                    ? Number(post.views ?? 0)
                    : 0;
                  const likeCount = Number.isFinite(post.likes ?? 0)
                    ? Number(post.likes ?? 0)
                    : 0;
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 bg-[#161514]/30 border border-[#EAF4F4]/10 hover:border-[#CEF431]/40 transition-all rounded-none group">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-transparent border border-[#CEF431]/30 text-[#CEF431] rounded-none text-[10px] font-normal">
                                피드
                              </Badge>
                              <span className="text-xs text-[#EAF4F4]/40">
                                ·
                              </span>
                              <span className="text-xs text-[#EAF4F4]/40">
                                {formatDate(post.created_at)}
                              </span>
                            </div>

                            <Link
                              href={`/posts/${post.id}`}
                              className="text-lg font-normal text-[#CEF431] mb-2 group-hover:text-[#03D26F] transition-colors leading-snug block"
                            >
                              {post.title ?? "제목 없음"}
                            </Link>

                            <p className="text-sm text-[#EAF4F4]/60 leading-relaxed mb-3">
                              {getExcerpt(post.content_text)}
                            </p>
                          </div>
                        </div>

                        {/* Post Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#EAF4F4]/10">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 bg-[#CEF431]/10 border border-[#CEF431]/30 flex items-center justify-center text-[10px] text-[#CEF431]">
                                {initial}
                              </div>
                              <span className="text-xs text-[#EAF4F4]/60">
                                {authorName}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-[#EAF4F4]/60">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                              {viewCount}
                            </div>
                            <LikeButton
                              postId={post.id}
                              initialLiked={likedIds.has(post.id)}
                              initialCount={likeCount}
                              className="text-[#EAF4F4]/60 hover:text-[#CEF431]"
                            />
                            <div className="flex items-center gap-1">
                              <MessageSquare
                                className="w-3.5 h-3.5"
                                strokeWidth={1.5}
                              />
                              0
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                              {estimateReadTime(post.content_text)}
                            </div>
                            <Link
                              href={`/posts/${post.id}`}
                              className="flex items-center gap-1 text-[#CEF431] hover:text-[#03D26F]"
                            >
                              <span>보기</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button
                type="button"
                className="bg-transparent border border-[#CEF431]/30 text-[#CEF431] hover:bg-[#CEF431]/10 hover:border-[#CEF431] rounded-none px-8 py-3"
              >
                더 보기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
