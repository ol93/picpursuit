import React, { useContext, useEffect, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import logo from "../components/Icon/Logo.png";
import { bioContext, dataContext } from "../App.jsx";
import { createClient } from "@sanity/client";

export default function ShowProfile() {
  const data = useContext(dataContext);
  const bio = useContext(bioContext);

  const client = createClient({
    projectId: "kdt18ats",
    dataset: "production",
    useCdn: true,
    apiVersion: "2024-04-22",
  });

  const name = data?.user.name;
  const email = data?.user.email;

  const builder = imageUrlBuilder(client);

  function urlFor(source) {
    return builder.image(source);
  }
  function toSlug(name) {
    return name.toLowerCase().replace(/ /g, "-");
  }

  return (
    <div className="bg-gradient-to-r  from-slate-100 to-slate-200 mt-5 flex flex-col mb-5">
      {bio.slug && (
        <div className="card xl:card-side bg-base-100 shadow-xl mx-5 mt-5">
          <div className="xl:w-[350px] bg-slate-100 shadow-xl flex items-center justify-center ml-8 w-[200px]">
            <img
              src={bio.bioImage ? urlFor(bio.bioImage.asset).url() : logo}
              alt=""
            />
          </div>
          <div className="card-body flex flex-col items-start">
            <h2 className="card-title">
              {bio.name ? bio.name : "Edit your Pic Pursuit Profile!"}
            </h2>
            <p className="text-left">{bio.bio}</p>
            <div></div>{" "}
            <h1 className="text-ml flex-no-wrap font-bold">
              {bio.interestedCategories ? "Favorite Categories:" : ""}
            </h1>
            <div className="flex space-x-4 flex-wrap sm:flex-nowrap sm:space-x-2 ">
              {bio.interestedCategories &&
                bio.interestedCategories.map((category, index) => (
                  <a
                    href={`/categories/${toSlug(category.CategoryName)}`}
                    className="text-ml   font-cursive text-slate-500 hover:text-slate-700 hover:underline"
                    key={index}
                  >
                    {" "}
                    {category.CategoryName}
                  </a>
                ))}
            </div>
            {bio && (
              <div className="mt-2">
                <a
                  href={`https://instagram.com/${bio.IG}`}
                  className="mr-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                </a>
                <a href={`mailto:${data.user.email}`}>
                  <EmailIcon />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {!bio.slug && (
        <div className="card xl:card-side bg-base-100 shadow-xl mx-5 mt-5">
          <div className="xl:w-[300px] bg-slate-100 shadow-xl flex items-center justify-center ml-8 w-[200px]">
            <img src={logo} alt="" />
          </div>
          <div className="card-body flex flex-col items-start">
            <h2 className="card-title">Welcome {data.user.name}!</h2>
            <p className="text-left mt-4 font-bold">
              Before you do anything, please edit and upload your Pic Pursuit
              Profile by clicking the edit button on the top right corner!{" "}
            </p>{" "}
            <br />
            <p className="text-left">
              {" "}
              After you have editted your profile, dont forget to set up your
              bank details before you upload photos, we want you to get paid
              every time a photo of yours is purchased! We use Stripe as our
              payment processor, setting up your bank details will only take a
              couple of minutes. After you will have complete oversight in your
              dashboard of all your sales and earnings!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
