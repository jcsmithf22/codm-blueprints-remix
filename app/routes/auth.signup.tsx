import React from "react";
import { Link, useNavigate, useOutletContext } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import LoginImage from "~/assets/exploded.webp";
import { cn, focusStyles } from "~/lib/utils";
import type { Database } from "~/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import Logo from "~/assets/logo.webp";

type Error = {
  [key: string]: string;
};

export default function SignUp() {
  const navigate = useNavigate();
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>;
  }>();

  const [error, setError] = React.useState<Error>({});
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // add check if email or username is already in use
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
        },
      },
    });
    setLoading(false);
    if (!error) {
      navigate("/");
      return;
    }
    setError({ form: error.message });
  };

  return (
    <div className="h-screen bg-white relative">
      <div className="absolute">
        <Link
          to="/"
          className={cn(
            "p-2 m-2 flex flex-row gap-x-2 items-center text-gray-700 hover:text-gray-900 rounded-md",
            focusStyles
          )}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img className="h-10 w-auto" src={Logo} alt="Your Company" />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className={cn(
                    "font-semibold text-blue-600 hover:text-blue-500 rounded-md",
                    focusStyles
                  )}
                >
                  Login
                </Link>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="username" className="text-sm">
                      Username
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="username"
                        name="username"
                        type="username"
                        autoComplete="off"
                        required
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">
                      Email address
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm">
                      Password
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {error.form && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="password-error"
                    >
                      {error.form}
                    </p>
                  )}

                  {/* <div className="flex items-center justify-end">
                    <div className="text-sm leading-6">
                      <Link
                        to="#"
                        className={cn(
                          "font-semibold text-blue-600 hover:text-blue-500 rounded-md",
                          focusStyles
                        )}
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div> */}

                  <div>
                    <Button className="w-full" type="submit">
                      {loading && (
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      )}
                      Create account
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={LoginImage}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
