import { redirect } from "next/navigation";

import { submitSupportRequest } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <header className="space-y-3">
          <Badge className="rounded-full bg-primary/10 text-primary">
            버그/요청
          </Badge>
          <h1 className="font-heading text-3xl font-semibold">
            불편한 점이나 개선 요청을 알려주세요.
          </h1>
          <p className="text-sm text-muted-foreground">
            답변은 마이페이지에서 확인할 수 있습니다.
          </p>
        </header>

        <Card className="border-border/70 bg-background/95">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">요청 등록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {errorMessage}
              </div>
            )}
            <form action={submitSupportRequest} className="space-y-4">
              <Input
                name="title"
                placeholder="제목"
                minLength={2}
                maxLength={80}
                required
              />
              <Textarea
                name="content"
                placeholder="내용을 입력해 주세요"
                className="min-h-[180px]"
                minLength={4}
                maxLength={4000}
                required
              />
              <Button type="submit" className="w-full rounded-full">
                요청 보내기
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              작성한 요청은 본인만 볼 수 있으며, 운영자 답변이 등록되면
              마이페이지에 표시됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
