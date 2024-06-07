import React, { useContext, useState, useEffect } from "react";
import { bioContext, dataContext } from "../App.jsx";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import CreateAlbum from "./CreateAlbum.jsx";
import UploadPhotos from "./UploadPhotos.jsx";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

const showAlbumsProfilePage = () => {
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
  function createSlug(name) {
    return name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const albumRef = React.createRef();
  const photoRef = React.createRef();

  React.useEffect(() => {
    if (showCreateAlbum && albumRef.current) {
      albumRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showCreateAlbum]);

  const [showUploadPhotos, setShowUploadPhotos] = useState(false);

  React.useEffect(() => {
    if (showUploadPhotos && photoRef.current) {
      photoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showUploadPhotos]);
  const data = useContext(dataContext);
  const bio = useContext(bioContext);
  const confirm = useConfirm();

  const [albums, setAlbums] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  let totalPhotoCount = 0;
  if (bio && bio.albums) {
    totalPhotoCount = bio.albums.reduce(
      (total, album) => total + album.photoCount,
      0
    );
  }
  async function shareLink(albumName) {
    if (navigator.share) {
      navigator
        .share({
          url: `${import.meta.env.VITE_APP_URL}/photographers/${createSlug(
            data.user.name
          )}/${createSlug(albumName)}`,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Share not supported on this browser, do it manually.");
    }
  }

  const photoLimitReached = totalPhotoCount >= 1000;

  async function sharePhoto(albumName, albumImage) {
    const response = await fetch(urlFor(albumImage._ref).url());
    const blob = await response.blob();

    // Create a File object from the Blob
    const file = new File([blob], `${albumName}.jpg`, { type: blob.type });

    if (navigator.share) {
      navigator
        .share({
          files: [file],
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Share not supported on this browser, do it manually.");
    }
  }

  useEffect(() => {
    if (bio && bio.albums && !fetched) {
      setLoading(true);
      bio.albums.forEach((album) => {
        console.log(bio); // logs the _id of each album
      });
      setAlbums(bio.albums);
      setLoading(false);
      setFetched(true);
    }
  }, [bio, fetched]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="loading loading-spinner loading-md" />
      </div>
    );
  }

  // Rest of your component...

  const deleteAlbum = async (albumId, albumName) => {
    confirm({
      description: `Are you sure you want to delete the album "${albumName}"?`,
    })
      .then(async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_APP_BACKEND}/deleteAlbum`,
            { albumId: albumId.toString() },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );

          enqueueSnackbar(
            "Album deleted successfully, it can take some time for the changes to reflect.",
            {
              variant: "default",
              anchorOrigin: { vertical: "bottom", horizontal: "left" },
            }
          );
          // If the request was successful, remove the album from the local state
          setAlbums(albums.filter((album) => album._id !== albumId));
        } catch (error) {
          // If the request failed, log the error
          console.error("Failed to delete album", error);
          enqueueSnackbar("Failed to delete album", {
            variant: "default",
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
          });
        }
      })
      .catch(() => {
        // User clicked "cancel" or closed the confirmation dialog
        console.log("Deletion cancelled");
        enqueueSnackbar("Deletion cancelled", {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        });
      });
  };

  return (
    <div className=" mt-10  mb-10 z-20">
      {bio && (
        <div className=" mx-5 mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            My Albums{" "}
            <svg
              className="w-8 z-20 mb-2 inline ml-2 hover:cursor-pointer hover:scale-110"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              onClick={() => setShowCreateAlbum(!showCreateAlbum)} // Toggle visibility on click
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </h2>
          <p>Photo Count: {totalPhotoCount}/1000</p>
        </div>
      )}

      <div ref={albumRef}>
        {bio && showCreateAlbum && (
          <CreateAlbum totalPhotoCount={totalPhotoCount} />
        )}
      </div>
      {bio && (
        <div className="card-section w-full justify-center items-center flex flex-row flex-wrap gap-5 mb-10">
          {bio.albums.map((album) => (
            <div
              className="card card-compact bg-gradient-to-r from-slate-100 to-slate-150 shadow-xl w-[250px] h-[250px] rounded-lg flex flex-col justify-between overflow-hidden transition-transform transform hover:scale-105 hover:cursor-pointer"
              key={album.name}
            >
              <DeleteOutlineIcon
                onClick={() => deleteAlbum(album._id, album.name)}
                className="w-1/2 absolute top-2 right-2 hover:cursor-pointer hover:scale-110"
              />

              <figure className=" h-[250px] -ml-10 -mt-10 -mr-10 ">
                <img
                  src={album.image ? urlFor(album.image.asset).url() : ""}
                  alt={album.name}
                />
                <div className="absolute top-0 right-0 hover:cursor-pointer hover:scale-105"></div>
              </figure>
              <div className=" h-[20px] mb-0 flex flex-col sm:mb-5 text-sm sm:text-ml font-bold  items-center  justify-around text-black ">
                <div className="flex flex-row">
                  <h3 className="">Album-name: {album.name}</h3>
                </div>
                <p className="">Photos: {album.photoCount}</p>
                <a
                  href={`${
                    import.meta.env.VITE_APP_URL
                  }/photographers/${createSlug(data.user.name)}/${createSlug(
                    album.name
                  )}`}
                >
                  <RemoveRedEyeOutlinedIcon className="absolute bottom-2 hover:scale-110 right-2" />
                </a>
                <div className="block sm:hidden">
                  <IosShareOutlinedIcon
                    onClick={() => sharePhoto(album.name, album.image.asset)}
                    className="absolute bottom-3 hover:scale-110 left-2"
                  />
                  <div className="block sm:hidden">
                    <InsertLinkOutlinedIcon
                      onClick={() => shareLink(album.name)}
                      className="absolute bottom-2 hover:scale-110 left-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {bio && (
        <div className="mx-5 mb-10">
          <h2 className="text-2xl font-bold tracking-tight py-10  text-gray-900">
            Add Photos to Existing Albums{" "}
            <svg
              onClick={() => setShowUploadPhotos(!showUploadPhotos)}
              className="w-8 mb-1 inline ml-2 hover:cursor-pointer hover:scale-110"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </h2>
        </div>
      )}

      <div ref={photoRef}>
        {" "}
        {showUploadPhotos && <UploadPhotos totalPhotoCount={totalPhotoCount} />}
      </div>
    </div>
  );
};

export default showAlbumsProfilePage;
