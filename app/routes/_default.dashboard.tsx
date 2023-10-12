import { Await, Outlet, useLoaderData } from "@remix-run/react";
import DashboardNavigation from "~/components/navigation/DashboardNavigation";
import type { Database, Json } from "~/types/supabase";
import { type LoaderFunctionArgs, defer } from "@remix-run/node";
import { getItems, getAttachments } from "~/lib/api";
import { getSession } from "~/session";
import { Suspense } from "react";

export type Model = Database["public"]["Tables"]["models"]["Row"];
export type Type = Database["public"]["Tables"]["attachment_names"]["Row"];
export type Attachment = {
  id: number;
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
  const { supabase, response } = await getSession(request);

  const models = getItems<Model>(supabase, "models");
  const attachments = getAttachments(supabase);
  const types = getItems<Type>(supabase, "attachment_names");

  const data = Promise.all([models, attachments, types]);

  return defer({ data }, { headers: response.headers });
};

export default function Layout() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden fixed top-14 left-0 bottom-0 md:flex md:w-64 md:flex-col flex-shrink-0 bg-white border-r border-r-gray-200 p-5 px-6 z-40">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="">
          <DashboardNavigation />
        </div>
      </div>

      <div className="relative w-full overflow-scroll pl-64 pt-14 h-screen">
        <Suspense
          fallback={<div className="w-full h-full bg-white">Loading...</div>}
        >
          <Await resolve={data}>
            {([models, attachments, types]) => (
              <Outlet context={{ models, attachments, types }} />
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}
