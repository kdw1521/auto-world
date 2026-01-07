import { notFound } from "next/navigation";

import NoticeDetailClient from "@/components/sections/notice_detail_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type NoticeDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

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
    <NoticeDetailClient
      title={notice.title ?? "제목 없음"}
      content={notice.content ?? "내용이 없습니다."}
      createdAt={notice.created_at}
      isPinned={Boolean(notice.is_pinned)}
    />
  );
}
