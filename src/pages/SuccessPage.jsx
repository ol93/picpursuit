import React, { useEffect, useState } from "react";
import logo from "../../src/components/Icon/Logo.png";
import { useLocation } from "react-router-dom";
import { saveAs } from "file-saver";
import Lottie from "lottie-react";
import countdown from "../components/LottieAnimations/countdown5.json";
import JSZip from "jszip";

const SuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      const sessionId = new URLSearchParams(location.search).get("session_id");

      fetch(`${import.meta.env.VITE_APP_BACKEND}/products/${sessionId}`)
        .then((response) => response.json())
        .then((order) => {
          setTimeout(() => {
            const zip = new JSZip();
            let count = 0;

            order.items.forEach((item) => {
              fetch(item.url)
                .then((response) => response.blob())
                .then((blob) => {
                  zip.file(item.name, blob);
                  count++;

                  if (count === order.items.length) {
                    zip.generateAsync({ type: "blob" }).then((blob) => {
                      saveAs(blob, "PicPursuit.zip");
                    });
                  }
                });
            });
          }, 5000);
        });
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-[110px]">
        <div className="relative pb-20 bg-gradient-to-r from-slate-100 to-slate-200 flex flex-col items-center justify-center">
          <div
            className="absolute hidden sm:block w-[70] h-[30%] inset-y-10 inset-x-[20%]     overflow-hidden blur-3xl "
            aria-hidden="true"
          >
            <div
              className="relative aspect-[1155/678] w-[100%] h-[100%] inset-x-0 bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-20 sm:opacity-20"
              style={{
                clipPath:
                  "polygon(0% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 0% 1%)",
              }}
            />
          </div>

          <img className="w-[20%] pt-20 pb-20" src={logo} alt="" />

          <div className="flex flex-col items-center">
            <div>
              {" "}
              <h1 className="text-xl pb-20 font-bold text-black">
                Getting your downloads ready... Please wait
              </h1>
            </div>

            <div className="loading loading-spinner loading-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[110px]">
      <div className="relative pb-20 bg-gradient-to-r from-slate-100 to-slate-200 flex flex-col items-center justify-center">
        <div
          className="absolute sm:block hidden  w-[70] h-[30%] inset-y-10 inset-x-[20%]     overflow-hidden blur-3xl "
          aria-hidden="true"
        >
          <div
            className="relative aspect-[1155/678] w-[100%] h-[100%] inset-x-0 bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-20 sm:opacity-20"
            style={{
              clipPath:
                "polygon(0% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 0% 1%)",
            }}
          />
        </div>

        <img className="w-[20%] pt-20 pb-20" src={logo} alt="" />

        {!animationCompleted && (
          <div className="flex flex-col items-center">
            <h1 className="text-xl pb-20 font-bold text-black">
              Your downloads will start in
            </h1>

            <Lottie
              onComplete={handleAnimationComplete}
              animationData={countdown}
              delay
              loop={false}
              style={{ width: "80px", height: "80px" }}
            />
          </div>
        )}
        {animationCompleted && (
          <div className="flex flex-col items-center">
            {" "}
            <h1 className="text-xl pb-20 font-bold text-black">
              Your downloads have started!
            </h1>
            <p className="text-xl w-[80%]">
              Thank you for your purchase and we hope to see you back again
              soon!
            </p>
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default SuccessPage;
