import { redirect } from "next/navigation";
import RequestsClient from "@/components/sections/requests_client";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type RequestsPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "제목은 2~80자, 내용은 4자 이상 입력해 주세요.",
  failed: "요청 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = ERROR_MESSAGES[params.error ?? ""];

  const supabase = getSupabaseServerClientReadOnly();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login?next=/requests");
  }

  const { data: recentReports, error: recentError } = await supabase
    .from("support_requests")
    .select("id, title, created_at, reply")
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentError) {
    console.error("Supabase support requests fetch error:", recentError.message);
  }

  return (
    <RequestsClient
      errorMessage={errorMessage}
      recentReports={recentReports ?? []}
    />
  );
}
