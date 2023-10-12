import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getItem } from "~/lib/api";
import { getProtectedSession } from "~/session";
import type { SingleAttachment } from "./_default.dashboard.attachments";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { supabase, response } = await getProtectedSession(request);
  if (!params.id) return json({ data: null }, { headers: response.headers });
  try {
    const data = await getItem<SingleAttachment>(
      supabase,
      "attachments",
      params.id
    );
    return json({ data, error: null }, { headers: response.headers });
  } catch (error) {
    return json({ data: {}, error: error }, { headers: response.headers });
  }
}
