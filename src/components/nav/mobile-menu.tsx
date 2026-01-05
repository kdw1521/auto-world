"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Menu, PenLine, UserRound, X } from "lucide-react";

import { signOut } from "@/app/actions";
import { Button } from "@/components/ui/button";

type MobileMenuProps = {
  isAuthenticated: boolean;
  displayName?: string;
};

const NAV_LINKS = [
  { href: "/feed", label: "피드" },
  { href: "/notices", label: "공지사항" },
  { href: "/#guide", label: "공유 가이드" },
];

export default function MobileMenu({
  isAuthenticated,
  displayName,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleClose = () => setOpen(false);

  return (
    <div className="relative md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="메뉴"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/requests"
                  onClick={handleClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  버그/요청
                </Link>
              )}
            </div>

            <div className="my-3 h-px bg-border/60" />

            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs text-muted-foreground">
                  {displayName ?? "사용자"} 님
                </div>
                <Link
                  href="/write"
                  onClick={handleClose}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  <PenLine className="size-4 text-muted-foreground" />
                  글쓰기
                </Link>
                <Link
                  href="/mypage"
                  onClick={handleClose}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  <UserRound className="size-4 text-muted-foreground" />
                  마이페이지
                </Link>
                <form action={signOut} onSubmit={handleClose}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                  >
                    <LogOut className="size-4 text-muted-foreground" />
                    로그아웃
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid gap-2 px-1">
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                >
                  <Link href="/login" onClick={handleClose}>
                    로그인
                  </Link>
                </Button>
                <Button asChild className="justify-start rounded-full">
                  <Link href="/signup" onClick={handleClose}>
                    회원가입
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
