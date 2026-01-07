"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { AlertCircle, Bug, CheckCircle, Lightbulb } from "lucide-react";
import { submitSupportRequest } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";

type RecentReport = {
  id: number;
  title: string;
  created_at: string | null;
  reply: string | null;
};

type RequestsClientProps = {
  errorMessage?: string;
  recentReports: RecentReport[];
};

type ReportType = "bug" | "feature";

function formatDate(value: string | null) {
  if (!value) return "";
  const date = dayjs(value);
  if (!date.isValid()) return "";
  return date.format("YYYY.MM.DD");
}

export default function RequestsClient({
  errorMessage,
  recentReports,
}: RequestsClientProps) {
  const [reportType, setReportType] = useState<ReportType>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("");

  const combinedContent = useMemo(() => {
    const trimmedDescription = description.trim();
    const trimmedEnv = environment.trim();
    const typeLabel = reportType === "bug" ? "버그 리포트" : "기능 요청";
    const sections = [
      `[유형] ${typeLabel}`,
      trimmedDescription ? trimmedDescription : "",
    ].filter(Boolean);

    if (reportType === "bug" && trimmedEnv) {
      sections.push(`\n---\n사용 환경: ${trimmedEnv}`);
    }

    return sections.join("\n\n");
  }, [description, environment, reportType]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <Bug className="w-7 h-7 text-[#CEF431]" strokeWidth={1.5} />
              <h2 className="text-3xl font-normal text-[#CEF431]">
                버그 리포트 & 기능 요청
              </h2>
            </div>
            <p className="text-base text-[#EAF4F4]/70 font-light">
              불편한 점이나 개선 아이디어를 알려주세요. 48시간 내 답변드립니다.
            </p>
          </motion.div>

          {errorMessage ? (
            <div className="mb-6 border border-[#CEF431]/40 bg-[#CEF431]/10 px-4 py-3 text-sm text-[#CEF431]">
              {errorMessage}
            </div>
          ) : null}

          {/* Report Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setReportType("bug")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 border transition-all rounded-none ${
                  reportType === "bug"
                    ? "bg-[#CEF431]/10 border-[#CEF431]/50 text-[#CEF431]"
                    : "bg-[#161514]/30 border-[#EAF4F4]/10 text-[#EAF4F4]/70 hover:border-[#CEF431]/30"
                }`}
              >
                <Bug className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-normal">버그 리포트</span>
              </button>
              <button
                type="button"
                onClick={() => setReportType("feature")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 border transition-all rounded-none ${
                  reportType === "feature"
                    ? "bg-[#CEF431]/10 border-[#CEF431]/50 text-[#CEF431]"
                    : "bg-[#161514]/30 border-[#EAF4F4]/10 text-[#EAF4F4]/70 hover:border-[#CEF431]/30"
                }`}
              >
                <Lightbulb className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-normal">기능 요청</span>
              </button>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
              <form action={submitSupportRequest} className="space-y-6">
                <input type="hidden" name="content" value={combinedContent} />

                {/* Title */}
                <div>
                  <label className="block text-sm font-normal text-[#CEF431] mb-2">
                    제목 *
                  </label>
                  <Input
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={
                      reportType === "bug"
                        ? "예: 게시글 작성 중 자동 저장 안됨"
                        : "예: 다크모드 지원 추가 요청"
                    }
                    className="w-full px-4 py-3 bg-[#014651]/50 border border-[#EAF4F4]/20 text-[#EAF4F4] placeholder:text-[#EAF4F4]/40 rounded-none focus:border-[#CEF431]/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-normal text-[#CEF431] mb-2">
                    {reportType === "bug" ? "버그 상세 설명 *" : "기능 설명 *"}
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={
                      reportType === "bug"
                        ? "1. 어떤 상황에서 발생했나요?\n2. 어떤 문제가 발생했나요?\n3. 재현 방법이 있나요?"
                        : "1. 어떤 기능이 필요한가요?\n2. 왜 필요한가요?\n3. 예상되는 동작은?"
                    }
                    rows={8}
                    className="w-full px-4 py-3 bg-[#014651]/50 border border-[#EAF4F4]/20 text-[#EAF4F4] placeholder:text-[#EAF4F4]/40 rounded-none focus:border-[#CEF431]/50 resize-none"
                  />
                </div>

                {/* Environment (for bugs only) */}
                {reportType === "bug" && (
                  <div>
                    <label className="block text-sm font-normal text-[#CEF431] mb-2">
                      사용 환경
                    </label>
                    <Input
                      type="text"
                      value={environment}
                      onChange={(event) => setEnvironment(event.target.value)}
                      placeholder="예: Chrome 120, Windows 11 / Safari, macOS"
                      className="w-full px-4 py-3 bg-[#014651]/50 border border-[#EAF4F4]/20 text-[#EAF4F4] placeholder:text-[#EAF4F4]/40 rounded-none focus:border-[#CEF431]/50"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <SubmitButton
                    className="w-full bg-[#CEF431] text-[#161514] hover:bg-[#CEF431]/90 rounded-none py-3 font-medium"
                    pendingText="제출 중..."
                  >
                    제출하기
                  </SubmitButton>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
                <h3 className="text-base font-medium text-[#CEF431] mb-4">
                  작성 가이드
                </h3>
                <div className="space-y-3 text-xs text-[#EAF4F4]/70 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle
                      className="w-3.5 h-3.5 text-[#03D26F] mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <p>구체적인 상황과 재현 방법 설명</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle
                      className="w-3.5 h-3.5 text-[#03D26F] mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <p>스크린샷이나 에러 메시지 첨부</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle
                      className="w-3.5 h-3.5 text-[#03D26F] mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <p>브라우저, OS 정보 공유</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      className="w-3.5 h-3.5 text-[#CEF431] mt-0.5 shrink-0"
                      strokeWidth={1.5}
                    />
                    <p>중복 제출 전 최근 리포트 확인</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-[#161514]/30 border border-[#EAF4F4]/10 rounded-none">
                <h3 className="text-base font-medium text-[#CEF431] mb-4">
                  최근 리포트
                </h3>
                <div className="space-y-3">
                  {recentReports.length === 0 ? (
                    <p className="text-xs text-[#EAF4F4]/60">
                      아직 등록된 요청이 없습니다.
                    </p>
                  ) : (
                    recentReports.map((report) => {
                      const status = report.reply ? "해결" : "검토중";
                      return (
                        <div
                          key={report.id}
                          className="pb-3 border-b border-[#EAF4F4]/10 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <Bug
                              className="w-3.5 h-3.5 text-[#CEF431] mt-0.5"
                              strokeWidth={1.5}
                            />
                            <p className="text-xs text-[#EAF4F4]/80 leading-relaxed flex-1">
                              {report.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-5">
                            <Badge
                              className={`rounded-none text-[9px] font-normal ${
                                status === "해결"
                                  ? "bg-[#03D26F]/10 border-[#03D26F]/30 text-[#03D26F]"
                                  : "bg-[#CEF431]/10 border-[#CEF431]/30 text-[#CEF431]"
                              }`}
                            >
                              {status}
                            </Badge>
                            <span className="text-[10px] text-[#EAF4F4]/40">
                              {formatDate(report.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-linear-to-br from-[#014651] to-[#161514] border border-[#CEF431]/30 rounded-none">
                <h3 className="text-sm font-medium text-[#CEF431] mb-2">
                  긴급 문의
                </h3>
                <p className="text-xs text-[#EAF4F4]/60 leading-relaxed mb-3">
                  서비스 장애나 긴급한 문제는 이메일로 연락주세요.
                </p>
                <a
                  href="mailto:support@autoworld.com"
                  className="text-xs text-[#CEF431] hover:text-[#03D26F] transition-colors underline"
                >
                  kdw1521@naver.com
                </a>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
