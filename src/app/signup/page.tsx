import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";
import SignUpClient from "@/components/sections/signUp_client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { Logo } from "@/components/ui/logo";
import { signUp } from "@/app/actions";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "이메일 형식을 확인해 주세요.",
  password: "비밀번호는 영문과 숫자를 모두 포함한 8자 이상이어야 합니다.",
  exists: "이미 가입된 계정입니다.",
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error ?? "";
  const nextPath = params.next ?? "";
  const errorMessage = ERROR_MESSAGES[error] ?? "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C342C] p-4">
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

      <SignUpClient>
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex flex-col items-center gap-3">
            <Logo className="h-16 w-16" variant="professional" />
            <div>
              <h1 className="mb-2 text-3xl font-bold text-[#E3EF26]">
                AutoWorld
              </h1>
              <p className="text-[#E3EF26]/60">Enterprise Automation Hub</p>
            </div>
          </div>
        </div>

        {/* 로그인 카드*/}
        <Card className="rounded-none border-2 border-[#E3EF26]/30 bg-[#164D42]/50 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-[#E3EF26]">
              Welcome AutoWorld!
            </h2>
            <p className="text-sm text-[#E3EF26]/60">
              혼자 머리 싸매지 마세요. 이제 함께 자동화합시다.
            </p>
          </div>

          {errorMessage ? (
            <div className="border-2 border-[#CEF431]/30 bg-[#CEF431]/10 px-4 py-3">
              <p className="text-sm font-medium text-[#CEF431]">
                ⚠ {errorMessage}
              </p>
            </div>
          ) : null}

          <form action={signUp} className="space-y-4">
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

            {/* Submit Button */}
            <SubmitButton
              className="h-12 w-full rounded-none bg-[#E3EF26] font-semibold text-[#0C342C] shadow-lg shadow-[#E3EF26]/20 hover:bg-[#E3EF26]/90"
              pendingText="가입 중..."
            >
              회원가입
              <ArrowRight className="ml-2 h-5 w-5" />
            </SubmitButton>
          </form>

          <p className="mt-4 text-center text-xs text-[#E3EF26]/60">
            로그인 후 글쓰기와 공감 기능을 이용할 수 있습니다.
          </p>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-[#E3EF26]/60">
            <button className="transition-colors hover:text-[#E3EF26]">
              Terms
            </button>
            <button className="transition-colors hover:text-[#E3EF26]">
              Privacy
            </button>
            <button className="transition-colors hover:text-[#E3EF26]">
              Help
            </button>
          </div>
          <p className="mt-4 text-xs text-[#E3EF26]/40">
            © 2026 AutoDev Professional. All rights reserved.
          </p>
        </div>
      </SignUpClient>
    </div>
  );
}
