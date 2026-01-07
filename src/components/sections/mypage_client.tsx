"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Bookmark,
  Calendar,
  Edit,
  Eye,
  Heart,
  MessageSquare,
  UserRound,
} from "lucide-react";

import { updateDisplayName } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MyPost = {
  id: number;
  title: string;
  created_at: string | null;
  views: number;
  likes: number;
  comments: number;
};

type MyComment = {
  id: number;
  content: string;
  created_at: string | null;
  post_id: number;
  post_title: string;
};

type MyPageClientProps = {
  displayName: string;
  email: string;
  joinedAt: string | null;
  errorMessage?: string;
  updated: boolean;
  posts: MyPost[];
  comments: MyComment[];
  stats: {
    posts: number;
    comments: number;
    likes: number;
    views: number;
  };
};

function formatDate(value: string | null) {
  if (!value) return "";
  const date = dayjs(value);
  if (!date.isValid()) return "";
  return date.format("YYYY.MM.DD");
}

export default function MyPageClient({
  displayName,
  email,
  joinedAt,
  errorMessage,
  updated,
  posts,
  comments,
  stats,
}: MyPageClientProps) {
  const initial = Array.from(displayName.trim())[0] ?? "A";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-32 space-y-6"
          >
            {/* Profile Card */}
            <Card className="p-8 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#CEF431] to-[#03D26F] flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-[#014651]">
                    {initial}
                  </span>
                </div>

                <h2 className="text-xl font-medium text-[#CEF431] mb-1">
                  {displayName}
                </h2>
                <p className="text-sm text-[#EAF4F4]/60 mb-4">{email}</p>

                <div className="flex items-center gap-2 text-xs text-[#EAF4F4]/60 mb-6">
                  <Calendar className="w-3 h-3" strokeWidth={1.5} />
                  Joined {formatDate(joinedAt)}
                </div>

                <div className="w-full">
                  <form action={updateDisplayName} className="space-y-3">
                    <Input
                      name="displayName"
                      defaultValue={displayName}
                      placeholder="닉네임 변경"
                      className="rounded-none border border-[#CEF431]/30 bg-[#014651]/50 text-[#CEF431] placeholder:text-[#CEF431]/40 focus:border-[#CEF431]"
                      required
                    />
                    <SubmitButton className="w-full bg-transparent border-2 border-[#CEF431]/50 text-[#CEF431] hover:bg-[#CEF431]/10 hover:border-[#CEF431] rounded-none">
                      <Edit className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      프로필 수정
                    </SubmitButton>
                  </form>
                  {errorMessage ? (
                    <p className="mt-3 text-xs text-[#CEF431]">{errorMessage}</p>
                  ) : null}
                  {updated ? (
                    <p className="mt-3 text-xs text-[#03D26F]">
                      닉네임이 저장되었습니다.
                    </p>
                  ) : null}
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6 bg-gradient-to-br from-[#014651] to-[#161514] border border-[#CEF431]/30 rounded-none">
              <h3 className="text-sm font-medium text-[#CEF431] mb-4">통계</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#CEF431]">
                    {stats.posts}
                  </div>
                  <div className="text-xs text-[#EAF4F4]/60">게시글</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#CEF431]">
                    {stats.comments}
                  </div>
                  <div className="text-xs text-[#EAF4F4]/60">댓글</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#03D26F]">
                    {stats.likes}
                  </div>
                  <div className="text-xs text-[#EAF4F4]/60">좋아요</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#EAF4F4]">
                    {stats.views.toLocaleString("ko-KR")}
                  </div>
                  <div className="text-xs text-[#EAF4F4]/60">조회수</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full bg-[#161514]/30 border border-[#CEF431]/20 rounded-none p-1">
                <TabsTrigger
                  value="posts"
                  className="flex-1 rounded-none data-[state=active]:bg-[#CEF431]/20 data-[state=active]:text-[#CEF431]"
                >
                  <BadgeCheck className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  내 게시글
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="flex-1 rounded-none data-[state=active]:bg-[#CEF431]/20 data-[state=active]:text-[#CEF431]"
                >
                  <MessageSquare className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  내 댓글
                </TabsTrigger>
                <TabsTrigger
                  value="bookmarks"
                  className="flex-1 rounded-none data-[state=active]:bg-[#CEF431]/20 data-[state=active]:text-[#CEF431]"
                >
                  <Bookmark className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  북마크
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6 space-y-4">
                {posts.length === 0 ? (
                  <Card className="p-6 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
                    <p className="text-sm text-[#EAF4F4]/70">
                      아직 작성한 게시글이 없습니다.
                    </p>
                  </Card>
                ) : (
                  posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <Card className="p-6 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none hover:border-[#CEF431] transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Badge className="bg-[#CEF431]/10 border-[#CEF431]/30 text-[#CEF431] rounded-none text-xs mb-2">
                              피드
                            </Badge>
                            <Link
                              href={`/posts/${post.id}`}
                              className="block text-lg text-[#CEF431] mb-2 hover:text-[#CEF431]/80 transition-colors"
                            >
                              {post.title}
                            </Link>
                            <div className="flex items-center gap-4 text-xs text-[#EAF4F4]/60">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" strokeWidth={1.5} />
                                {post.views.toLocaleString("ko-KR")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" strokeWidth={1.5} />
                                {post.likes}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare
                                  className="w-3 h-3"
                                  strokeWidth={1.5}
                                />
                                {post.comments}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar
                                  className="w-3 h-3"
                                  strokeWidth={1.5}
                                />
                                {formatDate(post.created_at)}
                              </div>
                            </div>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            className="bg-transparent border border-[#CEF431]/30 text-[#CEF431] hover:bg-[#CEF431]/10 hover:border-[#CEF431] rounded-none"
                          >
                            <Link href={`/posts/${post.id}/edit`}>
                              <Edit className="w-3 h-3" strokeWidth={1.5} />
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="comments" className="mt-6 space-y-4">
                {comments.length === 0 ? (
                  <Card className="p-6 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
                    <p className="text-sm text-[#EAF4F4]/70">
                      아직 작성한 댓글이 없습니다.
                    </p>
                  </Card>
                ) : (
                  comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <Card className="p-6 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none hover:border-[#CEF431] transition-all">
                        <div className="mb-3">
                          <p className="text-sm text-[#EAF4F4]/60 mb-1">
                            댓글 대상:
                          </p>
                          <Link
                            href={`/posts/${comment.post_id}`}
                            className="text-base text-[#CEF431] mb-3 hover:text-[#CEF431]/80 transition-colors"
                          >
                            {comment.post_title}
                          </Link>
                        </div>
                        <p className="text-sm text-[#EAF4F4]/80 leading-relaxed mb-4 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#EAF4F4]/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" strokeWidth={1.5} />
                            {formatDate(comment.created_at)}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="bookmarks" className="mt-6 space-y-4">
                <Card className="p-6 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
                  <div className="flex items-center gap-3">
                    <UserRound className="w-4 h-4 text-[#CEF431]" />
                    <p className="text-sm text-[#EAF4F4]/70">
                      아직 북마크 기능이 없습니다.
                    </p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
