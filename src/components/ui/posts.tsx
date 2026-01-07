"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Clock, Tag, MessageSquare, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import LikeButton from "@/components/posts/like-button";

type PostCardData = {
  id: number;
  title: string;
  excerpt: string;
  category?: string;
  verified?: boolean;
  readTime?: string;
  tags?: string[];
  author: {
    name: string;
    role?: string;
    initial: string;
  };
  likes: number;
  comments: number;
  views: number;
  href: string;
};

type PostsProps = {
  posts: PostCardData[];
  likedPostIds?: number[];
};

export default function Posts({ posts, likedPostIds = [] }: PostsProps) {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const likedIds = useMemo(() => new Set(likedPostIds), [likedPostIds]);

  return (
    <div className="lg:col-span-2 space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onMouseEnter={() => setHoveredPost(post.id)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          <Card
            className={`rounded-none border-2 bg-[#161514]/40 p-8 transition-all duration-300 ${
              hoveredPost === post.id
                ? "translate-x-2 border-[#03D26F] shadow-lg shadow-[#03D26F]/20"
                : "border-[#EAF4F4]/10"
            }`}
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                {post.category ? (
                  <Badge className="rounded-none border border-[#03D26F]/30 bg-[#03D26F]/20 px-3 py-1 text-[#03D26F]">
                    {post.category}
                  </Badge>
                ) : null}
                {post.verified && (
                  <Badge className="rounded-none border-0 bg-[#03D26F] px-3 py-1 text-[#161514]">
                    ✓ Expert
                  </Badge>
                )}
              </div>
              {post.readTime ? (
                <div className="flex items-center gap-2 text-xs text-[#EAF4F4]/60">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </div>
              ) : null}
            </div>

            {/* Title */}
            <Link
              href={post.href}
              className="mb-3 block text-xl font-semibold text-[#CEF431] transition-colors hover:text-[#03D26F]"
            >
              {post.title}
            </Link>

            {/* Excerpt */}
            <p className="mb-6 text-sm leading-relaxed text-[#EAF4F4]/80">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 ? (
              <div className="mb-6 flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex cursor-pointer items-center gap-1.5 border border-[#EAF4F4]/20 bg-[#014651]/80 px-3 py-1.5 text-xs text-[#EAF4F4]/80 transition-colors hover:border-[#03D26F]/50 hover:text-[#03D26F]"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#EAF4F4]/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-[#03D26F]/30 bg-linear-to-br from-[#03D26F]/20 to-[#03D26F]/10">
                  <span className="text-xs text-[#CEF431]">
                    {post.author.initial}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#EAF4F4]">{post.author.name}</p>
                  {post.author.role ? (
                    <p className="text-xs text-[#EAF4F4]/60">
                      {post.author.role}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#EAF4F4]/70">
                <LikeButton
                  postId={post.id}
                  initialLiked={likedIds.has(post.id)}
                  initialCount={post.likes}
                  className="text-[#EAF4F4]/70 hover:text-[#CEF431]"
                />
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {post.views}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
