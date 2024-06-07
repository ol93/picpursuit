import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { PhotosContext } from "../components/PhotosContext";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import logo from "../components/Icon/Logo.png";

export default function AlbumsByPhotographer() {
  const client = createClient({
    projectId: "kdt18ats",
    dataset: "production",
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: "2024-04-22", // use current date (YYYY-MM-DD) to target the latest API version
  });

  const builder = imageUrlBuilder(client);

  function urlFor(source) {
    return builder.image(source);
  }

  const { photographerName } = useParams();

  const [photos, setPhotos] = useState([]);
  const [bio, setBio] = useState([]);

  function slugToName(photographerName) {
    const exclude = ["van", "de", "het", "der"]; // add any other words you want to exclude
    return photographerName
      .split("-")
      .map((word) =>
        exclude.includes(word)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }

  function toSlug(name) {
    return name.toLowerCase().replace(/ /g, "-");
  }

  let name;
  if (photographerName) {
    name = slugToName(photographerName);
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      client
        .fetch(
          `*[_type == "Photographer" && name == $name]{
            bioImage{asset}, name, bio, IG, email, slug, interestedCategories[] -> {CategoryName},
            "albums": *[_type == "Album" && photographer._ref == ^._id]{
              name, slug, image{asset}, "photoCount": count(photos)
            }
          }`,
          { name }
        )
        .then((data) => {
          if (data && data.length > 0) {
            setBio(data[0]);
            setPhotos(data[0].albums);
          }
        })
        .catch(console.error);
    }, 10);

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [name]);

  let albumName;
  if (bio && bio.albums && bio.albums.length > 0) {
    albumName = bio.albums[0].name;
  }

  let albumNames;
  if (bio && bio.albums) {
    albumNames = bio.albums.map((album) => album.name);
  }

  const [searchTerm, setSearchTerm] = useState("");
  // name, details, IG, email, slug, interestedCategories[]
  return (
    <PhotosContext.Provider value={photos}>
      <div className="pt-[110px]">
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 flex flex-col">
          <div className="card xl:card-side bg-base-100 shadow-xl mx-5 mt-5">
            <div className="xl:w-[350px] bg-slate-100 shadow-xl flex items-center justify-center ml-8 w-[200px]">
              <img
                src={bio.bioImage ? urlFor(bio.bioImage.asset).url() : logo}
                alt=""
              />
            </div>
            <div className="card-body flex flex-col sm:items-start">
              <h2 className="card-title">{bio.name}</h2>
              <p className="text-left">{bio.bio}</p>

              <h1 className=" flex text-ml text-left font-bold">
                Favorite Categories:
              </h1>
              <div className="text-left">
                {bio.interestedCategories &&
                  bio.interestedCategories.map((category, index) => (
                    <a
                      href={`/categories/${toSlug(category.CategoryName)}`}
                      className="text-ml  font-cursive text-slate-500 hover:text-slate-700 hover:underline"
                      key={index}
                    >
                      {" "}
                      {category.CategoryName}
                    </a>
                  ))}
              </div>

              <div className="mt-2">
                <a
                  href={`https://www.instagram.com/${bio.IG}`}
                  className="mr-2"
                  target="_blank"
                >
                  <InstagramIcon />
                </a>
                <a href={`mailto:${bio.email}`}>
                  <EmailIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="-mb-10 max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Albums
            </h2>
          </div>

          <div className="card-section w-full justify-center items-center flex flex-row flex-wrap gap-5 mb-10">
            {photos
              .filter((photo) =>
                photo.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((photo) => {
                const albumSlug = toSlug(photo.name);
                return (
                  <div
                    className="card card-compact bg-gradient-to-r from-slate-100 to-slate-150 shadow-xl w-[320px] h-[320px] rounded-lg flex flex-col justify-between overflow-hidden transition-transform transform hover:scale-105 hover:cursor-pointer"
                    key={photo.name}
                  >
                    {albumSlug && (
                      <Link
                        to={`/photographers/${photographerName}/${albumSlug}`}
                      >
                        <figure className=" h-[250px] -ml-10 -mt-10 -mr-10 ">
                          {" "}
                          <img
                            src={photo.image ? urlFor(photo.image).url() : ""}
                            alt={photo.name}
                          />
                          <div className="absolute top-0 right-0 hover:cursor-pointer hover:scale-105"></div>
                        </figure>
                        <div className=" h-[20px] flex flex-col sm:mb-5 sm:text-ml font-bold text-sm mt-5  items-center  justify-around text-black ">
                          <div className="">
                            <h3 className="">Album-name: {photo.name}</h3>
                          </div>
                          <p className="">Photos: {photo.photoCount}</p>
                          <div className=""></div>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </PhotosContext.Provider>
  );
}
