"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeTitle(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeBody(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isValidTitle(value: string) {
  return value.length >= 2 && value.length <= 80;
}

function isValidBody(value: string) {
  return value.length >= 4 && value.length <= 4000;
}

function isValidPassword(value: string) {
  if (value.length < 8) {
    return false;
  }
  const hasLetter = /[A-Za-z]/.test(value);
  const hasDigit = /\d/.test(value);
  return hasLetter && hasDigit;
}

function extractDisplayName(email: string) {
  const local = email.split("@")[0]?.trim();
  return local || "member";
}

function normalizeDisplayName(value: string) {
  return value.trim();
}

function isValidDisplayName(value: string) {
  return value.length >= 1 && value.length <= 24;
}

function safeRedirectPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/";
  }
  return nextPath;
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMessage(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isValidMessage(value: string) {
  return value.length >= 4 && value.length <= 2000;
}

function normalizeComment(value: string) {
  return value.trim();
}

function isValidComment(value: string) {
  return value.length >= 1 && value.length <= 1000;
}

function withQueryFlag(path: string, flag: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${flag}=1`;
}

function parsePostId(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

function parseCommentId(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

export async function signUp(formData: FormData) {
  const rawEmail = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = safeRedirectPath(String(formData.get("next") ?? ""));
  const email = normalizeEmail(rawEmail);

  if (!email || !isValidEmail(email)) {
    redirect("/signup?error=invalid");
  }
  if (!password || !isValidPassword(password)) {
    redirect("/signup?error=password");
  }

  const supabase = getSupabaseServerClient();
  const displayName = extractDisplayName(email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
    },
  });

  if (error) {
    console.error("supabase error ", error.code);
    console.error("Supabase signUp error:", error.message);
    const code = (error as { code?: string }).code ?? "";
    const message = error.message.toLowerCase();

    switch (code) {
      case "email_exists":
      case "user_already_exists":
      case "identity_already_exists":
        redirect(withQueryFlag("/signup?error=exists", "signup_exists"));
      case "over_email_send_rate_limit":
        redirect(withQueryFlag("/login", "email_already_sent"));
      case "over_request_rate_limit":
        redirect(withQueryFlag("/signup", "rate_limited"));
      case "signup_disabled":
        redirect(withQueryFlag("/signup", "signup_disabled"));
      case "captcha_failed":
        redirect(withQueryFlag("/signup", "captcha_failed"));
      case "weak_password":
        redirect(withQueryFlag("/signup?error=password", "weak_password"));
      case "email_address_invalid":
        redirect(withQueryFlag("/signup?error=invalid", "email_invalid"));
      case "email_address_not_authorized":
        redirect(withQueryFlag("/signup", "email_not_allowed"));
      default:
        break;
    }

    if (message.includes("password")) {
      redirect("/signup?error=password");
    }
    if (
      code === "email_exists" ||
      message.includes("already registered") ||
      message.includes("already exists") ||
      message.includes("signup is not allowed for existing users")
    ) {
      redirect(withQueryFlag("/signup?error=exists", "signup_exists"));
    }

    redirect("/signup?error=invalid");
  }

  const identities = data.user?.identities;
  if (data.user && Array.isArray(identities) && identities.length === 0) {
    redirect(withQueryFlag("/signup?error=exists", "signup_exists"));
  }

  if (!data.session) {
    redirect(withQueryFlag("/login", "email_sent"));
  }

  redirect(nextPath === "/" ? "/?welcome=1" : nextPath);
}

export async function signIn(formData: FormData) {
  const rawEmail = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = safeRedirectPath(String(formData.get("next") ?? ""));
  const email = normalizeEmail(rawEmail);

  if (!email || !password || !isValidEmail(email)) {
    redirect("/login?error=invalid");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("error code", error.code);
    console.error("Supabase signIn error:", error.message);
    const code = (error as { code?: string }).code ?? "";

    switch (code) {
      case "email_not_confirmed":
        redirect(withQueryFlag("/login", "email_not_confirmed"));
      case "invalid_credentials":
      case "user_not_found":
        redirect(withQueryFlag("/login?error=invalid", "invalid_credentials"));
      case "user_banned":
        redirect(withQueryFlag("/login", "user_banned"));
      case "over_request_rate_limit":
        redirect(withQueryFlag("/login", "rate_limited"));
      case "provider_disabled":
      case "email_provider_disabled":
        redirect(withQueryFlag("/login", "login_provider_disabled"));
      case "captcha_failed":
        redirect(withQueryFlag("/login", "captcha_failed"));
      default:
        break;
    }

    redirect("/login?error=invalid");
  }

  redirect(nextPath === "/" ? "/?login=1" : nextPath);
}

export async function signOut() {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/?logout=1");
}

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    redirect("/write?error=required");
  }

  const supabase = getSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    redirect("/login?next=/write");
  }

  const username =
    (data.user.user_metadata?.displayName as string | undefined) ??
    data.user.email?.split("@")[0] ??
    "익명";
  const contentText = stripHtml(content).slice(0, 240);

  const { error } = await supabase.from("posts").insert({
    title,
    content,
    content_text: contentText,
    author_id: data.user.id,
    author_username: username,
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    redirect("/write?error=failed");
  }

  revalidateTag("feed", { expire: 0 });
  redirect("/?posted=1");
}

export async function updatePost(formData: FormData) {
  const postId = parsePostId(formData.get("postId"));
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!postId) {
    redirect("/");
  }

  if (!title || !content) {
    redirect(`/posts/${postId}/edit?error=required`);
  }

  const supabase = getSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    redirect(`/login?next=/posts/${postId}/edit`);
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    redirect("/");
  }

  if (post.author_id !== data.user.id) {
    redirect(`/posts/${postId}`);
  }

  const username =
    (data.user.user_metadata?.displayName as string | undefined) ??
    data.user.email?.split("@")[0] ??
    "익명";
  const contentText = stripHtml(content).slice(0, 240);

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      content_text: contentText,
      author_username: username,
    })
    .eq("id", postId);

  if (error) {
    console.error("Supabase update error:", error.message);
    redirect(`/posts/${postId}/edit?error=failed`);
  }

  revalidateTag("feed", { expire: 0 });
  redirect(`/posts/${postId}?edited=1`);
}

export async function updateDisplayName(formData: FormData) {
  const displayName = normalizeDisplayName(
    String(formData.get("displayName") ?? "")
  );

  if (!isValidDisplayName(displayName)) {
    redirect("/mypage?error=invalid");
  }

  const supabase = getSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    redirect("/login?next=/mypage");
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      displayName,
    },
  });

  if (error) {
    console.error("Supabase updateUser error:", error.message);
    redirect("/mypage?error=failed");
  }

  redirect("/?updated=1");
}

export async function submitInquiry(formData: FormData) {
  const redirectTo = safeRedirectPath(
    String(formData.get("redirectTo") ?? "/")
  );
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const message = normalizeMessage(String(formData.get("message") ?? ""));

  if (!email || !isValidEmail(email) || !isValidMessage(message)) {
    redirect(withQueryFlag(redirectTo, "inquiry_error"));
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("inquiries").insert({
    email,
    message,
  });

  if (error) {
    console.error("Supabase inquiry insert error:", error.message);
    redirect(withQueryFlag(redirectTo, "inquiry_error"));
  }

  redirect(withQueryFlag(redirectTo, "inquiry"));
}

export async function submitSupportRequest(formData: FormData) {
  const title = normalizeTitle(String(formData.get("title") ?? ""));
  const content = normalizeBody(String(formData.get("content") ?? ""));

  if (!isValidTitle(title) || !isValidBody(content)) {
    redirect("/requests?error=invalid");
  }

  const supabase = getSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    redirect("/login?next=/requests");
  }

  const username =
    (data.user.user_metadata?.displayName as string | undefined) ??
    data.user.email?.split("@")[0] ??
    "익명";

  const { error } = await supabase.from("support_requests").insert({
    title,
    content,
    author_id: data.user.id,
    author_username: username,
  });

  if (error) {
    console.error("Supabase support request insert error:", error.message);
    redirect("/requests?error=failed");
  }

  redirect("/mypage?request=1");
}

export async function togglePostLike(postId: number) {
  if (!Number.isFinite(postId)) {
    return { error: "invalid" } as const;
  }

  const supabase = getSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return { error: "unauthenticated" } as const;
  }

  const { data: result, error } = await supabase.rpc("toggle_post_like", {
    post_id: postId,
  });

  if (error) {
    console.error("Supabase toggle like error:", error.message);
    return { error: "failed" } as const;
  }

  const payload = Array.isArray(result) ? result[0] : result;

  if (!payload) {
    return { error: "failed" } as const;
  }

  return {
    liked: Boolean(payload.liked),
    likes: Number(payload.likes ?? 0),
  };
}

export type CommentActionState = {
  status: "idle" | "success" | "error";
  error?: "invalid" | "unauthenticated" | "depth" | "failed";
  comment?: {
    id: number;
    post_id: number;
    parent_id: number | null;
    content: string;
    author_id: string | null;
    author_username: string | null;
    created_at: string | null;
  };
};

export type CommentUpdateActionState = {
  status: "idle" | "success" | "error";
  error?: "invalid" | "unauthenticated" | "forbidden" | "failed";
  comment?: {
    id: number;
    content: string;
    updated_at: string | null;
  };
};

export async function createComment(
  _prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const postId = parsePostId(formData.get("postId"));
  const parentId = parseCommentId(formData.get("parentId"));
  const content = normalizeComment(String(formData.get("content") ?? ""));

  if (!postId) {
    return { status: "error", error: "invalid" };
  }

  if (!isValidComment(content)) {
    return { status: "error", error: "invalid" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return { status: "error", error: "unauthenticated" };
  }

  if (parentId) {
    const { data: parent, error: parentError } = await supabase
      .from("post_comments")
      .select("id, post_id, parent_id")
      .eq("id", parentId)
      .single();

    if (
      parentError ||
      !parent ||
      parent.post_id !== postId ||
      parent.parent_id
    ) {
      return { status: "error", error: "depth" };
    }
  }

  const username =
    (data.user.user_metadata?.displayName as string | undefined) ??
    data.user.email?.split("@")[0] ??
    "익명";

  const { data: insertedComment, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      parent_id: parentId,
      content,
      author_id: data.user.id,
      author_username: username,
    })
    .select(
      "id, post_id, parent_id, content, author_id, author_username, created_at"
    )
    .single();

  if (error || !insertedComment) {
    console.error("Supabase comment insert error:", error?.message);
    return { status: "error", error: "failed" };
  }

  revalidateTag("feed", { expire: 0 });
  return {
    status: "success",
    comment: {
      id: insertedComment.id,
      post_id: Number(insertedComment.post_id),
      parent_id:
        insertedComment.parent_id === null
          ? null
          : Number(insertedComment.parent_id),
      content: insertedComment.content,
      author_id: insertedComment.author_id,
      author_username: insertedComment.author_username,
      created_at: insertedComment.created_at,
    },
  };
}

export async function updateComment(
  _prevState: CommentUpdateActionState,
  formData: FormData
): Promise<CommentUpdateActionState> {
  const postId = parsePostId(formData.get("postId"));
  const commentId = parseCommentId(formData.get("commentId"));
  const content = normalizeComment(String(formData.get("content") ?? ""));

  if (!postId || !commentId) {
    return { status: "error", error: "invalid" };
  }

  if (!isValidComment(content)) {
    return { status: "error", error: "invalid" };
  }

  const supabase = getSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return { status: "error", error: "unauthenticated" };
  }

  const { data: comment, error: commentError } = await supabase
    .from("post_comments")
    .select("id, post_id, author_id")
    .eq("id", commentId)
    .single();

  if (commentError || !comment) {
    return { status: "error", error: "failed" };
  }

  if (comment.post_id !== postId || comment.author_id !== data.user.id) {
    return { status: "error", error: "forbidden" };
  }

  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from("post_comments")
    .update({
      content,
      updated_at: updatedAt,
    })
    .eq("id", commentId);

  if (error) {
    console.error("Supabase comment update error:", error.message);
    return { status: "error", error: "failed" };
  }

  return {
    status: "success",
    comment: {
      id: commentId,
      content,
      updated_at: updatedAt,
    },
  };
}
