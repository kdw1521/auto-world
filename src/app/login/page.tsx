import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { signIn } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import LogInClient from "@/components/sections/logIn_client";

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
    <div className="min-h-screen bg-[#0C342C] flex items-center justify-center p-4">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, #E3EF26 1px, transparent 1px),
            linear-gradient(to bottom, #E3EF26 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <LogInClient>
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-3 mb-4">
            <Logo className="w-16 h-16" variant="professional" />
            <div>
              <h1 className="text-3xl font-bold text-[#E3EF26] mb-2">
                AutoWorld
              </h1>
              <p className="text-[#E3EF26]/60">Enterprise Automation Hub</p>
            </div>
          </div>
        </div>

        {/* 로그인 카드*/}
        <Card className="p-8 bg-[#164D42]/50 border-2 border-[#E3EF26]/30 rounded-none backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#E3EF26] mb-2">
              Welcome Back!
            </h2>
            <p className="text-[#E3EF26]/60 text-sm">
              로그인하고 10시간의 노가다를 탈출하세요
            </p>
          </div>

          {errorMessage && (
            <div className="border-2 border-[#CEF431]/30 bg-[#CEF431]/10 px-4 py-3">
              <p className="text-sm text-[#CEF431] font-medium">
                ⚠ {errorMessage}
              </p>
            </div>
          )}

          <form action={signIn} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <div>
              <label className="mb-2 block text-sm text-[#E3EF26]/90">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#E3EF26]/60" />
                <Input
                  name="email"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  required
                  className="h-12 rounded-none border-2 border-[#E3EF26]/30 bg-[#0C342C]/50 pl-12 text-[#E3EF26] placeholder:text-[#E3EF26]/40 focus:border-[#E3EF26] focus:ring-2 focus:ring-[#E3EF26]/20"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm text-[#E3EF26]/90">
                  Password
                </label>
                {/* <button
                  type="button"
                  className="text-xs text-[#E3EF26] transition-colors hover:text-[#E3EF26]/80"
                >
                  비밀번호를 잊으셨나요?
                </button> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#E3EF26]/60" />
                <Input
                  name="password"
                  type="password"
                  placeholder="패스워드를 입력해주세요"
                  required
                  className="h-12 rounded-none border-2 border-[#E3EF26]/30 bg-[#0C342C]/50 pl-12 text-[#E3EF26] placeholder:text-[#E3EF26]/40 focus:border-[#E3EF26] focus:ring-2 focus:ring-[#E3EF26]/20"
                />
              </div>
            </div>

            {/* Remember Me */}
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 border-2 border-[#E3EF26]/30 bg-[#0C342C] text-[#E3EF26] focus:ring-2 focus:ring-[#E3EF26]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-[#E3EF26]/80">
                Remember me for 30 days
              </label>
            </div> */}

            {/* Submit Button */}
            <SubmitButton
              className="h-12 w-full rounded-none bg-[#E3EF26] font-semibold text-[#0C342C] shadow-lg shadow-[#E3EF26]/20 hover:bg-[#E3EF26]/90"
              pendingText="로그인 중..."
            >
              로그인
              <ArrowRight className="ml-2 h-5 w-5" />
            </SubmitButton>
          </form>

          <p className="mt-4 text-center text-xs 음">
            {`로그인 후 글쓰기와 좋아요가 가능합니다 :)`}
          </p>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-[#E3EF26]/60">
            <button className="hover:text-[#E3EF26] transition-colors">
              Terms
            </button>
            <button className="hover:text-[#E3EF26] transition-colors">
              Privacy
            </button>
            <button className="hover:text-[#E3EF26] transition-colors">
              Help
            </button>
          </div>
          <p className="mt-4 text-xs text-[#E3EF26]/40">
            © 2026 AutoDev Professional. All rights reserved.
          </p>
        </div>
      </LogInClient>
    </div>
  );
}
