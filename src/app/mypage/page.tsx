import Link from "next/link";
import { BadgeCheck, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

import { updateDisplayName } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("YYYY.MM.DD");
}

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
  const { data: supportRequests, error: supportError } = await supabase
    .from("support_requests")
    .select("id, title, content, reply, replied_at, created_at")
    .eq("author_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (supportError) {
    console.error("Supabase support requests fetch error:", supportError.message);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(76,33,137,0.3),_transparent_55%),radial-gradient(circle_at_85%_15%,_rgba(190,120,255,0.24),_transparent_55%),linear-gradient(180deg,_rgba(252,248,255,0.98),_rgba(245,238,255,0.98))]" />
        <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(74,36,134,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,36,134,0.08)_1px,transparent_1px)] [background-size:84px_84px]" />
        <div className="absolute -left-20 top-28 h-48 w-48 rounded-full bg-primary/25 blur-3xl animate-[pulse-glow_10s_ease-in-out_infinite]" />
        <div className="absolute right-12 top-20 h-20 w-20 rounded-full bg-primary/30 blur-2xl animate-[float-fast_7s_ease-in-out_infinite]" />

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
          <div className="space-y-3 text-center">
            <Badge className="rounded-full bg-primary/10 text-primary">
              닉네임 변경
            </Badge>
            <h1 className="font-heading text-3xl font-semibold text-glow">
              커뮤니티 닉네임을 바꿔보세요.
            </h1>
            <p className="text-sm text-muted-foreground">
              글과 피드에서 보이는 이름만 바뀌며, 이메일은 공개되지 않습니다.
            </p>
          </div>

          <Card className="border-primary/15 bg-background/95 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">닉네임 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {updated && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  닉네임이 변경되었습니다.
                </div>
              )}
              {errorMessage && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {errorMessage}
                </div>
              )}
              <div className="rounded-xl border border-primary/15 bg-primary/5 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <UserRound className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      현재 닉네임
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentDisplayName}
                    </p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                </div>
              </div>
              <form action={updateDisplayName} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="displayName"
                    className="text-sm font-semibold text-foreground"
                  >
                    새 닉네임
                  </label>
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="닉네임을 입력해 주세요"
                    defaultValue={currentDisplayName}
                    autoComplete="nickname"
                    minLength={1}
                    maxLength={24}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BadgeCheck className="size-4 text-primary" />
                  1~24자 사이로 입력해 주세요. 공백과 이모지도 사용 가능합니다.
                </div>
                <Button type="submit" className="w-full rounded-full">
                  닉네임 저장
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                닉네임 변경은 새로 작성하는 글부터 적용됩니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-background/95">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl font-semibold">
                  내 요청/버그
                </CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/requests">요청 등록</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                운영자 답변은 아래에서 확인할 수 있습니다.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {(supportRequests ?? []).length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 px-5 py-6 text-sm text-muted-foreground">
                  아직 등록한 요청이 없습니다.
                </div>
              ) : (
                supportRequests?.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-border/70 bg-background/90 px-5 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {request.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                      <Badge
                        variant={request.reply ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {request.reply ? "답변 완료" : "대기중"}
                      </Badge>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                      {request.content}
                    </p>
                    {request.reply ? (
                      <div className="mt-4 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                          답변
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                          {request.reply}
                        </p>
                        {request.replied_at && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            답변일 {formatDate(request.replied_at)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-muted-foreground">
                        답변 대기 중입니다.
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
