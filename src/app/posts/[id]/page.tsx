import Link from "next/link";
import { Eye, Heart, MessageSquarePlus, PencilLine } from "lucide-react";
import { notFound } from "next/navigation";
import dayjs from "dayjs";

import { createComment, updateComment } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import LikeButton from "@/components/posts/like-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type PostDetailProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    comment_error?: string;
  }>;
};

function formatDate(value: string) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("YYYY.MM.DD");
}

function getInitial(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "익";
  }
  return Array.from(trimmed)[0] ?? "익";
}

const COMMENT_ERROR_MESSAGES: Record<string, string> = {
  invalid: "댓글 내용을 입력해 주세요.",
  failed: "댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  depth: "답글은 한 번만 작성할 수 있습니다.",
};

export default async function PostDetail({
  params,
  searchParams,
}: PostDetailProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  const commentParams = (await searchParams) ?? {};
  const commentError = COMMENT_ERROR_MESSAGES[commentParams.comment_error ?? ""];

  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "id, title, content, content_text, created_at, author_id, author_username, views, likes"
    )
    .eq("id", postId)
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: updatedViews, error: viewsError } = await supabase.rpc(
    "increment_post_views",
    { post_id: postId }
  );
  if (viewsError) {
    console.error("Supabase view count error:", viewsError.message);
  }
  const viewCountRaw = updatedViews ?? post.views ?? 0;
  const viewCountNumber =
    typeof viewCountRaw === "string" ? Number(viewCountRaw) : viewCountRaw;
  const viewCount = Number.isFinite(viewCountNumber) ? viewCountNumber : 0;
  const likeCountRaw = Number(post.likes ?? 0);
  const likeCount = Number.isFinite(likeCountRaw) ? likeCountRaw : 0;
  let isLiked = false;

  if (userData.user) {
    const { data: likeData, error: likeError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (likeError) {
      console.error("Supabase post like fetch error:", likeError.message);
    }

    isLiked = Boolean(likeData);
  }

  const { data: comments, error: commentsError } = await supabase
    .from("post_comments")
    .select(
      "id, post_id, parent_id, content, author_id, author_username, created_at, updated_at"
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (commentsError) {
    console.error("Supabase comments fetch error:", commentsError.message);
  }

  const topLevelComments = (comments ?? []).filter(
    (comment) => !comment.parent_id
  );
  const repliesByParent = new Map<number, typeof comments>();

  (comments ?? []).forEach((comment) => {
    if (!comment.parent_id) {
      return;
    }
    const parentId = Number(comment.parent_id);
    const existing = repliesByParent.get(parentId) ?? [];
    existing.push(comment);
    repliesByParent.set(parentId, existing);
  });

  const commentCount = comments?.length ?? 0;
  const userInitial = userData.user
    ? getInitial(
        (userData.user.user_metadata?.displayName as string | undefined) ??
          userData.user.email?.split("@")[0]
      )
    : null;

  const canEdit = userData.user?.id === post.author_id;
  const contentHtml =
    post.content?.trim() ||
    (post.content_text ? `<p>${post.content_text}</p>` : "<p>내용이 없습니다.</p>");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/feed">피드로 돌아가기</Link>
          </Button>
          {canEdit && (
            <Button asChild className="rounded-full px-5" size="sm">
              <Link href={`/posts/${post.id}/edit`}>수정하기</Link>
            </Button>
          )}
        </header>

        <div className="space-y-3">
          <Badge className="w-fit rounded-full bg-primary/10 text-primary">
            글 상세
          </Badge>
          <h1 className="font-heading text-3xl font-semibold leading-tight md:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{post.author_username ?? "익명"}</span>
            <span className="text-muted-foreground/60">•</span>
            <span>{post.created_at ? formatDate(post.created_at) : ""}</span>
            <span className="text-muted-foreground/60">•</span>
            <div className="flex items-center gap-1">
              <Eye className="size-4" />
              <span>{viewCount}</span>
            </div>
            <span className="text-muted-foreground/60">•</span>
            {userData.user ? (
              <LikeButton
                postId={post.id}
                initialLiked={isLiked}
                initialCount={likeCount}
                className="h-6 px-2 text-xs"
              />
            ) : (
              <div className="flex items-center gap-1">
                <Heart className="size-4 text-muted-foreground" />
                <span>{likeCount}</span>
              </div>
            )}
          </div>
        </div>

        <Card className="border-border/70 bg-background/95">
          <CardContent className="space-y-4 px-6 py-6 text-sm text-foreground">
            <div
              className="tiptap"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </CardContent>
        </Card>

        <Separator />

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/feed">목록으로</Link>
          </Button>
          {canEdit && (
            <Button asChild className="rounded-full">
              <Link href={`/posts/${post.id}/edit`}>수정하기</Link>
            </Button>
          )}
        </div>

        <Separator />

        <section id="comments" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge className="rounded-full bg-primary/10 text-primary">
                댓글
              </Badge>
              <p className="text-sm text-muted-foreground">
                로그인한 사용자만 댓글을 작성할 수 있습니다.
              </p>
            </div>
            <div className="rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs text-muted-foreground">
              총 {commentCount}개
            </div>
          </div>

          {commentError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {commentError}
            </div>
          )}

          {userData.user ? (
            <Card className="border-primary/15 bg-background/95 shadow-sm">
              <CardContent className="space-y-4 px-6 py-5">
                <form action={createComment} className="space-y-4">
                  <input type="hidden" name="postId" value={post.id} />
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {userInitial}
                    </div>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        name="content"
                        placeholder="댓글을 입력해 주세요"
                        className="min-h-[130px] bg-background/80"
                        minLength={1}
                        maxLength={1000}
                        required
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>답글은 한 단계까지만 작성할 수 있어요.</span>
                        <Button type="submit" className="rounded-full">
                          댓글 등록
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-border/70 bg-background/95">
              <CardContent className="space-y-3 px-6 py-6 text-sm text-muted-foreground">
                댓글을 작성하려면 로그인해 주세요.
                <Button asChild className="w-fit rounded-full">
                  <Link href={`/login?next=/posts/${post.id}`}>
                    로그인하러 가기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {topLevelComments.length === 0 ? (
              <Card className="border-dashed border-border/70 bg-background/95">
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  아직 댓글이 없습니다.
                </CardContent>
              </Card>
            ) : (
              topLevelComments.map((comment) => {
                const replies =
                  repliesByParent.get(Number(comment.id)) ?? [];
                const isAuthor = userData.user?.id === comment.author_id;
                const commentInitial = getInitial(comment.author_username);

                return (
                  <Card
                    key={comment.id}
                    className="border-border/70 bg-background/95 shadow-sm"
                  >
                    <CardContent className="space-y-4 px-6 py-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {commentInitial}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                              <span>{comment.author_username ?? "익명"}</span>
                              {isAuthor && (
                                <Badge variant="secondary" className="rounded-full">
                                  내 댓글
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {comment.created_at ? formatDate(comment.created_at) : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-foreground">
                        {comment.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {userData.user && (
                          <details className="group open:w-full open:basis-full">
                            <summary className="inline-flex list-none items-center cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/80 text-primary transition-colors hover:bg-muted/60">
                                <MessageSquarePlus className="size-4" />
                              </span>
                              <span className="sr-only">답글 달기</span>
                            </summary>
                            <form
                              action={createComment}
                              className="mt-3 space-y-2"
                            >
                              <input type="hidden" name="postId" value={post.id} />
                              <input
                                type="hidden"
                                name="parentId"
                                value={comment.id}
                              />
                              <Textarea
                                name="content"
                                placeholder="답글을 입력해 주세요"
                                className="min-h-[110px] bg-background/80"
                                minLength={1}
                                maxLength={1000}
                                required
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="rounded-full"
                              >
                                답글 등록
                              </Button>
                            </form>
                          </details>
                        )}
                        {isAuthor && (
                          <details className="group open:w-full open:basis-full">
                            <summary className="inline-flex list-none items-center cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-colors hover:bg-muted/60">
                                <PencilLine className="size-4" />
                              </span>
                              <span className="sr-only">댓글 수정</span>
                            </summary>
                            <form
                              action={updateComment}
                              className="mt-3 space-y-2"
                            >
                              <input type="hidden" name="postId" value={post.id} />
                              <input
                                type="hidden"
                                name="commentId"
                                value={comment.id}
                              />
                              <Textarea
                                name="content"
                                defaultValue={comment.content}
                                className="min-h-[110px] bg-background/80"
                                minLength={1}
                                maxLength={1000}
                                required
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="rounded-full"
                              >
                                수정 저장
                              </Button>
                            </form>
                          </details>
                        )}
                      </div>
                      {replies.length > 0 && (
                        <div className="space-y-3 border-l border-border/70 pl-4">
                          {replies.map((reply) => {
                            const replyAuthor =
                              userData.user?.id === reply.author_id;
                            const replyInitial = getInitial(reply.author_username);
                            return (
                              <div
                                key={reply.id}
                                className="rounded-xl border border-border/70 bg-background/90 px-4 py-3"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                      {replyInitial}
                                    </div>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-foreground">
                                        <span>{reply.author_username ?? "익명"}</span>
                                        {replyAuthor && (
                                          <Badge
                                            variant="secondary"
                                            className="rounded-full"
                                          >
                                            내 댓글
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-muted-foreground">
                                        {reply.created_at
                                          ? formatDate(reply.created_at)
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                                  {reply.content}
                                </p>
                                {replyAuthor && (
                                  <details className="mt-2 text-xs text-muted-foreground open:w-full open:basis-full">
                                    <summary className="inline-flex list-none items-center cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-colors hover:bg-muted/60">
                                        <PencilLine className="size-4" />
                                      </span>
                                      <span className="sr-only">답글 수정</span>
                                    </summary>
                                    <form
                                      action={updateComment}
                                      className="mt-3 space-y-2"
                                    >
                                      <input
                                        type="hidden"
                                        name="postId"
                                        value={post.id}
                                      />
                                      <input
                                        type="hidden"
                                        name="commentId"
                                        value={reply.id}
                                      />
                                      <Textarea
                                        name="content"
                                        defaultValue={reply.content}
                                        className="min-h-[110px] bg-background/80"
                                        minLength={1}
                                        maxLength={1000}
                                        required
                                      />
                                      <Button
                                        type="submit"
                                        size="sm"
                                        className="rounded-full"
                                      >
                                        수정 저장
                                      </Button>
                                    </form>
                                  </details>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
