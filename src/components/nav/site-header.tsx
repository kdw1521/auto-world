import Link from "next/link";
import MobileMenu from "@/components/nav/mobile-menu";
import UserMenu from "@/components/nav/user-menu";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import { Logo } from "../ui/logo";

export default async function SiteHeader() {
  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const displayName =
    (user?.user_metadata?.displayName as string | undefined) ??
    user?.email?.split("@")[0] ??
    "익명";

  return (
    <header className="sticky top-0 z-50 bg-[#014651]/90 backdrop-blur-xl border-b border-[#CEF431]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href='/' className="flex items-center gap-4">
            <div className="relative">
              <Logo className="w-12 h-12" variant="professional" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CEF431] animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-[#CEF431] tracking-tight">AutoWorld</h1>
              <p className="text-xs text-[#CEF431]/60">Enterprise Automation Hub</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/feed"
              className="text-sm text-[#CEF431]/80 hover:text-[#CEF431] transition-colors"
            >
              피드
            </Link>
            <Link
              href="/notices"
              className="text-sm text-[#CEF431]/80 hover:text-[#CEF431] transition-colors"
            >
              공지 사항
            </Link>
            <Link
              href="/requests"
              className="text-sm text-[#CEF431]/80 hover:text-[#CEF431] transition-colors"
            >
              버그 리포트
            </Link>
            <Link
              href="/guide"
              className="text-sm text-[#CEF431]/80 hover:text-[#CEF431] transition-colors"
            >
              가이드
            </Link>
            {user ? (
              <UserMenu displayName={displayName} />
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">로그인</Link>
                </Button>
                <Button asChild className="rounded-full px-5" size="sm">
                  <Link href="/signup">회원가입</Link>
                </Button>
              </div>
            )}
          </nav>
          <MobileMenu
            isAuthenticated={Boolean(user)}
            displayName={displayName}
          />
        </div>
      </div>
    </header>
  );
}
