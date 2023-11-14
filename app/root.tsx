// import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import {
  json,
  type SerializeFrom,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@vercel/remix";
import React from "react";
import type { Database } from "./types/supabase";

import { getSession } from "./session";
import styles from "./tailwind.css";

export const config = { runtime: "edge" };

export const links: LinksFunction = () => [
  // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return [
    { title: "CODM Loadouts" },
    {
      name: "description",
      content:
        "Welcome to CODM Loadouts, the social media website designed specifically for sharing your favorite Call of Duty Mobile loadouts!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const { session, response, uuid, supabase } = await getSession(request);

  const { data: user_data } = await supabase
    .from("profiles")
    .select(`username, avatar_url`)
    .eq("id", uuid as string)
    .single();

  return json(
    {
      env,
      session,
      user_data,
      ENV: { VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID },
    },
    {
      headers: response.headers,
    }
  );
};

declare global {
  interface Window {
    ENV: SerializeFrom<typeof loader>["ENV"];
  }
}

export default function App() {
  const { env, session, user_data, ENV } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();
  const [supabase] = React.useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  const serverAccessToken = session?.access_token;

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== "INITIAL_SESSION" &&
        session?.access_token !== serverAccessToken
      ) {
        revalidate();
      }
    });

    return () => subscription.unsubscribe();
  }, [serverAccessToken, supabase, revalidate]);

  return (
    <html lang="en" className="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <meta name="theme-color" content="#000" /> */}
        <Meta />
        <Links />
      </head>
      <body className="bg-basecolor">
        <Outlet context={{ supabase, session, user_data }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {/* 👇 Write the ENV values to the window */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
      </body>
    </html>
  );
}
