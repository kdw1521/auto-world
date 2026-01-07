"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ChevronDown,
  Code,
  Eye,
  Image as ImageIcon,
  Plus,
  Save,
  Send,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { createPost } from "@/app/actions";
import { TiptapField } from "@/components/editor/tiptap-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { Logo } from "@/components/ui/logo";

type WriteClientProps = {
  errorMessage?: string;
};

const categoryOptions = [
  "Automation",
  "Scripting",
  "Productivity",
  "Workflow",
  "Tips",
];

const popularTags = ["python", "excel", "notion", "slack", "zapier", "n8n"];

export default function WriteClient({ errorMessage }: WriteClientProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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

  const previewHtml = useMemo(() => {
    const trimmed = content.trim();
    if (!trimmed) {
      return "<p>Your article content will appear here...</p>";
    }
    if (trimmed.includes("&lt;") || trimmed.includes("&gt;")) {
      return trimmed.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    return trimmed;
  }, [content]);

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 5) {
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value));
  };

  return (
    <div className="min-h-screnn bg-[#0C342C]">
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
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
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
                form="write-form"
                className="bg-[#E3EF26] text-[#0C342C] hover:bg-[#E3EF26]/90 shadow-lg shadow-[#E3EF26]/20 rounded-none"
                pendingText="발행 중..."
              >
                <Send className="w-4 h-4 mr-2" />
                Upload
              </SubmitButton>
            </div>
          </div>
        </div>
      </header>

      <form id="write-form" action={createPost}>
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
                  {/* Title */}
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

                  {/* Content Editor */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="p-8 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                      {/* Toolbar */}
                      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E3EF26]/20">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-transparent border border-[#E3EF26]/30 text-[#E3EF26] hover:bg-[#E3EF26]/10 rounded-none"
                        >
                          <Code className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-transparent border border-[#E3EF26]/30 text-[#E3EF26] hover:bg-[#E3EF26]/10 rounded-none"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                        <div className="h-6 w-px bg-[#E3EF26]/20 mx-2" />
                        <span className="text-xs text-[#E3EF26]/60">
                          Markdown supported
                        </span>
                      </div>

                      {/* Editor */}
                      <TiptapField
                        name="content"
                        defaultValue={content}
                        onChange={setContent}
                      />
                    </Card>
                  </motion.div>
                </>
              ) : (
                /* Preview */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-8 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                    <div className="mb-6">
                      <Badge className="bg-[#E3EF26]/20 text-[#E3EF26] border border-[#E3EF26]/30 rounded-none mb-4">
                        {selectedCategory || "Select Category"}
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

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-transparent border-[#E3EF26]/30 text-[#E3EF26] rounded-none"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none w-full overflow-hidden">
                      <div
                        className="
                          text-[#E3EF26]/70 leading-relaxed space-y-6 whitespace-pre-wrap
                          [word-break:break-word] overflow-wrap-anywhere
                          [&_pre]:whitespace-pre-wrap [&_pre]:break-all [&_code]:break-all
                          [&_blockquote]:border-l-4 [&_blockquote]:border-[#E3EF26]/40 [&_blockquote]:pl-4
                          [&_blockquote]:py-2 [&_blockquote]:bg-[#014651]/50 [&_blockquote]:text-[#E3EF26]
                          [&_blockquote]:my-4 [&_blockquote_p]:m-0
                        "
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Publishing Options */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                  <h3 className="text-sm font-bold text-[#E3EF26] mb-4">
                    Publishing Options
                  </h3>

                  {/* Category */}
                  {/* <div className="mb-4">
                    <label className="block text-xs text-[#E3EF26]/80 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCategoryDropdown((prev) => !prev)
                        }
                        className="w-full px-4 py-3 bg-[#014651]/50 border border-[#E3EF26]/30 text-left text-sm text-[#E3EF26] hover:border-[#E3EF26]/50 transition-colors flex items-center justify-between"
                      >
                        <span>{selectedCategory || "Select category"}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#023940] border border-[#E3EF26]/30 z-10 max-h-48 overflow-y-auto">
                          {categoryOptions.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(cat);
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#E3EF26] hover:bg-[#E3EF26]/10 transition-colors"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Tags */}
                  <div className="mb-4">
                    <label className="block text-xs text-[#E3EF26]/80 mb-2">
                      Tags (max 5)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTag(tagInput);
                          }
                        }}
                        className="flex-1 h-10 rounded-none border border-[#E3EF26]/30 bg-[#014651]/50 text-[#E3EF26] text-sm placeholder:text-[#E3EF26]/40 focus:border-[#E3EF26]"
                        disabled={tags.length >= 5}
                      />
                      <Button
                        type="button"
                        onClick={() => addTag(tagInput)}
                        disabled={tags.length >= 5}
                        className="bg-[#E3EF26]/20 text-[#E3EF26] hover:bg-[#E3EF26]/30 border border-[#E3EF26]/30 rounded-none"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-[#E3EF26]/20 text-[#E3EF26] border border-[#E3EF26]/30 rounded-none"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-[#E3EF26]/80"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Popular Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                  <h3 className="text-sm font-bold text-[#E3EF26] mb-4">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        disabled={tags.includes(tag) || tags.length >= 5}
                        className="px-3 py-1 bg-[#014651]/50 border border-[#E3EF26]/20 text-xs text-[#E3EF26] hover:border-[#E3EF26]/50 hover:bg-[#E3EF26]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Guidelines */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-[#E3EF26]/10 border-2 border-[#E3EF26]/30 rounded-none">
                  <h3 className="text-sm font-bold text-[#E3EF26] mb-3">
                    Writing Guidelines
                  </h3>
                  <ul className="space-y-2 text-xs text-[#E3EF26]/80">
                    <li className="flex items-start gap-2">
                      <span className="text-[#E3EF26] mt-1">•</span>
                      <span>
                        누구나 읽기 쉽게 설명해주시되
                        <br /> 전문가시라면 아낌없이 기술 용어 사용해주세요.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E3EF26] mt-1">•</span>
                      <span>
                        백 마디 말보다 한 장의 캡처나 실행 예시가 큰 도움이
                        됩니다.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E3EF26] mt-1">•</span>
                      <span>
                        내 글이 꼭 필요한 사람에게 닿을 수 있도록 연관된 핵심
                        단어를 태그해주세요.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E3EF26] mt-1">•</span>
                      <span>
                        함께 읽으면 좋은 자료나 참고한 곳의 링크를 남겨 주시면
                        더욱 좋습니다.
                      </span>
                    </li>
                  </ul>
                </Card>
              </motion.div>

              <Card className="p-6 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#E3EF26]" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#E3EF26] mb-1">
                      작성 팁
                    </h4>
                    <p className="text-xs text-[#E3EF26]/70">
                      제목과 본문이 입력되어야 게시가 완료됩니다.
                    </p>
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
