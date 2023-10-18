import { Suspense } from "react";
import { useLoaderData, Await, } from "@remix-run/react";
import { defer, type LoaderFunctionArgs } from "@vercel/remix";
import { getProtectedSession } from "~/session";
import {
  getItems,
  getAttachments,
  getUsersLoadouts,
  getUserProfile,
} from "~/lib/api";
import type { Model } from "./_default.dashboard._admin";
import LoadoutDisplay from "~/components/LoadoutDisplay";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, response, uuid } = await getProtectedSession(request);

  console.log(uuid);

  // change method for getting loadouts.
  // probably pull loadouts and rating seperately
  const loadouts = getUsersLoadouts(supabase, uuid!);

  const models = getItems<Model>(supabase, "models");
  const attachments = getAttachments(supabase);
  const profile = getUserProfile(supabase, uuid!);

  const data = Promise.all([models, attachments, loadouts, profile]);

  return defer({ data }, { headers: response.headers });
};

export default function Page() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <Suspense>
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
    </Suspense>
  );
}
