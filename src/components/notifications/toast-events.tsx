"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  LogIn,
  LogOut,
  Mail,
  MessageCircle,
  Pencil,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const EVENTS = [
  {
    key: "posted",
    message: "글이 등록되었습니다. 공유해 주셔서 고마워요!",
    type: "success",
    icon: <Send className="h-5 w-5" />,
  },
  {
    key: "updated",
    message: "닉네임이 저장되었습니다.",
    type: "success",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    key: "welcome",
    message: "가입이 완료되었습니다. 첫 번째 글을 올려보세요.",
    type: "success",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    key: "email_sent",
    message:
      "적어주신 이메일을 확인해주세요. Supabase Auth로 발송되었을거에요.",
    type: "info",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    key: "email_already_sent",
    message: "이미 이메일이 발송되었습니다. 메일함을 확인해 주세요.",
    type: "info",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    key: "signup_exists",
    message: "이미 가입된 계정입니다.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "email_not_confirmed",
    message: "가입 하신 이메일의 메일함을 확인해주세요.",
    type: "info",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    key: "invalid_credentials",
    message: "이메일 또는 비밀번호를 확인해 주세요.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "user_banned",
    message: "접근이 제한된 계정입니다. 관리자에게 문의해 주세요.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "login_provider_disabled",
    message: "현재 로그인이 비활성화되어 있습니다.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "weak_password",
    message: "비밀번호가 너무 약합니다. 다른 비밀번호를 사용해 주세요.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "email_invalid",
    message: "이메일 형식을 확인해 주세요.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "email_not_allowed",
    message: "사용할 수 없는 이메일입니다.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "rate_limited",
    message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    type: "warning",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    key: "signup_disabled",
    message: "현재 회원가입이 비활성화되어 있습니다.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "captcha_failed",
    message: "보안 확인에 실패했습니다. 다시 시도해 주세요.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "edited",
    message: "글이 수정되었습니다.",
    type: "success",
    icon: <Pencil className="h-5 w-5" />,
  },
  {
    key: "login",
    message: "로그인되었습니다. 이제 글을 작성할 수 있어요.",
    type: "success",
    icon: <LogIn className="h-5 w-5" />,
  },
  {
    key: "logout",
    message: "로그아웃되었습니다.",
    type: "warning",
    icon: <LogOut className="h-5 w-5" />,
  },
  {
    key: "inquiry",
    message: "문의가 접수되었습니다. 빠르게 답변드릴게요.",
    type: "success",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    key: "inquiry_error",
    message: "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    type: "error",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    key: "request",
    message: "요청이 등록되었습니다. 답변은 마이페이지에서 확인해 주세요.",
    type: "info",
    icon: <Info className="h-5 w-5" />,
  },
  {
    key: "commented",
    message: "댓글이 등록되었습니다.",
    type: "success",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    key: "comment_updated",
    message: "댓글이 수정되었습니다.",
    type: "info",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
] as const;

export default function ToastEvents() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const event = EVENTS.find((item) => params.has(item.key));

    if (!event) {
      return;
    }

    const options = { icon: event.icon };
    switch (event.type) {
      case "success":
        toast.success(event.message, options);
        break;
      case "error":
        toast.error(event.message, options);
        break;
      case "warning":
        toast.warning(event.message, options);
        break;
      case "info":
      default:
        toast.info(event.message, options);
        break;
    }

    EVENTS.forEach((item) => params.delete(item.key));
    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [pathname, search]);

  return null;
}
