import { notFound } from "next/navigation";
import PostDetailClient from "@/components/sections/post_detail_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type PostDetailProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    comment_error?: string;
  }>;
};

const COMMENT_ERROR_MESSAGES: Record<string, string> = {
  invalid: "댓글 내용을 입력해 주세요.",
  failed: "댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  depth: "답글은 한 번만 작성할 수 있습니다.",
};

function getInitial(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "익";
  }
  return Array.from(trimmed)[0] ?? "익";
}

export default async function PostDetail({ params, searchParams }: PostDetailProps) {
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

  const commentList = comments ?? [];
  const topLevelComments = commentList.filter(
    (comment) => !comment.parent_id
  );
  const repliesByParent = new Map<number, typeof commentList>();

  commentList.forEach((comment) => {
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

  const { data: relatedPosts, error: relatedError } = await supabase
    .from("posts")
    .select("id, title, created_at, views")
    .neq("id", postId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (relatedError) {
    console.error("Supabase related posts fetch error:", relatedError.message);
  }

  return (
    <PostDetailClient
      postId={postId}
      postAuthorId={post.author_id}
      currentUserId={userData.user?.id ?? null}
      title={post.title ?? "제목 없음"}
      contentHtml={contentHtml}
      createdAt={post.created_at}
      authorName={post.author_username ?? "익명"}
      authorInitial={getInitial(post.author_username) ?? userInitial ?? "익"}
      viewCount={viewCount}
      likeCount={likeCount}
      isLiked={isLiked}
      commentCount={commentCount}
      commentError={commentError}
      canEdit={Boolean(canEdit)}
      comments={topLevelComments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        author_username: comment.author_username,
        author_id: comment.author_id,
        created_at: comment.created_at,
      }))}
      repliesByParent={Object.fromEntries(
        Array.from(repliesByParent.entries()).map(([key, values]) => [
          key,
          values.map((comment) => ({
            id: comment.id,
            content: comment.content,
            author_username: comment.author_username,
            author_id: comment.author_id,
            created_at: comment.created_at,
          })),
        ])
      )}
      relatedPosts={(relatedPosts ?? []).map((related) => ({
        id: related.id,
        title: related.title,
        created_at: related.created_at,
        views: related.views,
      }))}
    />
  );
}
