import DashboardNavigation from "~/components/navigation/DashboardNavigation";
import { getProtectedSession } from "~/session";

import { Outlet, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@vercel/remix";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { response, admin } = await getProtectedSession(request);

  return json({ admin }, { headers: response.headers });
};

export default function Layout() {
  const { admin } = useLoaderData<typeof loader>();
  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden fixed top-14 left-0 bottom-0 md:flex md:w-64 md:flex-col flex-shrink-0 bg-white border-r border-r-gray-200 p-5 px-6 z-40">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="">
          <DashboardNavigation admin={admin} />
        </div>
      </div>

      <div className="relative w-full md:pl-64 pt-14 h-screen">
        <Outlet />
      </div>
    </>
  );
}
