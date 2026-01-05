"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TiptapFieldProps = {
  name?: string;
  defaultValue?: string;
  className?: string;
};

export function TiptapField({
  name = "content",
  defaultValue = "",
  className,
}: TiptapFieldProps) {
  const [value, setValue] = React.useState(defaultValue);

  const editor = useEditor({
    extensions: [StarterKit],
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
          size="sm"
          variant={editor?.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor}
        >
          제목
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("bold") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
        >
          굵게
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("italic") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
        >
          기울임
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("strike") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editor}
        >
          취소선
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("bulletList") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={!editor}
        >
          글머리
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("orderedList") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={!editor}
        >
          번호
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor?.isActive("blockquote") ? "default" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          disabled={!editor}
        >
          인용
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-background/80 px-4 py-3">
        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
