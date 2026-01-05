"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension, textblockTypeInputRule } from "@tiptap/core";
import {
  Bold,
  Code,
  Heading2,
  Italic,
  List,
  ListOrdered,
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
};

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
}: TiptapFieldProps) {
  const [value, setValue] = React.useState(defaultValue);

  const editor = useEditor({
    extensions: [StarterKit, CodeBlockShortcut],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
    onUpdate({ editor }) {
      setValue(editor.getHTML());
    },
  });

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 rounded-md border border-border bg-background/80 p-2">
        <Button
          type="button"
          size="icon-sm"
          variant={editor?.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
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
        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
