import { redirect, notFound } from "next/navigation";

import EditPostClient from "@/components/sections/edit_post_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type EditPostProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  required: "제목과 내용을 모두 입력해 주세요.",
  failed: "수정에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export default async function EditPost({ params, searchParams }: EditPostProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const errorMessage = ERROR_MESSAGES[resolvedSearchParams.error ?? ""];

  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect(`/login?next=/posts/${postId}/edit`);
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, author_id")
    .eq("id", postId)
    .single();

  if (error || !post) {
    notFound();
  }

  if (post.author_id !== userData.user.id) {
    redirect(`/posts/${postId}`);
  }

  return (
    <EditPostClient
      postId={postId}
      defaultTitle={post.title ?? ""}
      defaultContent={post.content ?? ""}
      errorMessage={errorMessage}
    />
  );
}
