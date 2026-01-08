"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import {
  createComment,
  updateComment,
  type CommentActionState,
  type CommentUpdateActionState,
} from "@/app/actions";
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
  author_id: string | null;
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
  postAuthorId: string;
  currentUserId: string | null;
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

const COMMENT_ACTION_INITIAL_STATE: CommentActionState = { status: "idle" };

const COMMENT_ACTION_ERROR_MESSAGES: Record<string, string> = {
  invalid: "댓글 내용을 입력해 주세요.",
  depth: "답글은 한 번만 작성할 수 있습니다.",
  failed: "댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

const COMMENT_UPDATE_INITIAL_STATE: CommentUpdateActionState = {
  status: "idle",
};

const COMMENT_UPDATE_ERROR_MESSAGES: Record<string, string> = {
  invalid: "댓글 내용을 입력해 주세요.",
  forbidden: "수정 권한이 없습니다.",
  failed: "댓글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.",
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
  postAuthorId,
  currentUserId,
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
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentItems, setCommentItems] = useState<CommentItem[]>(comments);
  const [replyMap, setReplyMap] =
    useState<Record<number, CommentItem[]>>(repliesByParent);
  const [commentTotal, setCommentTotal] = useState(commentCount);
  const [commentErrorMessage, setCommentErrorMessage] = useState(
    commentError ?? ""
  );
  const [commentState, commentAction] = useActionState(
    createComment,
    COMMENT_ACTION_INITIAL_STATE
  );
  const [updateState, updateAction] = useActionState(
    updateComment,
    COMMENT_UPDATE_INITIAL_STATE
  );
  const mainFormRef = useRef<HTMLFormElement | null>(null);
  const replyFormRefs = useRef(new Map<number, HTMLFormElement>());
  const lastInsertedIdRef = useRef<number | null>(null);

  const startEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditingContent(content);
    setCommentErrorMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
    setCommentErrorMessage("");
  };

  useEffect(() => {
    setCommentItems(comments);
  }, [comments]);

  useEffect(() => {
    setReplyMap(repliesByParent);
  }, [repliesByParent]);

  useEffect(() => {
    setCommentTotal(commentCount);
  }, [commentCount]);

  useEffect(() => {
    setCommentErrorMessage(commentError ?? "");
  }, [commentError]);

  useEffect(() => {
    if (commentState.status !== "success" || !commentState.comment) {
      return;
    }

    const inserted = commentState.comment;
    if (lastInsertedIdRef.current === inserted.id) {
      return;
    }
    lastInsertedIdRef.current = inserted.id;

    const parentId = inserted.parent_id;
    if (parentId !== null) {
      const replyExistsInProps = (repliesByParent[parentId] ?? []).some(
        (reply) => reply.id === inserted.id
      );
      const replyExistsInState = (replyMap[parentId] ?? []).some(
        (reply) => reply.id === inserted.id
      );

      setCommentErrorMessage("");
      setReplyingTo(null);
      replyFormRefs.current.get(parentId)?.reset();

      if (replyExistsInProps || replyExistsInState) {
        return;
      }

      setCommentTotal((prev) => prev + 1);
      setReplyMap((prev) => {
        const nextReplies = prev[parentId] ?? [];
        return {
          ...prev,
          [parentId]: [
            ...nextReplies,
            {
              id: inserted.id,
              content: inserted.content,
              author_id: inserted.author_id,
              author_username: inserted.author_username,
              created_at: inserted.created_at,
            },
          ],
        };
      });
      return;
    }

    const commentExistsInProps = comments.some(
      (comment) => comment.id === inserted.id
    );
    const commentExistsInState = commentItems.some(
      (comment) => comment.id === inserted.id
    );

    setCommentErrorMessage("");
    mainFormRef.current?.reset();

    if (commentExistsInProps || commentExistsInState) {
      return;
    }

    setCommentTotal((prev) => prev + 1);
    setCommentItems((prev) => [
      ...prev,
      {
        id: inserted.id,
        content: inserted.content,
        author_id: inserted.author_id,
        author_username: inserted.author_username,
        created_at: inserted.created_at,
      },
    ]);
  }, [commentState]);

  useEffect(() => {
    if (commentState.status !== "error") {
      return;
    }

    if (commentState.error === "unauthenticated") {
      router.push(`/login?next=/posts/${postId}`);
      return;
    }

    const message =
      COMMENT_ACTION_ERROR_MESSAGES[commentState.error ?? "failed"] ??
      COMMENT_ACTION_ERROR_MESSAGES.failed;
    setCommentErrorMessage(message);
  }, [commentState, postId, router]);

  useEffect(() => {
    if (updateState.status !== "success" || !updateState.comment) {
      return;
    }

    const { id, content } = updateState.comment;
    setCommentErrorMessage("");
    setEditingId(null);
    setEditingContent("");

    setCommentItems((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, content } : comment
      )
    );
    setReplyMap((prev) => {
      let changed = false;
      const next: Record<number, CommentItem[]> = {};
      Object.entries(prev).forEach(([key, replies]) => {
        const parentId = Number(key);
        const updatedReplies = replies.map((reply) => {
          if (reply.id === id) {
            changed = true;
            return { ...reply, content };
          }
          return reply;
        });
        next[parentId] = updatedReplies;
      });
      return changed ? next : prev;
    });
  }, [updateState]);

  useEffect(() => {
    if (updateState.status !== "error") {
      return;
    }

    if (updateState.error === "unauthenticated") {
      router.push(`/login?next=/posts/${postId}`);
      return;
    }

    const message =
      COMMENT_UPDATE_ERROR_MESSAGES[updateState.error ?? "failed"] ??
      COMMENT_UPDATE_ERROR_MESSAGES.failed;
    setCommentErrorMessage(message);
  }, [updateState, postId, router]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 md:p-12 bg-[#161514]/40 border-2 border-[#EAF4F4]/10 rounded-none">
              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge className="bg-[#03D26F]/20 text-[#03D26F] border border-[#03D26F]/30 rounded-none">
                    피드
                  </Badge>
                  {canEdit ? (
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={`/posts/${postId}/edit`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
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
                      <p className="text-[#EAF4F4] font-semibold">
                        {authorName}
                      </p>
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
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#EAF4F4]/30 [&_blockquote]:pl-4
                    [&_blockquote]:py-2 [&_blockquote]:bg-[#014651]/50 [&_blockquote]:text-[#EAF4F4]
                    [&_blockquote]:my-4 [&_blockquote_p]:m-0"
                  suppressHydrationWarning
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
                  {commentTotal}
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
                    Comments ({commentTotal})
                  </h2>
                </div>

                {commentErrorMessage ? (
                  <div className="mb-6 border border-[#CEF431]/40 bg-[#CEF431]/10 px-4 py-3 text-sm text-[#CEF431]">
                    {commentErrorMessage}
                  </div>
                ) : null}

                {/* Add Comment */}
                <form
                  action={commentAction}
                  ref={mainFormRef}
                  onSubmit={() => setCommentErrorMessage("")}
                  className="mb-8 pb-8 border-b border-[#CEF431]/20"
                >
                  <input type="hidden" name="postId" value={postId} />
                  <Textarea
                    name="content"
                    placeholder="Share your thoughts or ask a question..."
                    className="mb-4 min-h-25 rounded-none border-2 border-[#CEF431]/30 bg-[#014651]/50 text-[#CEF431] placeholder:text-[#CEF431]/40 focus:border-[#CEF431]"
                  />
                  <SubmitButton className="bg-[#CEF431] text-[#014651] hover:bg-[#CEF431]/90 rounded-none cursor-pointer">
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    댓글 등록
                  </SubmitButton>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {commentItems.length === 0 ? (
                    <p className="text-sm text-[#CEF431]/70">
                      아직 댓글이 없습니다.
                    </p>
                  ) : (
                    commentItems.map((comment) => (
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
                                <div className="flex items-center gap-2">
                                  <p className="text-[#CEF431] font-semibold text-sm">
                                    {comment.author_username ?? "익명"}
                                  </p>
                                  {comment.author_id === postAuthorId ? (
                                    <span className="border border-[#CEF431]/40 px-1.5 py-0.5 text-[10px] text-[#CEF431]/80">
                                      작성자
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-xs text-[#CEF431]/60">
                                  {formatDate(comment.created_at)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {comment.author_id &&
                                comment.author_id === currentUserId ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      editingId === comment.id
                                        ? cancelEdit()
                                        : startEdit(comment.id, comment.content)
                                    }
                                    className="h-7 px-2 text-xs text-[#CEF431]/80 hover:text-[#CEF431] cursor-pointer"
                                  >
                                    {editingId === comment.id ? "취소" : "수정"}
                                  </Button>
                                ) : null}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    setReplyingTo((prev) =>
                                      prev === comment.id ? null : comment.id
                                    )
                                  }
                                  className="h-7 px-2 text-xs text-[#CEF431]/80 hover:text-[#CEF431] cursor-pointer"
                                >
                                  {replyingTo === comment.id ? "취소" : "답글"}
                                </Button>
                              </div>
                            </div>
                            {editingId === comment.id ? (
                              <form
                                action={updateAction}
                                onSubmit={() => setCommentErrorMessage("")}
                                className="mt-3 space-y-3"
                              >
                                <input
                                  type="hidden"
                                  name="postId"
                                  value={postId}
                                />
                                <input
                                  type="hidden"
                                  name="commentId"
                                  value={comment.id}
                                />
                                <Textarea
                                  name="content"
                                  value={editingContent}
                                  onChange={(event) =>
                                    setEditingContent(event.target.value)
                                  }
                                  className="min-h-20 rounded-none border-2 border-[#CEF431]/30 bg-[#014651]/50 text-[#CEF431] placeholder:text-[#CEF431]/40 focus:border-[#CEF431]"
                                />
                                <div className="flex items-center gap-2">
                                  <SubmitButton className="bg-[#CEF431] text-[#014651] hover:bg-[#CEF431]/90 rounded-none cursor-pointer">
                                    수정 저장
                                  </SubmitButton>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEdit}
                                    className="rounded-none border-[#CEF431]/30 text-[#CEF431] hover:border-[#CEF431]"
                                  >
                                    취소
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <p className="text-[#CEF431]/80 text-sm leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            )}

                            {replyingTo === comment.id ? (
                              <form
                                action={commentAction}
                                ref={(node) => {
                                  if (node) {
                                    replyFormRefs.current.set(comment.id, node);
                                  } else {
                                    replyFormRefs.current.delete(comment.id);
                                  }
                                }}
                                onSubmit={() => setCommentErrorMessage("")}
                                className="mt-4 space-y-3"
                              >
                                <input
                                  type="hidden"
                                  name="postId"
                                  value={postId}
                                />
                                <input
                                  type="hidden"
                                  name="parentId"
                                  value={comment.id}
                                />
                                <Textarea
                                  name="content"
                                  placeholder="답글을 입력해 주세요."
                                  className="min-h-20 rounded-none border-2 border-[#CEF431]/30 bg-[#014651]/50 text-[#CEF431] placeholder:text-[#CEF431]/40 focus:border-[#CEF431]"
                                />
                                <SubmitButton className="bg-[#CEF431] text-[#014651] hover:bg-[#CEF431]/90 rounded-none cursor-pointer">
                                  답글 등록
                                </SubmitButton>
                              </form>
                            ) : null}
                          </div>
                        </div>

                        {(replyMap[comment.id] ?? []).length > 0 ? (
                          <div className="mt-4 space-y-3 pl-10">
                            {replyMap[comment.id].map((reply) => (
                              <div
                                key={reply.id}
                                className="border-l border-[#CEF431]/20 pl-4"
                              >
                                <div className="flex items-center justify-between gap-2 text-xs text-[#CEF431]/60 mb-1">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {reply.author_username ?? "익명"}
                                    </span>
                                    {reply.author_id === postAuthorId ? (
                                      <span className="border border-[#CEF431]/40 px-1.5 py-0.5 text-[10px] text-[#CEF431]/80">
                                        작성자
                                      </span>
                                    ) : null}
                                    <span>·</span>
                                    <span>{formatDate(reply.created_at)}</span>
                                  </div>
                                  {reply.author_id &&
                                  reply.author_id === currentUserId ? (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        editingId === reply.id
                                          ? cancelEdit()
                                          : startEdit(reply.id, reply.content)
                                      }
                                      className="h-6 px-2 text-[10px] text-[#CEF431]/80 hover:text-[#CEF431] cursor-pointer"
                                    >
                                      {editingId === reply.id ? "취소" : "수정"}
                                    </Button>
                                  ) : null}
                                </div>
                                {editingId === reply.id ? (
                                  <form
                                    action={updateAction}
                                    onSubmit={() => setCommentErrorMessage("")}
                                    className="mt-2 space-y-3"
                                  >
                                    <input
                                      type="hidden"
                                      name="postId"
                                      value={postId}
                                    />
                                    <input
                                      type="hidden"
                                      name="commentId"
                                      value={reply.id}
                                    />
                                    <Textarea
                                      name="content"
                                      value={editingContent}
                                      onChange={(event) =>
                                        setEditingContent(event.target.value)
                                      }
                                      className="min-h-16 rounded-none border-2 border-[#CEF431]/30 bg-[#014651]/50 text-[#CEF431] placeholder:text-[#CEF431]/40 focus:border-[#CEF431]"
                                    />
                                    <div className="flex items-center gap-2">
                                      <SubmitButton className="bg-[#CEF431] text-[#014651] hover:bg-[#CEF431]/90 rounded-none cursor-pointer">
                                        수정 저장
                                      </SubmitButton>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cancelEdit}
                                        className="rounded-none border-[#CEF431]/30 text-[#CEF431] hover:border-[#CEF431] cursor-pointer"
                                      >
                                        취소
                                      </Button>
                                    </div>
                                  </form>
                                ) : (
                                  <div className="text-sm text-[#CEF431]/80 whitespace-pre-wrap">
                                    {reply.content}
                                  </div>
                                )}
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
                  <span className="text-2xl text-[#CEF431]">
                    {authorInitial}
                  </span>
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
