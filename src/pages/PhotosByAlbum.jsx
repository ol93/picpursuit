import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import AddToCart from "../components/AddToCart";

export default function PhotosByAlbum() {
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

  const [isLoading, setIsLoading] = useState(true);

  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const { photographerName, albumName } = useParams();

  function slugToName(name) {
    const exclude = ["van", "de", "het", "der"]; // add any other words you want to exclude
    return name
      .split("-")
      .map((word) =>
        exclude.includes(word)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }

  const capitalizedAlbum = slugToName(albumName);
  const capitalizedPhotographer = slugToName(photographerName);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      client
        .fetch(
          `*[_type == "Album" && photographer->name == "${capitalizedPhotographer}" && name == "${capitalizedAlbum}"  ]

        {
        
          photos[]->
          {"categories": category[]->{CategoryName},
        
             _id, image{asset}, price, name, details, "stripeConnectId": photographer->stripeConnectId, "photographer": photographer->_id}}
        `,
          { capitalizedPhotographer, capitalizedAlbum }
        )
        .then((data) => {
          const allPhotos = data.flatMap((album) => album.photos);
          setPhotos(allPhotos);
          setIsLoading(false);
        })
        .catch(console.error);
    }, 10);

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [capitalizedAlbum, capitalizedPhotographer]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-[110px]">
      <div className="bg-gradient-to-r pb-5 from-slate-100 to-slate-200 ">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Album: &nbsp;{capitalizedAlbum}
          </h2>
        </div>

        <div className="card-section w-full justify-center items-center flex flex-row flex-wrap gap-5">
          {photos &&
            photos.map((photo, index) => (
              <div
                onClick={() => {
                  setSelectedPhotoIndex(index);

                  document.getElementById("my_modal_2").showModal();
                }}
                className="card card-compact bg-gradient-to-r from-slate-100 to-slate-150 shadow-xl w-[150px] h-[150px] sm:w-[320px] sm:h-[320px] rounded-lg flex flex-col justify-between overflow-hidden transition-transform transform hover:scale-105 hover:cursor-pointer"
                key={photo.name}
              >
                <figure className=" sm:h-[250px] h-[120px] -ml-10 -mr-10 -mt-10 sm:-mb-10">
                  {" "}
                  <img
                    src={
                      photo.image && photo.image.asset
                        ? urlFor(photo.image.asset).url()
                        : ""
                    }
                    alt={photo.name}
                  />
                  <div className="absolute top-0 right-0 hover:cursor-pointer hover:scale-105"></div>
                </figure>
                <div className="  sm:mt-0 sm:-mb-2  h-[30px]  -mb-5 flex flex-col sm:flex-row text-sm sm:text-ml  items-center justify-between  text-black ">
                  <h3 className="">{photo.name.substring(14).slice(0, 13)}</h3>
                  <p className="text-sm sm:text-xl font-bold sm:ml-0">
                    {" "}
                    €{photo.price}
                  </p>
                  <div className="hidden sm:block">
                    <AddToCart product={photo} />
                  </div>
                </div>

                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog id="my_modal_2" className="modal">
                  <div className="modal-box bg-slate-100">
                    <img
                      src={
                        selectedPhotoIndex !== null &&
                        photos[selectedPhotoIndex]
                          ? urlFor(photos[selectedPhotoIndex].image.asset).url()
                          : ""
                      }
                      alt={
                        selectedPhotoIndex !== null &&
                        photos[selectedPhotoIndex]
                          ? photos[selectedPhotoIndex].name
                          : ""
                      }
                      style={{ maxWidth: "100%" }}
                    />

                    <div className="flex flex row justify-around items-center mt-3">
                      <p>
                        Full Resolution:{" "}
                        {selectedPhotoIndex !== null &&
                        photos[selectedPhotoIndex]
                          ? photos[selectedPhotoIndex].details
                          : ""}
                      </p>
                      <AddToCart
                        product={
                          selectedPhotoIndex !== null &&
                          photos[selectedPhotoIndex]
                            ? photos[selectedPhotoIndex]
                            : null
                        }
                      />
                    </div>
                  </div>

                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
