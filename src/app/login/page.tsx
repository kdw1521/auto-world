import Link from "next/link";
import { Lock, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";

import { signIn } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "이메일 또는 비밀번호를 확인해 주세요.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = ERROR_MESSAGES[params.error ?? ""];
  const nextPath = params.next ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(76,33,137,0.3),_transparent_55%),radial-gradient(circle_at_85%_15%,_rgba(190,120,255,0.24),_transparent_55%),linear-gradient(180deg,_rgba(252,248,255,0.98),_rgba(245,238,255,0.98))]" />
        <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(74,36,134,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,36,134,0.08)_1px,transparent_1px)] [background-size:84px_84px]" />
        <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-[pulse-glow_10s_ease-in-out_infinite]" />
        <div className="absolute right-10 top-16 h-24 w-24 rounded-full bg-primary/30 blur-2xl animate-[float-fast_7s_ease-in-out_infinite]" />

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <Badge className="w-fit rounded-full bg-primary/10 text-primary">
              로그인
            </Badge>
            <h1 className="font-heading text-3xl font-semibold leading-tight text-glow md:text-4xl">
              자동화 경험을 나누는
              <br />
              커뮤니티로 돌아오세요.
            </h1>
            <p className="text-sm text-muted-foreground">
              로그인 후 글쓰기와 공감을 바로 시작할 수 있어요.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: MessageSquareText,
                  title: "실전 노하우",
                  description: "실제 사무 자동화 흐름을 확인하세요.",
                },
                {
                  icon: Sparkles,
                  title: "공감 중심",
                  description: "좋았던 자동화를 공감으로 남깁니다.",
                },
                {
                  icon: ShieldCheck,
                  title: "개인정보 최소",
                  description: "이메일 외 정보는 받지 않습니다.",
                },
                {
                  icon: Lock,
                  title: "안전한 로그인",
                  description: "Supabase 이메일 로그인 사용.",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="border-border/70 bg-background/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardContent className="space-y-2 px-4 py-4">
                    <item.icon className="size-5 text-primary" />
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              아직 계정이 없나요?{" "}
              <Link className="font-semibold text-foreground" href="/signup">
                회원가입
              </Link>
            </p>
          </section>

          <Card className="border-primary/15 bg-background/95 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">로그인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {errorMessage}
                </div>
              )}
              <form action={signIn} className="space-y-4">
                <input type="hidden" name="next" value={nextPath} />
                <Input name="email" type="email" placeholder="이메일" required />
                <Input
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  required
                />
                <SubmitButton className="w-full rounded-full" pendingText="로그인 중...">
                  로그인
                </SubmitButton>
              </form>
              <p className="text-xs text-muted-foreground">
                로그인 후 글쓰기와 공감 기능을 이용할 수 있습니다.
              </p>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
