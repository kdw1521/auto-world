"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, Save, Send } from "lucide-react";

import { updatePost } from "@/app/actions";
import { TiptapField } from "@/components/editor/tiptap-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { Logo } from "@/components/ui/logo";

type EditPostClientProps = {
  postId: number;
  defaultTitle: string;
  defaultContent: string;
  errorMessage?: string;
};

export default function EditPostClient({
  postId,
  defaultTitle,
  defaultContent,
  errorMessage,
}: EditPostClientProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    document.body.classList.add("page-write");
    return () => {
      document.body.classList.remove("page-write");
    };
  }, []);

  const estimatedRead = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }, [content]);

  return (
    <div className="min-h-screen bg-[#0C342C]">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #E3EF26 1px, transparent 1px),
              linear-gradient(to bottom, #E3EF26 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0C342C]/90 backdrop-blur-xl border-b border-[#E3EF26]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              type="button"
              onClick={() => router.push(`/posts/${postId}`)}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <Logo className="w-12 h-12" variant="professional" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E3EF26] animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-[#E3EF26] tracking-tight">
                  AutoWorld
                </h1>
                <p className="text-xs text-[#E3EF26]/60">Edit Article</p>
              </div>
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreview((prev) => !prev)}
                className="bg-transparent border-2 border-[#E3EF26]/30 text-[#E3EF26] hover:bg-[#E3EF26]/10 hover:border-[#E3EF26] rounded-none"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? "수정" : "미리보기"}
              </Button>
              <SubmitButton
                form="edit-form"
                className="bg-[#E3EF26] text-[#0C342C] hover:bg-[#E3EF26]/90 shadow-lg shadow-[#E3EF26]/20 rounded-none"
                pendingText="저장 중..."
              >
                <Send className="w-4 h-4 mr-2" />
                저장
              </SubmitButton>
            </div>
          </div>
        </div>
      </header>

      <form id="edit-form" action={updatePost}>
        <input type="hidden" name="postId" value={postId} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              {errorMessage ? (
                <div className="border border-[#CEF431]/40 bg-[#CEF431]/10 px-4 py-3 text-sm text-[#CEF431]">
                  {errorMessage}
                </div>
              ) : null}
              {!isPreview ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-8 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                      <Input
                        name="title"
                        placeholder="Article title..."
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="text-3xl font-bold border-0 bg-transparent text-[#E3EF26] placeholder:text-[#E3EF26]/40 focus:ring-0 p-0 h-auto"
                        required
                      />
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="p-8 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                      <TiptapField
                        name="content"
                        defaultValue={defaultContent}
                        onChange={setContent}
                      />
                    </Card>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-8 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                    <div className="mb-6">
                      <Badge className="bg-[#E3EF26]/20 text-[#E3EF26] border border-[#E3EF26]/30 rounded-none mb-4">
                        수정 미리보기
                      </Badge>
                      <h1 className="text-4xl font-bold text-[#E3EF26] mb-4">
                        {title || "Article Title"}
                      </h1>
                      <div className="flex items-center gap-3 text-sm text-[#E3EF26]/60">
                        <span>By You</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{estimatedRead}</span>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <div className="text-[#E3EF26]/70 whitespace-pre-wrap leading-relaxed">
                        {content || "Your article content will appear here..."}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                  <h3 className="text-sm font-bold text-[#E3EF26] mb-4">
                    Editing Tips
                  </h3>
                  <ul className="space-y-2 text-xs text-[#E3EF26]/80">
                    <li className="flex items-start gap-2">
                      <span className="text-[#E3EF26] mt-1">•</span>
                      <span>수정 후 저장을 눌러 반영해 주세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E3EF26] mt-1">•</span>
                      <span>제목/본문 누락 시 저장되지 않습니다.</span>
                    </li>
                  </ul>
                </Card>
              </motion.div>

              <Card className="p-6 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                <div className="text-xs text-[#E3EF26]/70">
                  <p>
                    변경 사항은 저장 즉시 반영됩니다. 저장 전 미리보기를 확인해
                    주세요.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/feed">피드로</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/posts/${postId}`}>상세로</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
}
