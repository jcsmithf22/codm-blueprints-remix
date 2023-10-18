import React from "react";
import { type LoaderFunctionArgs, defer } from "@vercel/remix";
import { getSession } from "~/session";
import {
  getLoadouts,
  getItems,
  getAttachments,
  getUserProfile,
} from "~/lib/api";
import type { Model } from "./_default.dashboard._admin";
import { useLoaderData, Await } from "@remix-run/react";
import LoadoutDisplay from "~/components/LoadoutDisplay";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, response, uuid } = await getSession(request);

  // change method for getting loadouts.
  // probably pull loadouts and rating seperately
  const loadouts = getLoadouts(supabase);
  const models = getItems<Model>(supabase, "models");
  const attachments = getAttachments(supabase);
  const profile = uuid ? getUserProfile(supabase, uuid) : null;

  const data = Promise.all([models, attachments, loadouts, profile]);

  return defer({ data }, { headers: response.headers });
};

export default function Page() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div className="pt-14">
      <React.Suspense>
        <Await resolve={data}>
          {([models, attachments, loadouts, profile]) => (
            <LoadoutDisplay
              models={models}
              attachments={attachments}
              unfilteredLoadouts={loadouts}
              profile={profile}
            />
          )}
        </Await>
      </React.Suspense>
    </div>
  );
}
