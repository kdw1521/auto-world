import FeedClient from "@/components/sections/feed_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

export default async function FeedPage() {
  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content_text, created_at, author_username, views, likes")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase posts fetch error:", error.message);
  }

  const postIds = (posts ?? []).map((post) => post.id);
  const commentCountByPostId = new Map<string, number>();
  const likedPostIds = new Set<number>();

  if (postIds.length > 0) {
    const { data: commentsData, error: commentsError } = await supabase
      .from("post_comments")
      .select("post_id")
      .in("post_id", postIds);

    if (commentsError) {
      console.error("Supabase post comments fetch error:", commentsError.message);
    }

    (commentsData ?? []).forEach((comment) => {
      const postId = String(comment.post_id);
      commentCountByPostId.set(
        postId,
        (commentCountByPostId.get(postId) ?? 0) + 1
      );
    });
  }

  if (user && postIds.length > 0) {
    const { data: likesData, error: likesError } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds);

    if (likesError) {
      console.error("Supabase post likes fetch error:", likesError.message);
    }

    (likesData ?? []).forEach((like) => {
      likedPostIds.add(Number(like.post_id));
    });
  }

  const viewPosts = (posts ?? []).map((post) => ({
    ...post,
    comments: commentCountByPostId.get(String(post.id)) ?? 0,
  }));

  return (
    <FeedClient posts={viewPosts} likedPostIds={[...likedPostIds]} />
  );
}
