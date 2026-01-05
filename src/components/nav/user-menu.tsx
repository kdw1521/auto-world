"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, PenLine, UserRound } from "lucide-react";

import { signOut } from "@/app/actions";
import { Button } from "@/components/ui/button";

type UserMenuProps = {
  displayName: string;
};

function getInitial(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "U";
  }
  return Array.from(trimmed)[0] ?? "U";
}

export default function UserMenu({ displayName }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initial = getInitial(displayName);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        open &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        type="button"
        className="h-9 w-9 rounded-full p-0 text-sm font-semibold"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${displayName} 메뉴`}
      >
        {initial}
      </Button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl border border-border/70 bg-background/95 p-2 shadow-lg">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            {displayName} 님
          </div>
          <div className="my-1 h-px bg-border/60" />
          <Link
            href="/write"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
          >
            <PenLine className="size-4 text-muted-foreground" />
            글쓰기
          </Link>
          <Link
            href="/mypage"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
          >
            <UserRound className="size-4 text-muted-foreground" />
            마이페이지
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
            >
              <LogOut className="size-4 text-muted-foreground" />
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
