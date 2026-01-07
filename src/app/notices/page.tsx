import { getSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import NoticesClient from "@/components/sections/notices_client";

export default async function NoticesPage() {
  const supabase = getSupabaseServerClientReadOnly();
  const { data: notices, error } = await supabase
    .from("notices")
    .select("id, title, content, created_at, is_pinned")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase notices fetch error:", error.message);
  }

  return <NoticesClient notices={notices ?? []} />;
}
