import React, { useState } from "react";
import logo from "../components/Icon/Logo.png";
import Lottie from "lottie-react";
import picPursuitfinal from "../components/LottieAnimations/PicPursuit.json";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { GoogleLogin } from "@react-oauth/google";

export default function SignUpPage() {
  const [name, setName] = useState(""); // New state variable for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState(""); // New state variable for repeated password

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== repeatPassword) {
      enqueueSnackbar("Passwords do not match, please try again", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    });

    if (response.ok) {
      const data = await response.json();

      console.log(data);

      localStorage.setItem("token", data.token);
      enqueueSnackbar("Signup successful, verify email to sign in!", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });

      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
      // handle successful login here, e.g. by updating the app state
    } else {
      enqueueSnackbar("Email already exists", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      // handle error here
    }
  };
  return (
    <div className="pt-[110px]">
      <div className="relative bg-gradient-to-r from-slate-100 to-slate-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div
          className="absolute hidden sm:block  w-[70] h-[30%] inset-y-0 inset-x-[0%]     overflow-hidden blur-3xl "
          aria-hidden="true"
        >
          <div
            className="relative aspect-[1155/678] w-[100%] h-[100%] inset-x-0 bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-20 sm:opacity-20"
            style={{
              clipPath:
                "polygon(0% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 0% 1%)",
            }}
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Lottie
            animationData={picPursuitfinal}
            className="-mt-10 -mb-20 w-3/4 mx-auto"
            loop={false}
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up to create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSignup} method="POST">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength={8}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="repeat-password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Repeat Password
                </label>
                <div className="mt-2">
                  <input
                    id="repeat-password"
                    name="repeat-password"
                    type="password"
                    minLength={8}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="/forgotpassword"
                    className="font-semibold text-black hover:text-slate-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                >
                  Sign up
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
              </div>

              <div>
                <div className="relative mt-10">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex flex-col items-center  justify-center text-sm font-medium leading-6">
                    <span className="-mt-5 mb-5">Or</span>

                    <GoogleLogin
                      size={"large"}
                      type="standard"
                      onSuccess={(response) => {
                        // sending token to server for authentication
                        fetch(
                          `${import.meta.env.VITE_APP_BACKEND}/google-signin`,
                          {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${response.credential}`,
                            },
                          }
                        )
                          .then((response) => response.json()) // Convert the response to JSON
                          .then((data) => {
                            localStorage.setItem("token", data.token);
                            enqueueSnackbar("Logged in Succesfully!", {
                              variant: "default",
                              anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                              },
                            });
                            setTimeout(() => {
                              window.location.href = "/";
                            }, 2000);
                          })
                          // Log the response data
                          .catch((error) => console.error("Error:", error)); // Log any errors
                      }}
                      onFailure={(response) => console.log(response)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
