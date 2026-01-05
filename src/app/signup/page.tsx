import Link from "next/link";
import {
  BadgeCheck,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { signUp } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "이메일 형식을 확인해 주세요.",
  password: "비밀번호는 영문과 숫자를 모두 포함한 8자 이상이어야 합니다.",
  exists: "이미 사용 중인 이메일입니다.",
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = ERROR_MESSAGES[params.error ?? ""];
  const nextPath = params.next ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(76,33,137,0.3),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(190,120,255,0.24),transparent_55%),linear-gradient(180deg,rgba(252,248,255,0.98),rgba(245,238,255,0.98))]" />
        <div className="absolute inset-0 -z-10 opacity-40 bg-[linear-gradient(to_right,rgba(74,36,134,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,36,134,0.08)_1px,transparent_1px)] bg-size-[84px_84px]" />
        <div className="absolute -left-20 top-32 h-48 w-48 rounded-full bg-primary/25 blur-3xl animate-[pulse-glow_10s_ease-in-out_infinite]" />
        <div className="absolute right-12 top-20 h-20 w-20 rounded-full bg-primary/30 blur-2xl animate-[float-fast_7s_ease-in-out_infinite]" />

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <Badge className="w-fit rounded-full bg-primary/10 text-primary">
              회원가입
            </Badge>
            <h1 className="font-heading text-3xl font-semibold leading-tight text-glow md:text-4xl">
              자동화 경험을
              <br />
              함께 나눌 준비가 되셨나요?
            </h1>
            <p className="text-sm text-muted-foreground">
              이메일과 비밀번호만 받습니다. 개인정보 없이 안전하게 참여할 수
              있어요.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: HeartHandshake,
                  title: "공감 기반",
                  description: "실무 경험에 대한 공감을 나눕니다.",
                },
                {
                  icon: Sparkles,
                  title: "실전 흐름",
                  description: "바로 적용 가능한 워크플로우를 모읍니다.",
                },
                {
                  icon: BadgeCheck,
                  title: "검증된 사례",
                  description: "사무업무에 특화된 자동화만 공유합니다.",
                },
                {
                  icon: ShieldCheck,
                  title: "프라이버시",
                  description: "이메일 외 추가 정보는 받지 않습니다.",
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
              이미 계정이 있나요?{" "}
              <Link className="font-semibold text-foreground" href="/login">
                로그인
              </Link>
            </p>
          </section>

          <Card className="border-primary/15 bg-background/95 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">회원가입</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {errorMessage}
                </div>
              )}
              <form action={signUp} className="space-y-4">
                <input type="hidden" name="next" value={nextPath} />
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  영문과 숫자를 모두 포함한 8자 이상 비밀번호를 사용해 주세요.
                </p>
                <SubmitButton className="w-full rounded-full" pendingText="가입 중...">
                  회원가입
                </SubmitButton>
              </form>
              <p className="text-xs text-muted-foreground">
                가입 후 이메일 확인을 완료하면 바로 글쓰기를 시작할 수 있어요.
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
