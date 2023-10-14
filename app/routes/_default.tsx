import Nav from "~/components/navigation/Nav";

import { Outlet, useLocation, useOutletContext } from "@remix-run/react";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/supabase";

export default function Layout() {
  const { supabase, session, user_data } = useOutletContext<{
    supabase: SupabaseClient<Database>;
    session: Session | null;
    user_data: {
      username: string;
      avatar_url: string;
    } | null;
  }>();
  const { pathname } = useLocation();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  return (
    <>
      <Nav
        pathname={pathname}
        session={session}
        logout={logout}
        user_data={user_data}
      />
      <div className="bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
