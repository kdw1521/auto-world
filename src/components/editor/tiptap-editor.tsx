"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { Extension, textblockTypeInputRule } from "@tiptap/core";
import {
  Bold,
  Code,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Link2,
  Minus,
  Quote,
  SquareCode,
  Strikethrough,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TiptapFieldProps = {
  name?: string;
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
};

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
];

const URL_FINDER = /(https?:\/\/[^\s]+)/i;

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
}

function extractDriveFileId(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("drive.google.com")) {
      return null;
    }
    if (parsed.pathname.startsWith("/file/d/")) {
      const parts = parsed.pathname.split("/");
      return parts[3] ?? null;
    }
    const id = parsed.searchParams.get("id");
    return id ?? null;
  } catch {
    return null;
  }
}

function extractFirstUrl(value: string) {
  const match = value.match(URL_FINDER);
  return match ? match[1] : null;
}

function resolveImageUrl(input: string) {
  const normalized = normalizeUrl(input);
  if (!normalized) {
    return null;
  }

  const driveId = extractDriveFileId(normalized);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w2000`;
  }

  const lowerPath = new URL(normalized).pathname.toLowerCase();
  if (IMAGE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext))) {
    return normalized;
  }

  return null;
}

const CodeBlockShortcut = Extension.create({
  name: "codeBlockShortcut",
  addInputRules() {
    const type = this.editor.schema.nodes.codeBlock;
    if (!type) {
      return [];
    }
    return [
      textblockTypeInputRule({
        find: /^```$/,
        type,
      }),
    ];
  },
});

export function TiptapField({
  name = "content",
  defaultValue = "",
  className,
  onChange,
}: TiptapFieldProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          // Google Drive 이미지가 외부 사이트(내 사이트)에서 요청될 때 차단되지 않도록 설정
          referrerpolicy: "no-referrer",
          class: "tiptap-image",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      CodeBlockShortcut,
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
      handlePaste(view, event) {
        const uriList = event.clipboardData?.getData("text/uri-list") ?? "";
        const firstUri = uriList
          .split("\n")
          .map((line) => line.trim())
          .find((line) => line && !line.startsWith("#"));
        const plainText = event.clipboardData?.getData("text/plain") ?? "";
        const candidate =
          firstUri || extractFirstUrl(plainText) || plainText.trim();

        if (!candidate) {
          return false;
        }

        const imageUrl = resolveImageUrl(candidate);
        if (!imageUrl) {
          return false;
        }

        const imageType = view.state.schema.nodes.image;
        if (!imageType) {
          return false;
        }

        const node = imageType.create({
          src: imageUrl,
          alt: "첨부 이미지",
        });
        const transaction = view.state.tr.replaceSelectionWith(node);
        view.dispatch(transaction.scrollIntoView());
        return true;
      },
    },
    onUpdate({ editor }) {
      const nextValue = editor.getHTML();
      setValue(nextValue);
      onChange?.(nextValue);
    },
  });

  const handleLink = React.useCallback(() => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt(
      "링크 주소를 입력해 주세요.",
      previousUrl ?? ""
    );

    if (input === null) {
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const hasSelection = !editor.state.selection.empty;
    const imageUrl = resolveImageUrl(trimmed);
    if (imageUrl && !hasSelection) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: "첨부 이미지" })
        .run();
      return;
    }

    const normalized = normalizeUrl(trimmed);
    if (!normalized) {
      return;
    }

    const chain = editor.chain().focus();
    if (!hasSelection) {
      chain.insertContent(normalized);
    }
    chain.extendMarkRange("link").setLink({ href: normalized }).run();
  }, [editor]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 rounded-md border border-border bg-background/80 p-2">
        <Button
          type="button"
          size="icon-sm"
          variant={
            editor?.isActive("heading", { level: 2 }) ? "default" : "ghost"
          }
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={!editor}
          aria-label="제목"
          title="제목"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("bold") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
          aria-label="굵게"
          title="굵게"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("italic") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
          aria-label="기울임"
          title="기울임"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("strike") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editor}
          aria-label="취소선"
          title="취소선"
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("bulletList") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={!editor}
          aria-label="글머리 목록"
          title="글머리 목록"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("orderedList") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={!editor}
          aria-label="번호 목록"
          title="번호 목록"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("blockquote") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          disabled={!editor}
          aria-label="인용"
          title="인용"
        >
          <Quote className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("code") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleCode().run()}
          disabled={!editor}
          aria-label="인라인 코드"
          title="인라인 코드"
        >
          <Code className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("codeBlock") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          disabled={!editor}
          aria-label="코드 블록"
          title="코드 블록"
        >
          <SquareCode className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("link") ? "default" : "ghost"}
          onClick={handleLink}
          disabled={!editor}
          aria-label="링크"
          title="링크"
        >
          <Link2 className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          disabled={!editor}
          aria-label="구분선"
          title="구분선"
        >
          <Minus className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        마크다운 입력도 지원됩니다. 예) # 제목, - 목록, ``` 코드블록
      </p>

      <div className="rounded-lg border border-border bg-background/80 px-4 py-3">
        {isMounted ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="min-h-[240px]" aria-hidden="true" />
        )}
      </div>

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
