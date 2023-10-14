import Nav from "~/components/navigation/Nav";

import { Outlet, useLocation, useOutletContext } from "@remix-run/react";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/supabase";

export default function Layout() {
  const { supabase, session } = useOutletContext<{
    supabase: SupabaseClient<Database>;
    session: Session | null;
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
      <Nav pathname={pathname} session={session} logout={logout} />
      <div className="bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
