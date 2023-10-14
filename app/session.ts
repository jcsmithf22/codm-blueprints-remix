import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "./types/supabase";
import { redirect } from "@vercel/remix";

export async function getSession(request: Request) {
  const response = new Response();
  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { supabase, session, response };
}

export async function getProtectedSession(request: Request) {
  const { supabase, session, response } = await getSession(request);

  if (!session) {
    throw redirect("/auth/login");
  }

  const admin = session.user.app_metadata.claims_admin === true;

  return { supabase, response, admin };
}

export async function getAdminSession(request: Request) {
  const { supabase, session, response } = await getSession(request);

  if (!session || session.user.app_metadata.claims_admin !== true) {
    throw redirect("/auth/login");
  }

  return { supabase, response };
}
