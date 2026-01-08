import { unstable_cache } from "next/cache";
import FeedClient from "@/components/sections/feed_client";
import {
  getSupabaseServerClientPublic,
  getSupabaseServerClientReadOnly,
} from "@/lib/supabase/server";

type FeedPageProps = {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    sort?: string;
  }>;
};

type FeedSortKey = "latest" | "popular" | "views";

const DEFAULT_SORT: FeedSortKey = "latest";
const FEED_PAGE_SIZE = 2;
const FEED_REVALIDATE_SECONDS = 60;

type FeedPostRow = {
  id: number;
  title: string | null;
  content_text: string | null;
  created_at: string | null;
  author_username: string | null;
  views: number | null;
  likes: number | null;
  comments?: number | null;
};

function normalizeSearchQuery(value?: string) {
  if (!value) return "";
  return value.trim().replace(/,/g, " ");
}

function normalizeSort(value?: string): FeedSortKey {
  if (value === "popular" || value === "views" || value === "latest") {
    return value;
  }
  return DEFAULT_SORT;
}

const getCachedFeedData = unstable_cache(
  async ({
    page,
    searchQuery,
    sort,
  }: {
    page: number;
    searchQuery: string;
    sort: FeedSortKey;
  }) => {
    const supabase = getSupabaseServerClientPublic();
    const rangeStart = (page - 1) * FEED_PAGE_SIZE;
    const rangeEnd = rangeStart + FEED_PAGE_SIZE;

    let postsQuery = supabase
      .from("posts")
      .select(
        "id, title, content_text, created_at, author_username, views, likes"
      );

    if (searchQuery) {
      postsQuery = postsQuery.or(
        `title.ilike.%${searchQuery}%,content_text.ilike.%${searchQuery}%`
      );
    }

    if (sort === "popular") {
      postsQuery = postsQuery
        .order("likes", { ascending: false })
        .order("created_at", { ascending: false });
    } else if (sort === "views") {
      postsQuery = postsQuery
        .order("views", { ascending: false })
        .order("created_at", { ascending: false });
    } else {
      postsQuery = postsQuery.order("created_at", { ascending: false });
    }

    const { data: posts, error } = await postsQuery.range(
      rangeStart,
      rangeEnd
    );

    if (error) {
      console.error("Supabase posts fetch error:", error.message);
    }

    const pagePosts = (posts ?? []).slice(0, FEED_PAGE_SIZE);
    const hasNextPage = (posts ?? []).length > FEED_PAGE_SIZE;

    const postIds = pagePosts.map((post) => post.id);
    const commentCountByPostId = new Map<string, number>();

    if (postIds.length > 0) {
      const { data: commentsData, error: commentsError } = await supabase
        .from("post_comments")
        .select("post_id")
        .in("post_id", postIds);

      if (commentsError) {
        console.error(
          "Supabase post comments fetch error:",
          commentsError.message
        );
      }

      (commentsData ?? []).forEach((comment) => {
        const postId = String(comment.post_id);
        commentCountByPostId.set(
          postId,
          (commentCountByPostId.get(postId) ?? 0) + 1
        );
      });
    }

    const viewPosts: FeedPostRow[] = pagePosts.map((post) => ({
      ...post,
      comments: commentCountByPostId.get(String(post.id)) ?? 0,
    }));

    return { posts: viewPosts, hasNextPage };
  },
  ["feed"],
  { revalidate: FEED_REVALIDATE_SECONDS, tags: ["feed"] }
);

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const supabase = getSupabaseServerClientReadOnly();
  const params = (await searchParams) ?? {};
  const pageParam = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const searchQuery = normalizeSearchQuery(params.q);
  const sort = normalizeSort(params.sort);
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { posts: viewPosts, hasNextPage } = await getCachedFeedData({
    page,
    searchQuery,
    sort,
  });
  const hasPrevPage = page > 1;

  const postIds = viewPosts.map((post) => post.id);
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
    <FeedClient
      posts={viewPosts}
      likedPostIds={[...likedPostIds]}
      page={page}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      searchQuery={searchQuery}
      sort={sort}
    />
  );
}
