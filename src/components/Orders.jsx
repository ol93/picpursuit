import React from "react";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { enqueueSnackbar } from "notistack";

export default function ManageSubscriptions() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the token from wherever you're storing it
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND}/create-portal-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data == null || data.url == undefined) {
      enqueueSnackbar(
        `You don't have any subscriptions yet, check the pricing page to get one!`,
        {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }
      );
      return;
    } else {
      window.location.href = data.url;
    }
  };

  return (
    <div className="w-full flex items-center justify-center mt-5">
      <button
        onClick={handleSubmit}
        className="flex w-[200px] sm:w-[30%] justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-l font-semibold  text-[#FF4500] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
      >
        Manage Subscriptions
      </button>
    </div>
  );
}
