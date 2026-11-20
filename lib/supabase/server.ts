import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const secretKey = process.env.SUPABASE_SECRET_KEY!;

export function createServerClient() {
  return createClient(url, secretKey, {
    auth: { persistSession: false },
  });
}
