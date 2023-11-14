import DashboardNavigation from "~/components/navigation/DashboardNavigation";
import { getProtectedSession } from "~/session";

import { Outlet, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@vercel/remix";
import React from "react";
import { cn } from "~/lib/utils";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { response, admin } = await getProtectedSession(request);

  return json({ admin }, { headers: response.headers });
};

export default function Layout() {
  const { admin } = useLoaderData<typeof loader>();
  return (
    <>
      <NavContainer admin={admin} />
      <div className="relative w-full md:pl-64 pl-12 pt-14 h-screen">
        <Outlet />
      </div>
    </>
  );
}

function NavContainer({ admin }: { admin: boolean }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div
      className={cn(
        "fixed top-14 left-0 bottom-0 flex md:w-64 flex-col flex-shrink-0 bg-background border-r p-3 px-4 md:px-6 md:p-5 z-40 overflow-hidden transition-all ease-in-out max-w-full",
        expanded ? "w-64" : "w-12"
      )}
    >
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="ml-1 mb-2 w-full flex justify-end">
        <button onClick={() => setExpanded(!expanded)} className="">
          {expanded ? (
            <ChevronLeftCircle
              className={cn("h-6 w-6 shrink-0 text-gray-500")}
              aria-label="Toggle sidebar"
              strokeWidth={1.5}
            />
          ) : (
            <ChevronRightCircle
              className={cn("h-6 w-6 shrink-0 text-gray-500")}
              aria-label="Toggle sidebar"
              strokeWidth={1.5}
            />
          )}
        </button>
      </div>
      <div className="" onClick={() => setExpanded(false)}>
        <DashboardNavigation admin={admin} />
      </div>
    </div>
  );
}
