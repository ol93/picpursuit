import React, { createContext, useContext, useEffect, useState } from "react";
import Timer from "../components/CountDown.jsx";
import UploadBio from "../components/UploadBio.jsx";
import ShowProfile from "./ShowProfile.jsx";
import EditIcon from "@mui/icons-material/Edit";
import credits from "../components/Icon/Credits.png";
import ShowAlbumsProfilePage from "../components/ShowAlbumsProfilePage.jsx";
import { dataContext, bioContext, OnboardingCompleteContext } from "../App.jsx";
import StartSelling from "../components/StartSelling.jsx";
import ManageSubscriptions from "../components/Orders.jsx";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const isOnboardingComplete = useContext(OnboardingCompleteContext);

  const data = useContext(dataContext);
  const bio = useContext(bioContext);
  const bioRef = React.createRef();

  // Scroll to the upload bio section whenever isEditing changes
  React.useEffect(() => {
    if (isEditing && bioRef.current) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isEditing]);

  return (
    <div className="pt-[110px]">
      <div className="relative bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 shadow sm:rounded-lg">
          <div className="">
            <div className="relative">
              {" "}
              <ShowProfile />
              <EditIcon
                className="absolute right-8 top-8 hover:cursor-pointer hover:scale-105"
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                {" "}
              </EditIcon>
              <div className="relative flex-row mb-10">
                {bio.slug && <StartSelling />}
                <ManageSubscriptions />
              </div>
              {isEditing && data && (
                <div ref={bioRef}>
                  <UploadBio />
                </div>
              )}
            </div>

            {isOnboardingComplete && <ShowAlbumsProfilePage />}

            <div></div>

            <div className="stats mx-5 shadow-xl sm:mx-5 flex flex-col mb-5 sm:flex-row bg-slate-100 text-primary-content">
              <div className="stat">
                <div className="stat-title mb-2">Pic Credits</div>
                <div className="flex flex-row space-around justify-center">
                  {data && (
                    <h1 className="text-black font-bold mr-2 text-[30px]">
                      {data && data.user.credits}
                    </h1>
                  )}
                  <img className="w-10" src={credits} alt="" />
                </div>
                <div className="stat-actions"></div>
              </div>

              <div className="stat">
                <div className="stat-actions flex justify-center items-center">
                  <button
                    onClick={() => {
                      window.location.href = "/pricing";
                    }}
                    className="flex w-[90%] mx-5 items-center justify-center flex-wrap rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                  >
                    Get Pic Credits!
                  </button>
                </div>
              </div>
            </div>

            <div className="stats mx-5 shadow-xl sm:mx-5 flex flex-col mb-5 sm:flex-row bg-slate-100 text-primary-content">
              <div className="stat">
                <div className="stat-title mb-2">Order History</div>
                <div className="flex flex-row space-around justify-center">
                  {data && (
                    <h1 className="text-black font-bold mr-2 text-[20px]">
                      {data && data.orders.length} Orders placed!
                    </h1>
                  )}
                </div>
                <div className="stat-actions"></div>
              </div>

              <div className="stat">
                <div className="stat-actions flex justify-center items-center">
                  <button
                    onClick={() => {
                      window.location.href = "/photographers";
                    }}
                    className="flex w-[90%] mx-5 items-center justify-center flex-wrap rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                  >
                    Get more Pics!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default Profile;
