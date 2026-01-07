"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Book,
  CheckCircle,
  Code,
  Lightbulb,
  Rocket,
  Shield,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

const guides = [
  {
    id: 1,
    category: "시작하기",
    title: "첫 게시글 작성하기",
    description:
      "마크다운으로 작성하고, 코드블록 활용하고, 스크린샷 첨부까지. 5분이면 끝.",
    readTime: "5분",
    icon: Rocket,
    color: "#CEF431",
  },
  {
    id: 2,
    category: "글쓰기 팁",
    title: "제목은 이렇게 짓기",
    description:
      "[Python] 엑셀 자동화 처럼 언어/도구 + 목적을 명확하게. 클릭률 3배 상승.",
    readTime: "3분",
    icon: Lightbulb,
    color: "#03D26F",
  },
  {
    id: 3,
    category: "커뮤니티",
    title: "질문 잘 하는 법",
    description:
      "환경 정보, 에러 로그, 시도한 방법까지 적으면 답변 속도 10배 빨라짐.",
    readTime: "4분",
    icon: Users,
    color: "#CEF431",
  },
  {
    id: 4,
    category: "규칙",
    title: "이것만은 하지 말기",
    description: "스팸, 광고, 무단 복사는 바로 정지. 출처 표기는 필수.",
    readTime: "2분",
    icon: Shield,
    color: "#E3EF26",
  },
  {
    id: 5,
    category: "코드 공유",
    title: "실행 가능한 코드 작성법",
    description:
      "복붙만 하면 돌아가는 코드가 최고. 의존성, 환경변수 설명 필수.",
    readTime: "6분",
    icon: Code,
    color: "#03D26F",
  },
  {
    id: 6,
    category: "Expert",
    title: "Expert 배지 받는 법",
    description: "꾸준한 활동 + 고품질 콘텐츠 + 커뮤니티 기여. 운영진이 직접 검토.",
    readTime: "3분",
    icon: Zap,
    color: "#CEF431",
  },
];

const quickTips = [
  { tip: "마크다운 코드블록 ```python ... ``` 꼭 쓰기", icon: "✓" },
  { tip: "OS, 버전, 라이브러리 환경 정보 공유", icon: "✓" },
  { tip: "민감한 회사 정보는 익명화해서 공유", icon: "✓" },
  { tip: '"파이썬 어떻게 배워요?" 같은 질문은 피하기', icon: "✗" },
];

export default function GuideClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Hero Section - Lighter & More Space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-2 bg-[#03D26F] rounded-full" />
            <p className="text-sm text-[#CEF431]/70 tracking-wide">
              COMMUNITY GUIDELINES
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#EAF4F4] leading-tight mb-6">
            가이드와 팁으로
            <br />
            더 나은 커뮤니티 만들기
          </h2>
          <p className="text-lg text-[#EAF4F4]/70 max-w-2xl">
            잘 짠 글 하나가 열 명의 노가다를 막습니다. <br />
            가이드를 통해 동료들의 불필요한 삽질을 막아주세요.
          </p>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mb-12"
        >
          <Card className="rounded-none border-2 border-[#CEF431]/20 bg-[#0E3A42]/70 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-[#03D26F]" />
              <h3 className="text-lg font-semibold text-[#EAF4F4]">
                빠른 체크리스트
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickTips.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span
                    className={`text-sm font-semibold ${item.icon === "✓" ? "text-[#03D26F]" : "text-[#EF4444]"
                      }`}
                  >
                    {item.icon}
                  </span>
                  <p className="text-sm text-[#EAF4F4]/80">{item.tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Guide Cards - 3 Column Grid for Better Spacing */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="rounded-none border-2 border-[#CEF431]/20 bg-[#0E3A42]/70 p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant="outline"
                    className="rounded-none border-[#CEF431]/40 text-[#CEF431]"
                  >
                    {guide.category}
                  </Badge>
                  <span className="text-xs text-[#EAF4F4]/60">
                    {guide.readTime}
                  </span>
                </div>
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ borderColor: guide.color, borderWidth: "1.5px" }}
                >
                  <guide.icon
                    className="w-5 h-5"
                    style={{ color: guide.color }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#EAF4F4] mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-[#EAF4F4]/70">
                  {guide.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Warning Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-12"
        >
          <Card className="rounded-none border-2 border-[#EF4444]/40 bg-[#4B1B1B]/50 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#EF4444]" />
              <div>
                <h3 className="text-lg font-semibold text-[#EAF4F4] mb-2">
                  커뮤니티 규칙 위반 시 안내
                </h3>
                <p className="text-sm text-[#EAF4F4]/70 leading-relaxed">
                  스팸성 홍보, 무단 광고, 불법 콘텐츠 공유는 즉시 삭제 및
                  제재됩니다. 반복 위반 시 계정이 제한될 수 있습니다.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 border-t border-[#CEF431]/20 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-[#03D26F]" />
              <p className="text-sm text-[#EAF4F4]/70">
                함께 자동화하고, 함께 성장합니다.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5 text-[#CEF431]" />
              <p className="text-sm text-[#EAF4F4]/70">
                더 자세한 가이드는 블로그에서 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
