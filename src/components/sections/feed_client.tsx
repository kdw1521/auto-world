"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { ArrowUpRight, Clock, Eye, MessageSquare, Search } from "lucide-react";

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
  comments?: number | null;
};

type SortKey = "latest" | "popular" | "views";

type FeedClientProps = {
  posts: FeedPost[];
  likedPostIds: number[];
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  searchQuery: string;
  sort: SortKey;
};

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

function buildFeedHref({
  page,
  q,
  sort,
}: {
  page?: number;
  q?: string;
  sort?: SortKey;
}) {
  const params = new URLSearchParams();
  const trimmedQuery = q?.trim() ?? "";

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }
  if (sort && sort !== "latest") {
    params.set("sort", sort);
  }
  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/feed?${query}` : "/feed";
}

export default function FeedClient({
  posts,
  likedPostIds,
  page,
  hasNextPage,
  hasPrevPage,
  searchQuery,
  sort,
}: FeedClientProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(searchQuery);

  const likedIds = useMemo(() => new Set(likedPostIds), [likedPostIds]);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildFeedHref({ page: 1, q: searchValue, sort }));
  };

  const handleSortChange = (nextSort: SortKey) => {
    router.push(buildFeedHref({ page: 1, q: searchValue, sort: nextSort }));
  };

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
                      onClick={() => handleSortChange(option.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all border rounded-none ${
                        sort === option.id
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
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#CEF431]/60"
                  strokeWidth={1.5}
                />
                <Input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  className="w-full pl-12 pr-16 py-3 bg-[#161514]/30 border border-[#CEF431]/20 text-[#EAF4F4] placeholder:text-[#EAF4F4]/40 rounded-none focus:border-[#CEF431]/50"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#CEF431]/40 bg-[#161514]/70 px-3 py-1.5 text-xs text-[#CEF431] transition-colors hover:border-[#CEF431] hover:text-[#03D26F] cursor-pointer"
                >
                  검색
                </button>
              </form>
            </motion.div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="p-6 bg-[#161514]/30 border border-[#EAF4F4]/10 rounded-none">
                  <p className="text-sm text-[#EAF4F4]/60">
                    일치하는 게시글이 없습니다.
                  </p>
                </Card>
              ) : (
                posts.map((post, index) => {
                  const authorName = post.author_username ?? "익명";
                  const initial =
                    authorName.trim().charAt(0).toUpperCase() || "A";
                  const viewCount = Number.isFinite(post.views ?? 0)
                    ? Number(post.views ?? 0)
                    : 0;
                  const likeCount = Number.isFinite(post.likes ?? 0)
                    ? Number(post.likes ?? 0)
                    : 0;
                  const commentCount = Number.isFinite(post.comments ?? 0)
                    ? Number(post.comments ?? 0)
                    : 0;
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        role="link"
                        tabIndex={0}
                        onClick={() => handleNavigate(`/posts/${post.id}`)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleNavigate(`/posts/${post.id}`);
                          }
                        }}
                        className="group cursor-pointer rounded-none border border-[#EAF4F4]/10 bg-[#161514]/30 p-6 transition-all hover:border-[#CEF431]/40 focus-visible:outline focus-visible:outline-[#03D26F]/60 focus-visible:outline-offset-2"
                      >
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
                              onClick={(event) => event.stopPropagation()}
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
                              {commentCount}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock
                                className="w-3.5 h-3.5"
                                strokeWidth={1.5}
                              />
                              {estimateReadTime(post.content_text)}
                            </div>
                            <Link
                              href={`/posts/${post.id}`}
                              onClick={(event) => event.stopPropagation()}
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

            {(hasPrevPage || hasNextPage) && (
              <div className="mt-8 flex items-center justify-between">
                {hasPrevPage ? (
                  <Button asChild variant="outline" className="rounded-none">
                    <Link
                      href={buildFeedHref({
                        page: page - 1,
                        q: searchQuery,
                        sort,
                      })}
                    >
                      이전
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none"
                    disabled
                  >
                    이전
                  </Button>
                )}
                {hasNextPage ? (
                  <Button asChild variant="outline" className="rounded-none">
                    <Link
                      href={buildFeedHref({
                        page: page + 1,
                        q: searchQuery,
                        sort,
                      })}
                    >
                      다음
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none"
                    disabled
                  >
                    다음
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
