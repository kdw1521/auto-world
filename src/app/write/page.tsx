import { PenLine, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { redirect } from "next/navigation";

import { createPost } from "@/app/actions";
import { TiptapField } from "@/components/editor/tiptap-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(76,33,137,0.25),transparent_55%),radial-gradient(circle_at_85%_20%,rgba(190,120,255,0.22),transparent_55%),linear-gradient(180deg,rgba(252,248,255,0.98),rgba(245,238,255,0.98))]" />
        <div className="absolute inset-0 -z-10 opacity-40 bg-[linear-gradient(to_right,rgba(74,36,134,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,36,134,0.08)_1px,transparent_1px)] bg-size-[84px_84px]" />
        <div className="absolute -left-24 top-24 h-52 w-52 rounded-full bg-primary/25 blur-3xl animate-[pulse-glow_12s_ease-in-out_infinite]" />
        <div className="absolute right-16 top-16 h-20 w-20 rounded-full bg-primary/30 blur-2xl animate-[float-fast_7s_ease-in-out_infinite]" />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
          <section className="space-y-4">
            <Badge className="rounded-full bg-primary/10 text-primary">
              글쓰기
            </Badge>
            <h1 className="font-heading text-3xl font-semibold text-glow">
              사무 자동화 경험을 공유해 주세요.
            </h1>
            <p className="text-sm text-muted-foreground">
              다른 팀이 바로 적용할 수 있도록 구체적으로 적어 주세요.
            </p>
          </section>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="border-primary/15 bg-background/95 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  새 글 작성
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    {errorMessage}
                  </div>
                )}
                <form action={createPost} className="space-y-5">
                  <Input name="title" placeholder="제목" required />
                  <TiptapField name="content" />
                  <Button type="submit" className="w-full rounded-full">
                    글 올리기
                    <PenLine className="size-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-primary/20 bg-[linear-gradient(160deg,rgba(63,26,134,0.96),rgba(98,45,205,0.86))] text-white shadow-xl">
                <CardContent className="space-y-3 px-6 py-6 text-sm text-white/85">
                  <div className="flex items-center gap-3">
                    <Zap className="size-4" />
                    공유 전 체크 리스트
                  </div>
                  <div className="space-y-3">
                    {[
                      "자동화 배경과 문제를 먼저 설명해 주세요.",
                      "사용한 도구와 흐름을 단계별로 적어 주세요.",
                      "시간 절약, 승인 속도 등 결과를 수치로 공유해 주세요.",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 size-4" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-background/90">
                <CardContent className="space-y-3 px-6 py-6 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">공유 규칙</p>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 text-primary" />
                    <span>개인정보 없이 업무 흐름만 공유해 주세요.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 text-primary" />
                    <span>팀과 조직을 식별할 수 있는 정보는 제외합니다.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
