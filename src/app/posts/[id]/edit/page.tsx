import Link from "next/link";
import { redirect, notFound } from "next/navigation";

import { updatePost } from "@/app/actions";
import { TiptapField } from "@/components/editor/tiptap-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";

type EditPostProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  required: "제목과 내용을 모두 입력해 주세요.",
  failed: "수정에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export default async function EditPost({ params, searchParams }: EditPostProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const errorMessage = ERROR_MESSAGES[resolvedSearchParams.error ?? ""];

  const supabase = getSupabaseServerClientReadOnly();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect(`/login?next=/posts/${postId}/edit`);
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, author_id")
    .eq("id", postId)
    .single();

  if (error || !post) {
    notFound();
  }

  if (post.author_id !== userData.user.id) {
    redirect(`/posts/${postId}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/posts/${post.id}`}>상세로 돌아가기</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/feed">피드로</Link>
          </Button>
        </header>

        <div className="space-y-3">
          <Badge className="w-fit rounded-full bg-primary/10 text-primary">
            글 수정
          </Badge>
          <h1 className="font-heading text-3xl font-semibold">
            작성한 글을 수정해 주세요.
          </h1>
          <p className="text-sm text-muted-foreground">
            수정 사항은 저장 즉시 반영됩니다.
          </p>
        </div>

        <Card className="border-border/70 bg-background/95">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">수정하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {errorMessage}
              </div>
            )}
            <form action={updatePost} className="space-y-5">
              <input type="hidden" name="postId" value={post.id} />
              <Input name="title" defaultValue={post.title} required />
              <TiptapField name="content" defaultValue={post.content ?? ""} />
              <Button type="submit" className="w-full rounded-full">
                수정 저장
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
