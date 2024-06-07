import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import logo from "./Icon/Logo.png";
import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";
import { duration } from "@mui/material";
import { dataContext } from "../App.jsx";

const UploadBio = () => {
  const categories = {
    Abstract: "Abstract",
    Animals: "Animals",
    "Black and White": "Black/White",
    Documentary: "Documentary",
    Flowers: "Flowers",
    Landscape: "Landscape",
    Macro: "Macro",
    Nature: "Nature",
    Pets: "Pets",
    Portrait: "Portrait",
    Sports: "Sports",
    "Still life": "Still Life",
    Street: "Street",
    "Street Art": "Street Art",
    Travel: "Travel",
    Wildlife: "Wildlife",
  };

  // FormData

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const data = useContext(dataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setValue("name", data.user.name);
      setValue("email", data.user.email);
    }
  }, [data, isSubmitting]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Create a new FormData instance
    const formData = new FormData();

    // Iterate over the 'data' object and append each key-value pair to 'formData'
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === "categories") {
          // If the key is 'categories', stringify it before appending
          formData.append(key, JSON.stringify(data[key]));
        } else if (key !== "bioImage") {
          formData.append(key, data[key]);
        }
      }
    }

    if (data.bioImage && data.bioImage.length > 0) {
      formData.append("bioImage", data.bioImage[0]);
    }

    // Send a POST request to the server
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/uploadBio`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (response.data.error) {
      enqueueSnackbar("Error while editing profile", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      return;
    }

    enqueueSnackbar(
      "Edited profile succesfully, your profile should be updated in +- 20 seconds!",
      {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      }
    );
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="mt-5 mb-5">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <img className="absolute w-[80px] m-5" src={logo} alt="" />
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form
            className="space-y-6 mt-20"
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
          >
            <div className="">
              <h1 className="text-[30px] mb-10 font-bold">
                Edit your Profile!
              </h1>
            </div>

            <div>
              <label className="block text-xl flex font-medium leading-6 text-gray-900">
                Name:
              </label>
              <div className="mt-2 flex flex-row items-center">
                {data && data.user.name}
                <input
                  type="hidden"
                  {...register("name")}
                  value={data ? data.user.name : ""}
                />
              </div>
            </div>
            <div>
              <label className="block text-xl flex font-medium leading-6 text-gray-900">
                Email:
              </label>
              <div className="mt-2 flex flex-row items-center">
                {data && data.user.email}
                <input
                  type="hidden"
                  {...register("email")}
                  value={data ? data.user.email : ""}
                />
              </div>

              <label className="block text-xl mt-5 flex font-medium leading-6 text-gray-900">
                Favorite Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3  py-4 mt-5 gap-3 rounded shadow bg-slate-100 justify-items-start">
                {Object.entries(categories).map(([key, value]) => (
                  <label className="">
                    <input
                      className="mr-2"
                      type="checkbox"
                      {...register(`categories.${key}`)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xl flex font-medium leading-6 text-gray-900">
                Bio:
              </label>
              <div className="mt-2 flex flex-row items-center">
                <textarea
                  {...register("bio")}
                  rows="4"
                  cols="50"
                  placeholder="Introduce yourself here, this will be shown on your own page. (optional)"
                ></textarea>
              </div>
            </div>

            <label className="block text-xl flex font-medium leading-6 text-gray-900">
              Profile Picture:
            </label>

            <input
              type="file"
              className="mt-10 file-input w-full max-w-xs"
              {...register("bioImage")}
            />

            <div>
              <label className="block text-xl flex font-medium leading-6 text-gray-900">
                IG:
              </label>
              <div className="mt-2 flex flex-row items-center">
                <input
                  placeholder="format: username without `@` (Optional)"
                  {...register("IG")}
                  className="block w-full text-left rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-5 focus:ring-inset focus:ring-grey-600 text-ml sm:leading-6"
                />
              </div>
            </div>

            {!isSubmitting && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-[90%] mx-5  relative  items-center justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white  py-1.5 text-l font-semibold  text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
              >
                {" "}
                Edit Profile{" "}
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
  );
};

export default UploadBio;
