import { json, type LoaderFunctionArgs } from "@vercel/remix";
import { getItem } from "~/lib/api";
import { getProtectedSession } from "~/session";
import type { Model } from "./_default.dashboard";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { supabase, response } = await getProtectedSession(request);
  if (!params.id) return json({ data: null }, { headers: response.headers });
  try {
    const data = await getItem<Model>(supabase, "models", params.id);
    return json({ data, error: null }, { headers: response.headers });
  } catch (error) {
    return json({ data: {}, error: error }, { headers: response.headers });
  }
}
