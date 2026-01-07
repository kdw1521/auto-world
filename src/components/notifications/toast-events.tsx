"use client";

import { useEffect } from "react";
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
    message: "메일이 발송되었습니다! 메일함을 확인해주세요 :)",
    type: "info",
    icon: <Mail className="h-5 w-5" />,
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
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
    const path = window.location.pathname;
    const nextUrl = nextQuery ? `${path}?${nextQuery}` : path;
    window.history.replaceState(null, "", nextUrl);
  }, []);

  return null;
}
