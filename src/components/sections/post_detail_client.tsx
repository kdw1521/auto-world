"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  MessageSquarePlus,
  PencilLine,
} from "lucide-react";

import { createComment } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SubmitButton from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import LikeButton from "@/components/posts/like-button";

type CommentItem = {
  id: number;
  content: string;
  author_username: string | null;
  created_at: string | null;
};

type RelatedPost = {
  id: number;
  title: string | null;
  created_at: string | null;
  views: number | null;
};

type PostDetailClientProps = {
  postId: number;
  title: string;
  contentHtml: string;
  createdAt: string | null;
  authorName: string;
  authorInitial: string;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  commentError?: string;
  canEdit: boolean;
  comments: CommentItem[];
  repliesByParent: Record<number, CommentItem[]>;
  relatedPosts: RelatedPost[];
};

function formatDate(value: string | null) {
  if (!value) return "";
  const date = dayjs(value);
  if (!date.isValid()) return "";
  return date.format("YYYY.MM.DD");
}

function estimateReadTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export default function PostDetailClient({
  postId,
  title,
  contentHtml,
  createdAt,
  authorName,
  authorInitial,
  viewCount,
  likeCount,
  isLiked,
  commentCount,
  commentError,
  canEdit,
  comments,
  repliesByParent,
  relatedPosts,
}: PostDetailClientProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 md:p-12 bg-[#161514]/40 border-2 border-[#EAF4F4]/10 rounded-none">
              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge className="bg-[#03D26F]/20 text-[#03D26F] border border-[#03D26F]/30 rounded-none">
                    피드
                  </Badge>
                  {canEdit ? (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/posts/${postId}/edit`} className="flex items-center gap-2">
                        <PencilLine className="w-4 h-4" />
                        수정
                      </Link>
                    </Button>
                  ) : null}
                </div>

                <h1 className="text-4xl font-bold text-[#CEF431] mb-6 leading-tight">
                  {title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center flex-wrap gap-4 text-sm text-[#EAF4F4]/70 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{estimateReadTime(contentHtml)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{viewCount} views</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between p-4 bg-[#014651]/50 border border-[#EAF4F4]/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-[#03D26F]/20 to-[#03D26F]/10 border border-[#03D26F]/30 flex items-center justify-center">
                      <span className="text-lg text-[#CEF431]">
                        {authorInitial}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#EAF4F4] font-semibold">{authorName}</p>
                      <p className="text-xs text-[#EAF4F4]/60">Member</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none w-full overflow-hidden">
                <div
                  className="
      text-[#EAF4F4]/90 leading-relaxed space-y-6 whitespace-pre-wrap 
      [word-break:break-word] overflow-wrap-anywhere
      [&_pre]:whitespace-pre-wrap [&_pre]:break-all [&_code]:break-all
    "
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-12 pt-8 border-t border-[#EAF4F4]/10">
                <LikeButton
                  postId={postId}
                  initialLiked={isLiked}
                  initialCount={likeCount}
                  className="h-9 px-3 text-sm"
                />
                <div className="flex items-center gap-2 text-sm text-[#EAF4F4]/70">
                  <MessageSquare className="w-4 h-4" />
                  {commentCount}
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8"
              id="comments"
            >
              <Card className="p-8 bg-[#023940]/30 border-2 border-[#CEF431]/20 rounded-none">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-[#CEF431]" />
                  <h2 className="text-xl font-bold text-[#CEF431]">
                    Comments ({commentCount})
                  </h2>
                </div>

                {commentError ? (
                  <div className="mb-6 border border-[#CEF431]/40 bg-[#CEF431]/10 px-4 py-3 text-sm text-[#CEF431]">
                    {commentError}
                  </div>
                ) : null}

                {/* Add Comment */}
                <form
                  action={createComment}
                  className="mb-8 pb-8 border-b border-[#CEF431]/20"
                >
                  <input type="hidden" name="postId" value={postId} />
                  <Textarea
                    name="content"
                    placeholder="Share your thoughts or ask a question..."
                    className="mb-4 min-h-25 rounded-none border-2 border-[#CEF431]/30 bg-[#014651]/50 text-[#CEF431] placeholder:text-[#CEF431]/40 focus:border-[#CEF431]"
                  />
                  <SubmitButton className="bg-[#CEF431] text-[#014651] hover:bg-[#CEF431]/90 rounded-none">
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    댓글 등록
                  </SubmitButton>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.length === 0 ? (
                    <p className="text-sm text-[#CEF431]/70">
                      아직 댓글이 없습니다.
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-6 bg-[#014651]/30 border border-[#CEF431]/10"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-linear-to-br from-[#CEF431]/20 to-[#CEF431]/10 border border-[#CEF431]/30 flex items-center justify-center shrink-0">
                            <span className="text-sm text-[#CEF431]">
                              {comment.author_username?.charAt(0) ?? "익"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-[#CEF431] font-semibold text-sm">
                                  {comment.author_username ?? "익명"}
                                </p>
                                <p className="text-xs text-[#CEF431]/60">
                                  {formatDate(comment.created_at)}
                                </p>
                              </div>
                            </div>
                            <p className="text-[#CEF431]/80 text-sm leading-relaxed whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          </div>
                        </div>

                        {(repliesByParent[comment.id] ?? []).length > 0 ? (
                          <div className="mt-4 space-y-3 pl-10">
                            {repliesByParent[comment.id].map((reply) => (
                              <div
                                key={reply.id}
                                className="border-l border-[#CEF431]/20 pl-4"
                              >
                                <div className="text-xs text-[#CEF431]/60 mb-1">
                                  {reply.author_username ?? "익명"} ·{" "}
                                  {formatDate(reply.created_at)}
                                </div>
                                <div className="text-sm text-[#CEF431]/80 whitespace-pre-wrap">
                                  {reply.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Author Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-[#023940]/30 border-2 border-[#CEF431]/20 rounded-none mb-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-linear-to-br from-[#CEF431]/20 to-[#CEF431]/10 border-2 border-[#CEF431]/30 flex items-center justify-center mb-4">
                  <span className="text-2xl text-[#CEF431]">{authorInitial}</span>
                </div>
                <h3 className="text-lg font-bold text-[#CEF431] mb-1">
                  {authorName}
                </h3>
                <p className="text-sm text-[#CEF431]/70 mb-4">Member</p>
              </div>
            </Card>
          </motion.div>

          {/* Related Posts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-[#023940]/30 border-2 border-[#CEF431]/20 rounded-none">
              <h3 className="text-sm font-bold text-[#CEF431] mb-4">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedPosts.length === 0 ? (
                  <p className="text-xs text-[#CEF431]/60">
                    관련 글이 없습니다.
                  </p>
                ) : (
                  relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      href={`/posts/${related.id}`}
                      className="block w-full text-left p-4 bg-[#014651]/50 border border-[#CEF431]/10 hover:border-[#CEF431]/30 transition-colors"
                    >
                      <p className="text-sm text-[#CEF431] mb-2 line-clamp-2">
                        {related.title ?? "제목 없음"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[#CEF431]/60">
                        <span>{formatDate(related.created_at)}</span>
                        <span>{related.views ?? 0} views</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card className="p-6 bg-[#CEF431]/10 border-2 border-[#CEF431]/30 rounded-none">
              <h3 className="text-sm font-bold text-[#CEF431] mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/requests"
                  className="block w-full text-left px-3 py-2 text-sm text-[#CEF431] hover:bg-[#CEF431]/10 transition-colors"
                >
                  Report Issue
                </Link>
                <Link
                  href="/requests"
                  className="block w-full text-left px-3 py-2 text-sm text-[#CEF431] hover:bg-[#CEF431]/10 transition-colors"
                >
                  Suggest Edit
                </Link>
                <Link
                  href="/requests"
                  className="block w-full text-left px-3 py-2 text-sm text-[#CEF431] hover:bg-[#CEF431]/10 transition-colors"
                >
                  Share Feedback
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
