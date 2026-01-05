import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createSupabaseClient({ allowSet }: { allowSet: boolean }) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        return (await cookieStore).getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[]
      ) {
        if (!allowSet) {
          return;
        }
        cookiesToSet.forEach(async ({ name, value, options }) => {
          (await cookieStore).set({ name, value, ...options });
        });
      },
    },
  });
}

export function getSupabaseServerClient() {
  return createSupabaseClient({ allowSet: true });
}

export function getSupabaseServerClientReadOnly() {
  return createSupabaseClient({ allowSet: false });
}
