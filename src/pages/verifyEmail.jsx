import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../components/Icon/Logo.png";

function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    axios
      .get(`${import.meta.env.VITE_APP_BACKEND}/verify?token=${token}`)
      .then((res) => {
        setLoading(false);
        setSuccess(res.data.success);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        window.location.href = "/signin";
      }, 3000);
    }
  }, [success]);

  if (loading) {
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

          <img className="w-[20%] pt-20 pb-20" src={logo} alt="" />

          <div className="flex flex-col items-center">
            <div className="loading loading-spinner loading-md" />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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

          <img className="w-[20%] pt-20 pb-20" src={logo} alt="" />

          <div className="flex flex-col items-center">
            <div>
              {" "}
              <h1 className="text-xl pb-20 font-bold text-black">
                Verified email successfully!
              </h1>
            </div>

            <div className="loading loading-spinner loading-md" />
          </div>
        </div>
      </div>
    );
  }
  if (!success) {
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

          <img className="w-[20%] pt-20 pb-20" src={logo} alt="" />

          <div className="flex flex-col items-center">
            <div>
              {" "}
              <h1 className="text-xl pb-20 font-bold text-black">
                Someting went wrong, please try again or contact support.
              </h1>
            </div>

            <div className="loading loading-spinner loading-md" />
          </div>
        </div>
      </div>
    );
  }
}

export default VerifyPage;
