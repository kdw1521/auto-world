import Link from "next/link";

import MobileMenu from "@/components/nav/mobile-menu";
import UserMenu from "@/components/nav/user-menu";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

export default async function SiteHeader() {
  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const displayName =
    (user?.user_metadata?.displayName as string | undefined) ??
    user?.email?.split("@")[0] ??
    "익명";

  return (
    <div className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="홈으로"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground"
          >
            AW
          </Link>
          <div>
            <p className="text-sm font-semibold tracking-tight">AutoWorld</p>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              자동화 커뮤니티
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link className="hover:text-foreground" href="/feed">
            피드
          </Link>
          <Link className="hover:text-foreground" href="/notices">
            공지사항
          </Link>
          {user && (
            <Link className="hover:text-foreground" href="/requests">
              버그/요청
            </Link>
          )}
          <Link className="hover:text-foreground" href="/#guide">
            공유 가이드
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <MobileMenu
            isAuthenticated={Boolean(user)}
            displayName={displayName}
          />
          {user ? (
            <div className="hidden md:block">
              <UserMenu displayName={displayName} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild className="rounded-full px-5" size="sm">
                <Link href="/signup">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
