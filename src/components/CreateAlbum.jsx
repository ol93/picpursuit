import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import logo from "./Icon/Logo.png";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ConstructionOutlined } from "@mui/icons-material";
import { dataContext } from "../App.jsx";

/* So im trying to have a photo upload to Amazon S3, 
every photo needs to contain a price, album, and categories 
are optional the pictures will be send to sanity where they will 
receive an ID, to make sure all the photos will get stored in S3 I will
 put a timestamp on the filename to make sure every photo is unique, that name
  including the timestamp will be the name in sanity as well, but I dont 
  want that name to show on the site per se. I Want to use multer for this, 
  as they have an option to upload directly to S3, I want the files to not 
  be larger than 5mb and there shouldnt be arw or raw types as they are not 
  suported by sharp which i am using in lambda */

const CreateAlbum = ({ totalPhotoCount }) => {
  const data = useContext(dataContext);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const files = getValues("image");
  const [showCategories, setShowCategories] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (
        word[0] !== word[0].toUpperCase() ||
        word.slice(1) !== word.slice(1).toLowerCase()
      ) {
        return "Only the first letter of each word should be capitalized";
      }
    }
    return true;
  };

  const noSpecialChars = (value) => {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialChars.test(value)) {
      return "Special characters are not allowed";
    }
    return true;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("photographer", data.photographer);
    formData.append("email", data.email);

    if (!data.photographer || !data.email) {
      enqueueSnackbar(
        "Something went wrong, please try logging out and in again and try again.",
        {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }
      );
    }

    const files = getValues("image");

    if (files.length > 1) {
      enqueueSnackbar("Please select one cover photo for your album", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      return;
    }

    formData.append("price", data.price);
    formData.append("album", data.album);

    // Filter out checked categories
    const checkedCategories = Object.keys(data.categories).filter(
      (key) => data.categories[key]
    );
    formData.append("categories", JSON.stringify(checkedCategories));
    formData.append("image", files[0]);

    if (totalPhotoCount + 1 > 1000) {
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
      enqueueSnackbar(
        "Album created successfully, please wait a minute before uploading photos to this Album.",
        {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }
      );

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
      <div className="mb-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <img className="absolute w-[80px] m-5" src={logo} alt="" />
        <div className="bg-gradient-to-r shadow-xl from-slate-100 to-slate-200 px-6 py-12  sm:rounded-lg sm:px-12">
          <form
            className="space-y-10 mt-20 pb-5"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <h1 className="text-[30px] font-bold">Create a new Album</h1>
              <p className="mb-10">
                <a href="/tou">Terms of Use</a>
              </p>
              <br />
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
                Name your album:{" "}
                <QuestionMarkCircleIcon
                  className="h-5 w-5 inline hover:cursor-pointer"
                  onClick={() => setShowAlbum(!showAlbum)}
                />
                {showAlbum && (
                  <p className="text-sm font-normal">
                    Please provide an Album name. If you want to add photos to
                    an existing Album please go to Add Photos.{" "}
                  </p>
                )}
              </label>
              <div className="mt-2  flex flex-col items-center">
                <input
                  {...register("album", {
                    validate: {
                      validateCapitalization: validateCapitalization,
                      noSpecialChars: noSpecialChars,
                    },
                    required: true,
                    minLength: {
                      value: 3,
                      message:
                        "Album name has to be at least 3 characters long.",
                    },
                  })}
                  placeholder="Album name"
                  required
                  className="block w-[200px] text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-5 focus:ring-inset focus:ring-grey-600 text-xl sm:leading-6"
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
                    Price in Euros. This will be the price of your Album-Cover
                    photo, which will also be the first photo in your album.
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
            <input
              type="file"
              className="file-input w-full max-w-xs"
              required
              {...register("image", {
                validate: {
                  checkFileType: (value) => {
                    const supportedFormats = [
                      "jpeg",
                      "jpg",
                      "png",
                      "webp",
                      "tiff",
                    ];
                    const fileExtension = value[0].name
                      .split(".")
                      .pop()
                      .toLowerCase();
                    return (
                      supportedFormats.includes(fileExtension) ||
                      "Unsupported file type. Please upload jpeg, png, webp or tiff file."
                    );
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
                are not. Maximum photo size is 6MB.{" "}
              </p>
            )}
            {!isSubmitting && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-[90%] mx-5  relative  items-center justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white  py-1.5 text-l font-semibold  text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
              >
                {" "}
                Create Album{" "}
              </button>
            )}
            {isSubmitting && (
              <div className="flex flex-col items-center w-full">
                <div className="flex w-[50px]  relative  items-center justify-center loading loading-spinner loading-md" />
              </div>
            )}{" "}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbum;
