import React from "react";
import { Link, useNavigate, useOutletContext } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowLeftIcon } from "lucide-react";
import LoginImage from "~/assets/winter-gun.avif";
import { cn, focusStyles } from "~/lib/utils";
import type { Database } from "~/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function SignUp() {
  const navigate = useNavigate();
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>;
  }>();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
        },
      },
    });
    if (!error) {
      navigate("/");
    }
    console.log(error);
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
              <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
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
                      Create account
                    </Button>
                  </div>
                </form>
              </div>

              {/* <div className="mt-6">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link
                      to="#"
                      className="w-full flex items-center justify-center gap-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="#FFC107"
                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                        <path
                          fill="#FF3D00"
                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        ></path>
                        <path
                          fill="#4CAF50"
                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        ></path>
                        <path
                          fill="#1976D2"
                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                      </svg>
                      <span className="text-sm font-semibold leading-6">
                        Google
                      </span>
                    </Link>
                  </Button>
                </div>
              </div> */}
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
