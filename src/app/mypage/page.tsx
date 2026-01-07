import { redirect } from "next/navigation";

import MyPageClient from "@/components/sections/mypage_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type MyPageProps = {
  searchParams?: Promise<{
    error?: string;
    updated?: string;
    request?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "닉네임은 1~24자로 입력해 주세요.",
  failed: "변경에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export default async function MyPage({ searchParams }: MyPageProps) {
  const params = (await searchParams) ?? {};
  const supabase = getSupabaseServerClientReadOnly();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login?next=/mypage");
  }

  const email = data.user.email ?? "";
  const currentDisplayName =
    (data.user.user_metadata?.displayName as string | undefined) ??
    email.split("@")[0] ??
    "";
  const errorMessage = ERROR_MESSAGES[params.error ?? ""];
  const updated = params.updated === "1";

  const { data: myPosts, error: postsError } = await supabase
    .from("posts")
    .select("id, title, created_at, views, likes")
    .eq("author_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (postsError) {
    console.error("Supabase posts fetch error:", postsError.message);
  }

  const postIds = (myPosts ?? []).map((post) => post.id);
  const { data: commentCounts, error: commentCountError } = await supabase
    .from("post_comments")
    .select("post_id")
    .in("post_id", postIds);

  if (commentCountError) {
    console.error("Supabase comments count error:", commentCountError.message);
  }

  const commentCountMap = new Map<number, number>();
  (commentCounts ?? []).forEach((row) => {
    const postId = Number(row.post_id);
    commentCountMap.set(postId, (commentCountMap.get(postId) ?? 0) + 1);
  });

  const { data: myComments, error: myCommentsError } = await supabase
    .from("post_comments")
    .select("id, content, created_at, post_id")
    .eq("author_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (myCommentsError) {
    console.error("Supabase comments fetch error:", myCommentsError.message);
  }

  const commentPostIds = Array.from(
    new Set((myComments ?? []).map((comment) => comment.post_id))
  ).filter((value) => Number.isFinite(Number(value)));

  const { data: commentPosts, error: commentPostsError } = await supabase
    .from("posts")
    .select("id, title")
    .in("id", commentPostIds);

  if (commentPostsError) {
    console.error("Supabase comment posts fetch error:", commentPostsError.message);
  }

  const commentPostTitleMap = new Map<number, string>();
  (commentPosts ?? []).forEach((post) => {
    commentPostTitleMap.set(post.id, post.title ?? "제목 없음");
  });

  const stats = {
    posts: myPosts?.length ?? 0,
    comments: myComments?.length ?? 0,
    likes: (myPosts ?? []).reduce(
      (sum, post) => sum + Number(post.likes ?? 0),
      0
    ),
    views: (myPosts ?? []).reduce(
      (sum, post) => sum + Number(post.views ?? 0),
      0
    ),
  };

  return (
    <MyPageClient
      displayName={currentDisplayName}
      email={email}
      joinedAt={data.user.created_at ?? null}
      errorMessage={errorMessage}
      updated={updated}
      posts={(myPosts ?? []).map((post) => ({
        id: post.id,
        title: post.title ?? "제목 없음",
        created_at: post.created_at,
        views: Number(post.views ?? 0),
        likes: Number(post.likes ?? 0),
        comments: commentCountMap.get(post.id) ?? 0,
      }))}
      comments={(myComments ?? []).map((comment) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        post_id: Number(comment.post_id),
        post_title: commentPostTitleMap.get(Number(comment.post_id)) ?? "게시글",
      }))}
      stats={stats}
    />
  );
}
