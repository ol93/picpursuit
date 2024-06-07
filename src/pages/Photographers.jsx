import React, { useState, useEffect } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import logo from "../components/Icon/Logo.png";

export const client = createClient({
  projectId: "kdt18ats",
  dataset: "production",
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2024-04-22", // use current date (YYYY-MM-DD) to target the latest API version
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

const Photographers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [photographers, setPhotographers] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      client
        .fetch(
          '*[_type == "Photographer"]{ bioImage, name, slug, interestedCategories[] -> {CategoryName}}'
        )
        .then((data) => {
          setPhotographers(data);
        })
        .catch(console.error);
    }, 10);

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="pt-[110px]">
      <div className="relative flex flex-col items-center justify-center  bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="px-4 py-6 sm:px-6 mt-10">
          <h3 className="text-4xl font-semibold leading-7 text-gray-900 mb-10">
            Photographers
          </h3>
        </div>

        <div className="flex justify-center items-center mb-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Browse Photographers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2"
          />
        </div>
        <div className="card-section mb-10 w-full justify-center items-center flex flex-row flex-wrap gap-5">
          {photographers
            .filter((photographer) =>
              photographer.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((photographer) => (
              <div
                className="card card-side bg-gradient-to-r from-slate-100 to-slate-150 shadow-xl w-[400px]  aspect-[3/2] hover:scale-105 hover:cursor-pointer"
                key={photographer.name}
              >
                <figure className="">
                  <img
                    className="w-[150px]"
                    src={
                      photographer.bioImage
                        ? urlFor(photographer.bioImage).url()
                        : logo
                    }
                    alt={photographer.name}
                  />
                </figure>
                <div className="card-body flex flex-col justify-center">
                  <h3 className="card-title">{photographer.name}</h3>
                  {photographer.interestedCategories &&
                    photographer.interestedCategories.length > 0 && (
                      <>
                        <p>
                          <span className="font-bold">Categories:</span>
                        </p>
                        {photographer.interestedCategories
                          .slice(0, 3)
                          .map((category, index) => (
                            <p className="text-sm" key={index}>
                              {category.CategoryName}
                            </p>
                          ))}
                      </>
                    )}
                  {photographer.slug.current && (
                    <a
                      href={`/photographers/${photographer.slug.current}`}
                      className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                    >
                      View Page
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Photographers;

// *[_type == 'Photographer']{ bioImage, name   }

// *[_type == 'Photographer' && name == "Henk van Wijk"] {interestedCategories[] -> {CategoryName}}
