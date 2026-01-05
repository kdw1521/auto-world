import Link from "next/link";
import { notFound } from "next/navigation";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type NoticeDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("YYYY.MM.DD");
}

export default async function NoticeDetail({ params }: NoticeDetailProps) {
  const { id } = await params;
  const noticeId = Number(id);

  if (!Number.isFinite(noticeId)) {
    notFound();
  }

  const supabase = getSupabaseServerClientReadOnly();
  const { data: notice, error } = await supabase
    .from("notices")
    .select("id, title, content, created_at, is_pinned")
    .eq("id", noticeId)
    .single();

  if (error || !notice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-primary/10 text-primary">
              공지사항
            </Badge>
            {notice.is_pinned && <Badge className="rounded-full">중요</Badge>}
          </div>
          <Link
            href="/notices"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            목록으로
          </Link>
        </header>

        <div className="space-y-3">
          <h1 className="font-heading text-3xl font-semibold leading-tight md:text-4xl">
            {notice.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {notice.created_at ? formatDate(notice.created_at) : ""}
          </p>
        </div>

        <Card className="border-border/70 bg-background/95">
          <CardContent className="space-y-4 px-6 py-6 text-sm text-foreground">
            <div className="whitespace-pre-wrap">{notice.content}</div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center gap-3">
          <Link
            href="/notices"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            공지 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
