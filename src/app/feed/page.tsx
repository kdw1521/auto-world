import Link from "next/link";
import { ArrowUpRight, Eye, Heart } from "lucide-react";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LikeButton from "@/components/posts/like-button";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

const filters = ["최신", "인기", "승인/결재", "보고/정산", "업무툴 연동"];

function formatDate(value: string) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("YYYY.MM.DD");
}

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
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="space-y-3">
          <Badge className="rounded-full bg-primary/10 text-primary">
            전체 피드
          </Badge>
          <h1 className="font-heading text-3xl font-semibold md:text-4xl">
            최신 자동화 글을 모두 확인하세요.
          </h1>
          <p className="text-sm text-muted-foreground">
            최신순으로 정렬된 모든 글을 확인할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((label) => (
            <Badge key={label} variant="secondary" className="rounded-full">
              {label}
            </Badge>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(posts ?? []).length === 0 ? (
            <Card className="border-dashed border-border/70 bg-background/90">
              <CardContent className="space-y-3 px-6 py-8 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">아직 글이 없어요.</p>
                <p>첫 번째 자동화 경험을 공유해 주세요.</p>
                <Button asChild className="w-fit rounded-full">
                  <Link href={user ? "/write" : "/login?next=/write"}>
                    글쓰기 시작
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts?.map((post) => {
              const viewCountRaw = Number(post.views ?? 0);
              const viewCount = Number.isFinite(viewCountRaw) ? viewCountRaw : 0;
              const likeCountRaw = Number(post.likes ?? 0);
              const likeCount = Number.isFinite(likeCountRaw) ? likeCountRaw : 0;
              const isLiked = likedPostIds.has(post.id);

              return (
                <Card
                  key={post.id}
                  className="border-border/70 bg-background/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link
                    href={`/posts/${post.id}`}
                    prefetch={false}
                    className="block"
                    aria-label={`${post.title} 상세 보기`}
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author_username ?? "익명"}</span>
                        <span>
                          {post.created_at ? formatDate(post.created_at) : ""}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p className="line-clamp-3">
                        {post.content_text || "내용 미리보기가 없습니다."}
                      </p>
                    </CardContent>
                  </Link>
                  <CardFooter className="justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="size-4" />
                        <span>{viewCount}</span>
                      </div>
                      {user ? (
                        <LikeButton
                          postId={post.id}
                          initialLiked={isLiked}
                          initialCount={likeCount}
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Heart className="size-4 text-muted-foreground" />
                          <span>{likeCount}</span>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/posts/${post.id}`}
                      prefetch={false}
                      className="flex items-center gap-1"
                    >
                      <Badge variant="secondary" className="rounded-full">
                        상세 보기
                      </Badge>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
