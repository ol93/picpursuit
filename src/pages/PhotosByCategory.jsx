import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import AddToCard from "../components/AddToCart";
import { PhotosContext } from "../components/PhotosContext";
import AddToCart from "../components/AddToCart";

export default function PhotosByCategory() {
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

  const { categoryName } = useParams();
  const capitalizedCategory =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      client
        .fetch(
          `*[_type == 'Photo' && $capitalizedCategory in category[]->CategoryName]{
          _id, image{asset}, price,
          "categories": category[]->{CategoryName}, 
          "photographer": photographer->_id,
          "stripeConnectId": photographer->stripeConnectId,
          name,
          details
        }`,
          { capitalizedCategory }
        )
        .then((data) => {
          setPhotos(data);
        })
        .catch(console.error);
    }, 10);

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [capitalizedCategory]);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <PhotosContext.Provider value={photos}>
      <div className="pt-[110px]">
        <div className="bg-gradient-to-r pb-5 from-slate-100 to-slate-200 ">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Category: &nbsp; {capitalizedCategory}
            </h2>
          </div>

          <div className="card-section w-full justify-center items-center flex flex-row flex-wrap gap-5">
            {photos
              .filter((photo) =>
                photo.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((photo, index) => (
                <div
                  onClick={() => {
                    setSelectedPhotoIndex(index);

                    document.getElementById("my_modal_2").showModal();
                  }}
                  className="card card-compact bg-gradient-to-r from-slate-100 to-slate-150 shadow-xl w-[320px] h-[320px] rounded-lg flex flex-col justify-between overflow-hidden transition-transform transform hover:scale-105 hover:cursor-pointer"
                  key={photo.name}
                >
                  <figure className=" h-[250px] -ml-10 -mr-10 -mt-10 -mb-10">
                    <img src={urlFor(photo.image).url()} alt={photo.name} />{" "}
                    <div className="absolute top-0 right-0 hover:cursor-pointer hover:scale-105"></div>
                  </figure>
                  <div className=" h-[20px] flex flex-row  items-center  justify-between text-black shadow-sm ">
                    <h3 className="">
                      Name: {photo.name.substring(14).slice(0, 13)}
                    </h3>
                    <p className="">Price: €{photo.price}</p>
                    <div className="">
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
                            ? urlFor(photos[selectedPhotoIndex].image).url()
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
    </PhotosContext.Provider>
  );
}
