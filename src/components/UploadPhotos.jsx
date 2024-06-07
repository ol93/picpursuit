import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import logo from "./Icon/Logo.png";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { dataContext } from "../App.jsx";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

const UploadPhotos = ({ totalPhotoCount }) => {
  const data = useContext(dataContext);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const [showCategories, setShowCategories] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    if (data) {
      setValue("photographer", data.user.name);
      setValue("email", data.user.email);
    }
  }, [data, isSubmitting]);

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

  const validateCapitalization = (value) => {
    const words = value.split(" ");
    for (let word of words) {
      if (word[0] !== word[0].toUpperCase()) {
        return "Every word should start with a capital letter";
      }
    }
    return true;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();

    const photographer = getValues("photographer");
    const email = getValues("email");

    const files = getValues("image");
    if (files.length > 25) {
      enqueueSnackbar("You can only upload a maximum of 25 files.", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
    }

    formData.append("photographer", photographer);
    formData.append("email", email);

    if (!data.photographer || !data.email) {
      enqueueSnackbar(
        "Something went wrong, please refresh the page and try again.",
        {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }
      );

      return;
    }

    formData.append("price", data.price);
    formData.append("album", data.album);

    // Filter out checked categories
    const checkedCategories = Object.keys(data.categories).filter(
      (key) => data.categories[key]
    );
    formData.append("categories", JSON.stringify(checkedCategories));
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }

    if (totalPhotoCount + files.length > 1000) {
      enqueueSnackbar(
        "You have reached the maximum number of photos allowed. Please delete some photos or albums to upload more.",
        {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }
      );
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/uploadPhotos`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      enqueueSnackbar("Photos uploaded successfully", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      reset();
    } catch (error) {
      enqueueSnackbar("Failed to upload photo", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="">
      <div className="sm:mx-auto  sm:w-full sm:max-w-[480px]">
        <img className="absolute w-[80px] m-5" src={logo} alt="" />
        <div className="shadow-xl bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form
            className="space-y-10 mt-20"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <h1 className="text-[30px] mb-10 font-bold">
                Upload your Photos!
              </h1>
              <span className=" text-xl ">Pick your categories:</span>{" "}
              <QuestionMarkCircleIcon
                className="h-5 w-5 mb-1 inline hover:cursor-pointer"
                onClick={() => setShowCategories(!showCategories)}
              />
              {showCategories && (
                <p className="text-sm font-normal">
                  You don't have to select categories, but keep in mind that
                  more people will find your photos if you do.
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 py-4 mt-5 gap-3 rounded shadow bg-slate-100 justify-items-start">
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
              <label className="block text-xl font-medium leading-6 text-gray-900">
                To which Album?{" "}
                <QuestionMarkCircleIcon
                  className="h-5 w-5 inline hover:cursor-pointer"
                  onClick={() => setShowAlbum(!showAlbum)}
                />
                {showAlbum && (
                  <p className="text-sm font-normal">
                    Please make sure the Album name is spelled the same (case
                    sensitive). Also make sure your Album names are capitalized.
                    (Football Game, not Football game){" "}
                  </p>
                )}
              </label>
              <div className="mt-2  flex flex-col items-center">
                <input
                  {...register("album", { validate: validateCapitalization })}
                  placeholder="Existing Album Name"
                  required
                  className="block w-full text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-5 focus:ring-inset focus:ring-grey-600 text-xl sm:leading-6"
                />
                {errors.album && <p>{errors.album.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xl font-medium leading-6 text-gray-900">
                Set your price:{" "}
                <QuestionMarkCircleIcon
                  className="h-5 mb-1 w-5 inline hover:cursor-pointer"
                  onClick={() => setShowPrice(!showPrice)}
                />
                {showPrice && (
                  <p className="text-sm font-normal">
                    Price in Euros. You can set one price for each picture in
                    the album if you upload the photos in bulk. If you want
                    different prices, you can upload the photos one by one.
                  </p>
                )}
              </label>
              <div className="mt-2 flex flex-col items-center">
                <input
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                    min: { value: 1, message: "Price has to be 1€ or more!" },
                    validate: (value) =>
                      !isNaN(value) || "Price must be a number",
                  })}
                  placeholder="€"
                  required
                  className="block w-1/4 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-5 focus:ring-inset focus:ring-grey-600 text-xl sm:leading-6"
                />
                {errors.price && <p>{errors.price.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xl font-medium leading-6 text-gray-900">
                Premium{" "}
                <WorkspacePremiumOutlinedIcon
                  style={{
                    color: "orange",
                    fontSize: "30px",
                    marginBottom: "5px",
                  }}
                />
                <QuestionMarkCircleIcon
                  className="h-5 mb-1 w-5 inline hover:cursor-pointer"
                  onClick={() => setShowPremium(!showPremium)}
                />
                {showPremium && (
                  <p className="text-sm font-normal">
                    If you mark your photos as "Premium", users won't be able to
                    buy them with a subscription. As of now photographers earn a
                    flat fee of 1€ per subscription purchase.
                  </p>
                )}
              </label>
              <div className="mt-2 flex flex-col items-center">
                <input
                  className="mr-2"
                  type="checkbox"
                  {...register(`categories.Premium`)}
                />
              </div>
            </div>

            <input
              type="file"
              multiple
              className="file-input w-full max-w-xs"
              required
              {...register("image", {
                validate: {
                  checkFileType: (value) => {
                    if (value.length > 25) {
                      return "You can only upload a maximum of 25 photos at a time.";
                    }

                    const supportedFormats = [
                      "jpeg",
                      "jpg",
                      "png",
                      "webp",
                      "tiff",
                    ];
                    for (let i = 0; i < value.length; i++) {
                      const fileExtension = value[i].name
                        .split(".")
                        .pop()
                        .toLowerCase();
                      if (!supportedFormats.includes(fileExtension)) {
                        return "Unsupported file type. Please upload jpeg, png, webp or tiff file.";
                      }
                    }
                    return true;
                  },
                },
              })}
            />

            <QuestionMarkCircleIcon
              className="h-5 mt-2 absolute  w-5 inline hover:cursor-pointer"
              onClick={() => setShowFormats(!showFormats)}
            />
            {showFormats && (
              <p className="text-sm font-normal">
                jpeg, png, webp and tiff formats are supported. Raw, arw formats
                are not. Maximum photo size is 6MB. Max 25 photos per upload.{" "}
              </p>
            )}
            {!isSubmitting && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-[90%] mx-5  relative  items-center justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white  py-1.5 text-l font-semibold  text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
              >
                {" "}
                Upload Photos{" "}
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

export default UploadPhotos;
