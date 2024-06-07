import React, { useContext, useEffect, useState } from "react";
import { OnboardingCompleteContext } from "../App";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckIcon from "@mui/icons-material/Check";

const StartSelling = () => {
  const handleStartSelling = async () => {
    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND}/sell`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      // replace with actual user id
    });

    if (response.ok) {
      const { url } = await response.json();
      window.location.href = url;
    } else {
      console.error("Failed to create Stripe account");
    }
  };

  const isOnboardingComplete = useContext(OnboardingCompleteContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 900);
  }, []);

  if (loading) {
    return <div className="loading loading-spinner loading-md" />;
  } else {
    return (
      <div className="flex  w-[100%] flex-row items-center justify-center">
        {isOnboardingComplete && (
          <div className="absolute left-5 flex flex-col sm:left-10 sm:flex sm:flex-row ">
            {" "}
            <AccountBalanceIcon className="bg-[#FF4500]" />{" "}
            <CheckIcon className="" />
          </div>
        )}
        {!isOnboardingComplete && (
          <button
            onClick={handleStartSelling}
            className="flex w-[200px] sm:w-[30%] justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-l font-semibold  text-[#FF4500] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
          >
            Setup your Bank Details
          </button>
        )}
        {isOnboardingComplete && (
          <a
            href="https://dashboard.stripe.com/login"
            className="flex w-[200px] sm:w-[30%] justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-l font-semibold  text-[#FF4500] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
            target="_blank"
          >
            Check your Earnings
          </a>
        )}
      </div>
    );
  }
};

export default StartSelling;
