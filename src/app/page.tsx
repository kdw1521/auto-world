import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Eye, Heart, Lock } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

const topics = [
  "결재 자동화",
  "보고서 자동화",
  "문서 정리",
  "회계/정산",
  "인사/총무",
  "CS 대응",
];

function formatDate(value: string) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("YYYY.MM.DD");
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
    .limit(12);

  if (error) {
    console.error("Supabase posts fetch error:", error.message);
  }

  const { count: weeklyPostCount, error: weeklyPostError } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .gte("created_at", weekStart);

  if (weeklyPostError) {
    console.error(
      "Supabase weekly posts count error:",
      weeklyPostError.message
    );
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(251,247,255,0.98),rgba(244,239,255,0.96))]" />
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10">
          <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <Badge className="w-fit rounded-full bg-primary/10 text-primary">
                사무 자동화 공유 커뮤니티
              </Badge>
              <h1 className="font-heading text-4xl font-semibold leading-tight md:text-5xl">
                사무업무 자동화를 공유하고 공감받는 공간.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                본인이 자동화한 흐름을 올리고, 다른 팀의 경험에 공감하는
                커뮤니티입니다. 이메일과 비밀번호만으로 참여합니다.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {user ? (
                  <Button asChild size="lg" className="rounded-full px-7">
                    <Link href="/write">
                      지금 글쓰기
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="rounded-full px-7">
                    <Link href="/login?next=/write">
                      로그인 후 글쓰기
                      <Lock className="size-4" />
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-7"
                >
                  <Link href="/feed">최신 글 보기</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-background/95 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(75,29,149,0.12),transparent_58%)]" />
                <Image
                  src="/hero-automation.svg"
                  alt="사무 자동화 커뮤니티를 표현한 일러스트"
                  width={960}
                  height={720}
                  priority
                  className="relative h-auto w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-foreground shadow-sm backdrop-blur">
                  <p className="font-semibold">업무 자동화 흐름 한눈에</p>
                  <p className="text-xs text-muted-foreground">
                    공감 포인트와 실행 팁을 함께 기록해요.
                  </p>
                </div>
              </div>
              <Card className="border-border/70 bg-background/95">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    커뮤니티 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between"
                    >
                      <span>{stat.label}</span>
                      <span className="text-base font-semibold text-foreground">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-foreground">
                    로그인하지 않으면 글을 쓸 수 없습니다.
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <section id="feed" className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full">피드</Badge>
            <h2 className="mt-4 font-heading text-3xl font-semibold md:text-4xl">
              사무업무 자동화 이야기
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <p className="max-w-xl text-base text-muted-foreground">
              현실적인 업무 흐름과 자동화 팁을 공유하는 공간입니다.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Link href="/feed">전체 보기</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["최신", "인기", "승인/결재", "보고/정산", "업무툴 연동"].map(
            (label) => (
              <Badge key={label} variant="secondary" className="rounded-full">
                {label}
              </Badge>
            )
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {(posts ?? []).length === 0 ? (
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
            posts?.map((post) => {
              const viewCountRaw = Number(post.views ?? 0);
              const viewCount = Number.isFinite(viewCountRaw)
                ? viewCountRaw
                : 0;
              const likeCountRaw = Number(post.likes ?? 0);
              const likeCount = Number.isFinite(likeCountRaw)
                ? likeCountRaw
                : 0;
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
                      <p>{post.content_text || "내용 미리보기가 없습니다."}</p>
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
      </section>

      <section id="guide" className="mx-auto w-full max-w-5xl px-6 pb-16">
        <Card className="border-border/70 bg-background/95">
          <CardContent className="space-y-4 px-6 py-6 text-sm text-muted-foreground">
            <div>
              <Badge className="rounded-full">공유 가이드</Badge>
              <h3 className="mt-4 font-heading text-2xl font-semibold text-foreground">
                공감받는 자동화 글을 남기는 법
              </h3>
            </div>
            {[
              "업무 맥락과 문제를 먼저 설명해 주세요.",
              "자동화 흐름과 사용 도구를 단계별로 적어 주세요.",
              "결과를 수치와 함께 공유해 주세요.",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-base font-semibold text-foreground">
                  {index + 1}.
                </span>
                <p>{item}</p>
              </div>
            ))}
            <Separator />
            <Button asChild variant="outline" className="w-fit rounded-full">
              <Link href={user ? "/write" : "/login?next=/write"}>
                글쓰기 바로가기
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/60 bg-background/90">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-xs font-semibold text-primary-foreground">
              AW
            </div>
            <span>AutoWorld 자동화 커뮤니티</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link className="hover:text-foreground" href="/write">
              글쓰기
            </Link>
            <span>© {currentYear} AutoWorld. 모든 권리 보유.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
