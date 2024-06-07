import React, { Fragment, useState, useRef } from "react";
import logo from "../components/Icon/Logo.png";
import animals from "../assets/CategoryPhotos/Animals.jpeg";
import blackandwhite from "../assets/CategoryPhotos/BlackAndWhite.jpeg";
import documentary from "../assets/CategoryPhotos/Documentary.jpeg";
import macro from "../assets/CategoryPhotos/Macro.jpeg";
import nature from "../assets/CategoryPhotos/Nature.jpeg";
import pets from "../assets/CategoryPhotos/Pets.jpg";
import street from "../assets/CategoryPhotos/Street.jpeg";
import travel from "../assets/CategoryPhotos/Travel.jpeg";
import wildlife from "../assets/CategoryPhotos/Wildlife.jpeg";
import landscape from "../assets/CategoryPhotos/Landscape.jpeg";
import portrait from "../assets/CategoryPhotos/Portrait.jpg";
import sports from "../assets/CategoryPhotos/Sports.jpg";
import abstract from "../assets/CategoryPhotos/Abstract.jpeg";
import flowers from "../assets/CategoryPhotos/Flowers.jpg";
import streetart from "../assets/CategoryPhotos/Streetart.jpeg";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const photoCategories = [
    {
      image: animals,
      name: "Animals",
      url: "/categories/animals",
    },

    {
      image: abstract,
      name: "Abstract",
      url: "/categories/abstract",
    },

    {
      image: blackandwhite,
      name: "Black/White",
      url: "/categories/black-and-white",
    },
    {
      image: documentary,
      name: "Documentary",
      url: "/categories/documentary",
    },

    {
      image: flowers,
      name: "Flowers",
      url: "/categories/flower",
    },
    {
      image: landscape,
      name: "Landscape",
      url: "/categories/landscape",
    },
    {
      image: macro,
      name: "Macro",
      url: "/categories/macro",
    },
    {
      image: nature,
      name: "Nature",
      url: "/categories/nature",
    },
    {
      image: pets,
      name: "Pets",
      url: "/categories/pets",
    },
    {
      image: portrait,
      name: "Portrait",
      url: "/categories/portrait",
    },

    {
      image: sports,
      name: "Sports",
      url: "/categories/sports",
    },

    {
      image: street,
      name: "Street",
      url: "/categories/street",
    },

    {
      image: streetart,
      name: "Street Art",
      url: "/categories/street-art",
    },

    {
      image: travel,
      name: "Travel",
      url: "/categories/travel",
    },
    {
      image: wildlife,
      name: "Wildlife",
      url: "/categories/wildlife",
    },
  ];

  const [categories, setCategories] = useState([photoCategories]);

  return (
    <div className="pt-[110px]">
      <div className="flex flex-col relative items-center justify-center    bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="px-4 py-6 sm:px-6">
          <h3 className="mt-10 text-4xl font-semibold leading-7 text-gray-900 mb-10">
            Categories
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
            placeholder="Browse categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2"
          />
        </div>
        <div className="card-section w-full mb-10  justify-center items-center flex flex-row flex-wrap gap-5">
          {photoCategories
            .filter((category) =>
              category.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((photoCategories) => (
              <div
                className="card card-compact card-side bg-gradient-to-r from-slate-100 to-slate-150 shadow-xl w-[320px] aspect-[3/2] hover:scale-105 hover:cursor-pointer"
                key={photoCategories.name}
              >
                <figure className="w-[250px] -ml-8">
                  <img
                    className="h-[150px] w-[250px]"
                    src={photoCategories.image}
                    alt={photoCategories.name}
                  />
                </figure>
                <div className="card-body w-[100px] ml-4 text-sm items-center justify-space-around">
                  <h1 className="card-title text-base ">
                    {photoCategories.name}
                  </h1>
                  <div className="card-actions justify-end">
                    <a
                      href={photoCategories.url}
                      className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                    >
                      Go to Category
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>{" "}
    </div>
  );
};

export default Categories;
