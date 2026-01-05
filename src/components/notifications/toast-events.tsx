"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const EVENTS = [
  {
    key: "posted",
    message: "글이 등록되었습니다. 공유해 주셔서 고마워요!",
  },
  {
    key: "updated",
    message: "닉네임이 저장되었습니다.",
  },
  {
    key: "welcome",
    message: "가입이 완료되었습니다. 첫 번째 글을 올려보세요.",
  },
  {
    key: "edited",
    message: "글이 수정되었습니다.",
  },
  {
    key: "login",
    message: "로그인되었습니다. 이제 글을 작성할 수 있어요.",
  },
  {
    key: "logout",
    message: "로그아웃되었습니다.",
  },
  {
    key: "inquiry",
    message: "문의가 접수되었습니다. 빠르게 답변드릴게요.",
  },
  {
    key: "inquiry_error",
    message: "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  },
  {
    key: "request",
    message: "요청이 등록되었습니다. 답변은 마이페이지에서 확인해 주세요.",
  },
  {
    key: "commented",
    message: "댓글이 등록되었습니다.",
  },
  {
    key: "comment_updated",
    message: "댓글이 수정되었습니다.",
  },
];

export default function ToastEvents() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const event = EVENTS.find((item) => params.has(item.key));

    if (!event) {
      return;
    }

    toast(event.message);

    EVENTS.forEach((item) => params.delete(item.key));
    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}
