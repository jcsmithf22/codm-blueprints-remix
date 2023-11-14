import { Suspense } from "react";
import { getAttachments, getItems } from "~/lib/api";
import { getAdminSession } from "~/session";

import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { defer, type LoaderFunctionArgs } from "@vercel/remix";

import type { Database, Json } from "~/types/supabase";
import { Loader2 } from "lucide-react";
export type Model = Database["public"]["Tables"]["models"]["Row"];
export type Type = Database["public"]["Tables"]["attachment_names"]["Row"];
export type Attachment = {
  id: number;
  model: number;
  type: number;
  attachment_names: {
    name: string;
    type: string;
  } | null;
  models: {
    id: number;
    name: string;
  } | null;
  characteristics: Json;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, response } = await getAdminSession(request);

  const models = getItems<Model>(supabase, "models");
  const attachments = getAttachments(supabase);
  const types = getItems<Type>(supabase, "attachment_names");

  const data = Promise.all([models, attachments, types]);

  return defer({ data }, { headers: response.headers });
};

export default function Layout() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <Suspense
      fallback={
        <div className="w-full h-full bg-background flex justify-center items-center">
          <Loader2 className="animate-spin h-12 w-12 stroke-gray-400" />
        </div>
      }
    >
      <Await resolve={data}>
        {([models, attachments, types]) => (
          <Outlet context={{ models, attachments, types }} />
        )}
      </Await>
    </Suspense>
  );
}
