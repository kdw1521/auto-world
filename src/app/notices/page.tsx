import Link from "next/link";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

function formatDate(value: string) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("YYYY.MM.DD");
}

function getExcerpt(value: string | null, maxLength = 140) {
  if (!value) {
    return "내용이 없습니다.";
  }
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength)}...`;
}

export default async function NoticesPage() {
  const supabase = getSupabaseServerClientReadOnly();
  const { data: notices, error } = await supabase
    .from("notices")
    .select("id, title, content, created_at, is_pinned")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase notices fetch error:", error.message);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge className="rounded-full bg-primary/10 text-primary">
              공지사항
            </Badge>
            <h1 className="mt-3 font-heading text-3xl font-semibold">
              최신 공지를 확인하세요.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              업데이트 소식과 운영 안내를 확인할 수 있습니다.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            홈으로
          </Link>
        </header>

        <div className="grid gap-4">
          {(notices ?? []).length === 0 ? (
            <Card className="border-dashed border-border/70 bg-background/95">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                아직 등록된 공지사항이 없습니다.
              </CardContent>
            </Card>
          ) : (
            notices?.map((notice) => (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="block"
                aria-label={`${notice.title} 공지 상세 보기`}
              >
                <Card className="border-border/70 bg-background/95 transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {notice.is_pinned && (
                          <Badge className="rounded-full">중요</Badge>
                        )}
                        <span>
                          {notice.created_at ? formatDate(notice.created_at) : ""}
                        </span>
                      </div>
                      <span>자세히 보기</span>
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {notice.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {getExcerpt(notice.content)}
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
