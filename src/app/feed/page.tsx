import FeedClient from "@/components/sections/feed_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

export default async function FeedPage() {
  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content_text, created_at, author_username, views, likes")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase posts fetch error:", error.message);
  }

  const postIds = (posts ?? []).map((post) => post.id);
  const likedPostIds = new Set<number>();

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

  return (
    <FeedClient posts={posts ?? []} likedPostIds={[...likedPostIds]} />
  );
}
