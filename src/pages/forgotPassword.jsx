import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import logo from "../components/Icon/Logo.png";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    reset,
    FormData,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let email = getValues("Email");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/forgotPassword`,
        {
          email: email,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        enqueueSnackbar("Password reset link sent successfully", {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        });
      }

      // handle response here
    } catch (error) {
      enqueueSnackbar("Password reset link failed", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      // handle error here
    }
    setIsSubmitting(false);
  };

  return (
    <div className="pt-[110px]">
      <div className="relative pb-20 bg-gradient-to-r from-slate-100 to-slate-200 flex flex-col items-center justify-center">
        <div
          className="absolute hidden sm:block w-[70] h-[30%] inset-y-10 inset-x-[20%]     overflow-hidden blur-3xl "
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

        <div className="flex flex-col items-center">
          <div>
            {" "}
            <form
              className="space-y-10 mt-20"
              method="POST"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="text-[30px] mb-10 font-bold">Forgot Password</h1>

              <div>
                <label className="block text-xl flex font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2 flex flex-row items-center">
                  <input
                    placeholder="Your registered email"
                    {...register("Email")}
                    className="block w-full text-left rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-5 focus:ring-inset focus:ring-grey-600 text-ml sm:leading-6"
                  />
                </div>
              </div>
              {!isSubmitting && (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-ml font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                >
                  Get link to reset password
                </button>
              )}
              {isSubmitting && (
                <div className="flex flex-col items-center w-full">
                  <div className="flex w-[50px]  relative  items-center justify-center loading loading-spinner loading-md" />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
