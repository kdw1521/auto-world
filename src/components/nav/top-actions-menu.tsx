"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Mail, PenLine, ScreenShare } from "lucide-react";
import { usePathname } from "next/navigation";

import { submitInquiry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

export default function TopActionsMenu() {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  useEffect(() => {
    if (!open) {
      setShowForm(false);
    }
  }, [open]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-5 right-5 z-50 md:bottom-6 md:right-6"
    >
      <div className="flex flex-col items-center gap-3">
        <Button
          asChild
          className="h-12 w-12 rounded-full p-0 shadow-lg shadow-primary/30"
          aria-label="글쓰기"
        >
          <Link href="/write">
            <PenLine className="size-5" />
          </Link>
        </Button>

        <Button
          type="button"
          className="h-12 w-12 rounded-full p-0 shadow-lg shadow-primary/30"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="빠른 메뉴"
        >
          <ScreenShare className="size-5" />
        </Button>
      </div>

      {open && (
        <div className="absolute bottom-28 right-0 z-50 w-72 rounded-2xl border border-border/70 bg-background/95 p-4 shadow-lg">
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleScrollTop}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
            >
              <span>상단이동</span>
              <ArrowUp className="size-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
            >
              <span>문의하기</span>
              <Mail className="size-4 text-muted-foreground" />
            </button>
          </div>

          {showForm && (
            <form action={submitInquiry} className="mt-4 space-y-3">
              <input type="hidden" name="redirectTo" value={pathname} />
              <Input
                name="email"
                type="email"
                placeholder="이메일"
                autoComplete="email"
                maxLength={254}
                required
              />
              <Textarea
                name="message"
                placeholder="문의 내용을 입력해 주세요"
                className="min-h-30"
                minLength={4}
                maxLength={2000}
                required
              />
              <p className="text-xs text-muted-foreground">
                이메일은 문의 응대 외의 어떠한 용도로도 사용되지 않습니다.
              </p>
              <SubmitButton className="w-full rounded-full" pendingText="전송 중...">
                문의 보내기
              </SubmitButton>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
