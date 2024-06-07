import React, { useContext, useEffect } from "react";
import { dataContext, bioContext } from "../App";

const CheckOnBoarding = () => {
  const data = useContext(dataContext);
  const bio = useContext(bioContext);

  const checkStatus = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/onboarding-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },

        body: JSON.stringify({ stripeConnectId: bio.stripeConnectId }), // replace with actual user id
      }
    );

    if (response.ok) {
      const { url } = await response.json();
      window.location.href = url;
    } else {
    }
  };

  return (
    <div>
      <button
        onClick={handleStartSelling}
        className="flex w-[30%] mx-auto  relative  items-center justify-center rounded-md bg-[#FFA500] hover:bg-slate-400   py-1.5 text-l font-semibold  text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
      >
        Setup your BankDetails
      </button>
      <a
        href="https://dashboard.stripe.com/login"
        className="flex w-[30%] mx-auto  relative  items-center justify-center rounded-md bg-[#FFA500] hover:bg-slate-400   py-1.5 text-l font-semibold  text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
        target="_blank"
      >
        View your Earnings
      </a>
    </div>
  );
};

export default CheckOnBoarding;
