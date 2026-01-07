import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import dayjs from "dayjs";
import HeroSection from "@/components/sections/hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Posts from "@/components/ui/posts";
import { Separator } from "@/components/ui/separator";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import SearchBar from "@/components/ui/searchbar";
import CategoriesBar from "@/components/ui/categoriesbar";
import SiteFooter from "@/components/sections/site-footer";

function estimateReadTime(text?: string | null) {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export default async function Home() {
  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const currentYear = new Date().getFullYear();
  const weekStart = dayjs().startOf("week").toISOString();
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, title, content_text, created_at, author_username, views, likes"
    )
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Supabase posts fetch error:", error.message);
  }

  const { count: weeklyPostCount, error: weeklyPostError } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .gte("created_at", weekStart);

  const { count: totalPostCount, error: totalPostError } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  if (weeklyPostError) {
    console.error(
      "Supabase weekly posts count error:",
      weeklyPostError.message
    );
  }

  if (totalPostError) {
    console.error("Supabase total posts count error:", totalPostError.message);
  }

  const { data: likesSumData, error: likesSumError } = await supabase
    .from("posts")
    .select("likes");

  if (likesSumError) {
    console.error("Supabase likes sum error:", likesSumError.message);
  }

  const likeTotal = (likesSumData ?? []).reduce(
    (sum, row) => sum + Number(row.likes ?? 0),
    0
  );

  const { count: commentCount, error: commentError } = await supabase
    .from("post_comments")
    .select("id", { count: "exact", head: true });

  if (commentError) {
    console.error("Supabase comment count error:", commentError.message);
  }

  const stats = [
    {
      label: "이번주 피드 올라온 개수",
      value: (weeklyPostCount ?? 0).toLocaleString("ko-KR"),
    },
    {
      label: "좋아요 수",
      value: likeTotal.toLocaleString("ko-KR"),
    },
    {
      label: "댓글 수",
      value: (commentCount ?? 0).toLocaleString("ko-KR"),
    },
  ];

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

  const viewPosts = (posts ?? []).map((post) => {
    const viewCountRaw = Number(post.views ?? 0);
    const viewCount = Number.isFinite(viewCountRaw) ? viewCountRaw : 0;
    const likeCountRaw = Number(post.likes ?? 0);
    const likeCount = Number.isFinite(likeCountRaw) ? likeCountRaw : 0;
    const authorName = post.author_username ?? "익명";
    const initial =
      authorName.trim().charAt(0).toUpperCase() || "A";
    const excerptSource = post.content_text ?? "";
    const excerpt =
      excerptSource.length > 160
        ? `${excerptSource.slice(0, 157)}...`
        : excerptSource || "내용 미리보기가 없습니다.";

    return {
      id: post.id,
      title: post.title ?? "제목 없음",
      excerpt,
      category: "피드",
      verified: false,
      readTime: estimateReadTime(post.content_text),
      tags: [],
      author: {
        name: authorName,
        role: undefined,
        initial,
      },
      likes: likeCount,
      comments: 0,
      views: viewCount,
      href: `/posts/${post.id}`,
    };
  });

  const sidebarStats = [
    { label: "전체 게시글", value: (totalPostCount ?? 0).toLocaleString("ko-KR") },
    { label: "이번주 게시글", value: (weeklyPostCount ?? 0).toLocaleString("ko-KR") },
    { label: "총 좋아요", value: likeTotal.toLocaleString("ko-KR") },
    { label: "총 댓글", value: (commentCount ?? 0).toLocaleString("ko-KR") },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
          <section className=" gap-8 ">
            <HeroSection />
            <SearchBar />
            <CategoriesBar />
          </section>
        </div>

      </div>

      <section id="feed" className="mx-auto w-full max-w-6xl px-6 -mt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {viewPosts.length === 0 ? (
              <Card className="border-dashed border-border/70 bg-background/90">
                <CardContent className="space-y-3 px-6 py-8 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    아직 글이 없어요.
                  </p>
                  <p>첫 번째 자동화 경험을 공유해 주세요.</p>
                  <Button asChild className="w-fit rounded-full">
                    <Link href={user ? "/write" : "/login?next=/write"}>
                      글쓰기 시작
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Posts posts={viewPosts} likedPostIds={[...likedPostIds]} />
            )}
          </div>

          <aside className="relative z-10">
            <Card className="rounded-none border-2 border-[#CEF431]/20 bg-[#161514]/40 p-6 shadow-lg shadow-[#03D26F]/10">
              <h3 className="mb-6 text-lg font-bold tracking-tight text-[#CEF431]">
                커뮤니티 현황
              </h3>

              {/* Stats Grid */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {sidebarStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center border border-[#CEF431]/10 bg-[#014651]/30 p-3 text-center"
                  >
                    <span className="mb-1 text-xl font-mono font-bold text-[#CEF431]">
                      {stat.value}
                    </span>
                    <span className="text-xs text-[#EAF4F4]/60">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="mb-4 h-px bg-[#CEF431]/20" />

              {/* Login Notice */}
              <div className="border border-[#CEF431]/30 bg-[#CEF431]/5 px-4 py-3 cursor-pointer">
                <Button className="text-center text-sm text-[#CEF431]/80">
                  로그인하지 않으면 글을 쓸 수 없습니다.
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </section >
    </div >
  );
}
