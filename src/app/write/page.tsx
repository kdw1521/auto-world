import { redirect } from "next/navigation";

import WriteClient from "@/components/sections/write_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type WritePageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  required: "제목과 내용을 모두 입력해 주세요.",
  failed: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export default async function WritePage({ searchParams }: WritePageProps) {
  const params = (await searchParams) ?? {};
  const supabase = getSupabaseServerClientReadOnly();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login?next=/write");
  }

  const errorMessage = ERROR_MESSAGES[params.error ?? ""];

  return <WriteClient errorMessage={errorMessage} />;
}
