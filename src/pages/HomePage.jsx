import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { UserIcon } from "@heroicons/react/24/outline";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";

import Lottie from "lottie-react";

import animationData from "../components/LottieAnimations/PicPursuit.json";

import HandleSubCheckout from "../components/CheckoutSubs";
import BoKaap from "../assets/SliderImages/BoKaap.jpeg";
import Cheetah from "../assets/SliderImages/Cheetah.jpeg";
import Elephant from "../assets/SliderImages/Elephant.jpeg";
import Eagle from "../assets/SliderImages/Eagle.jpeg";
import Landscape from "../assets/SliderImages/Landscape.jpeg";
import Nature from "../assets/SliderImages/Nature.jpeg";
import animationDataSlider from "../components/LottieAnimations/ArrowSlider.json";

const features = [
  {
    name: "Create an Account",
    description:
      "Create a Pic Pursuit account or simply sign in with your Google account.",
    icon: UserIcon,
  },
  {
    name: "Customize your Page",
    description: "Edit your profile and let your customers know who you are!",
    icon: PostAddOutlinedIcon,
  },
  {
    name: "Upload your Photos",
    description:
      "Your original photos will be stored securely in a database. On the platform a low resolution and watermarked image will be displayed (600px).",
    icon: FileUploadOutlinedIcon,
  },
  {
    name: "Get Paid Directly",
    description:
      "Through Stripe, a secure payment platform, you can decide if you want to get paid daily, weekly or monthly (SEPA countries). Check out the FAQ below for more information.",
    icon: PointOfSaleOutlinedIcon,
  },
];

const FAQref = React.createRef();

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="pt-[110px]">
      <div className="relative bg-gradient-to-r from-slate-100 to-slate-200 shadow  ">
        {/* Hero section */}
        <div className="relative">
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center flex flex-col items-center -mt-20">
                <Lottie
                  animationData={animationData}
                  loop={false}
                  className="w-1/2 -mt-10 -mb-10 "
                />
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Welcome to Pic Pursuit
                </h1>

                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Create your account, upload your photos and sell them at your
                  own price! Instead of selling your photos to a stock photo
                  website where your photos become lost in the mix, here you
                  create your own page that you can share with your customers!
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="/signin"
                    className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-[#FF4500] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                  >
                    Get started
                  </a>
                  <a
                    onClick={() => {
                      FAQref.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="text-sm  font-semibold text-[#FF4500] hover:cursor-pointer leading-6 hover:text-black"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className="mt-16 flow-root sm:mt-24"></div>
            </div>
          </div>
        </div>

        {/* Image Slider  */}

        <div className="carousel carousel-center w-[80%] p-4 space-x-4 bg-slate-200 rounded-box -mt-20">
          <div className="w-full carousel-item sm:w-1/2">
            <img src={Nature} className="rounded-box" />
          </div>
          <div className="w-full carousel-item sm:w-1/2">
            <img src={Cheetah} className="rounded-box" />
          </div>
          <div className="w-full carousel-item sm:w-1/2">
            <img src={Elephant} className="rounded-box" />
          </div>
          <div className="w-full carousel-item sm:w-1/2">
            <img src={Landscape} className="rounded-box" />
          </div>
          <div className="w-full carousel-item sm:w-1/2">
            <img src={Eagle} className="rounded-box" />
          </div>
          <div className="w-full carousel-item sm:w-1/2">
            <img src={BoKaap} className="rounded-box" />
          </div>
        </div>

        <div className="flex flex-col w-full items-center justify-center">
          <Lottie
            animationData={animationDataSlider}
            className="w-[60px] sm:w-[80px] "
          ></Lottie>
        </div>

        {/* Feature section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 mb-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <div
              className="absolute   -z-10 transform-gpu overflow-hidden blur-3xl"
              aria-hidden="true"
            >
              <div
                className="relative aspect-[1155/678]    bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-20 "
                style={{
                  clipPath: "polygon(0% 0%, 60% 20%, 100% 50%, 0% 70%)",
                }}
              />
            </div>
            <div className="relative w-full">
              <div
                className="absolute  w-[90%]   -z-10 transform-gpu overflow-hidden blur-3xl "
                aria-hidden="true"
              >
                <div
                  className="relative aspect-[1155/678] w-[100%] right-0  bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-10 sm:opacity-10 sm:w-[100%]"
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                />
              </div>

              <h2 className="text-base font-semibold leading-7 text-[#FF4500]">
                How it works
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to know
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF4500]">
                        <feature.icon
                          className="h-6 w-6  text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div ref={FAQref}></div>
          </div>
        </div>

        <h2 className="text-base font-semibold  text-[#FF4500]">FAQ</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight  text-gray-900 sm:text-4xl">
          Your questions answered
        </p>

        <div className="  w-full flex flex-col justify-center items-center bg-gradient-to-r text-grey-900 from-slate-100 to-slate-200  pb-20  gap-1">
          <div className="collapse bg-gradient-to-r from-slate-100 to-slate-200 w-[100%] sm:w-[60%]   items-center justify-center mx-auto  shadow">
            <input type="radio" name="my-accordion-1" defaultChecked />
            <div className="collapse-title w-full flex justify-center items-center ml-3 text-xl font-medium">
              What do customers buy?{" "}
            </div>
            <div className="collapse-content">
              <p>
                Customers buy full resolution photos. They can then use them
                personally (think prints, posters, photobooks, etc) or
                commercially (think websites, marketing campaigns, etc) unless
                stated otherwise by the photographer in question.{" "}
              </p>
            </div>
          </div>

          <div className="collapse bg-gradient-to-r from-slate-100 to-slate-200 w-[100%] sm:w-[60%]  items-center justify-center mx-auto  shadow">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title w-full flex justify-center items-center ml-3 text-xl font-medium">
              Do customers need to sign up to be able to download my photos?{" "}
            </div>
            <div className="collapse-content">
              <p>
                No, they can simply add photos to their cart and checkout. After
                checkout is complete their downloads will start.{" "}
              </p>
            </div>
          </div>

          <div className="collapse bg-gradient-to-r from-slate-100 to-slate-200 w-[90%] sm:w-[60%]  shadow">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title w-full flex justify-center items-center ml-3 text-xl font-medium">
              Why would I use Pic Pursuit as a photographer{" "}
            </div>
            <div className="collapse-content">
              <p>
                We believe that Pic Pursuit is a user friendly platform where
                photographers can sell their photos within a few clicks.
                Photographers can set their own price for their photos and keep
                track of their earnings 24/7. Futhermore we offer very
                competitive profit margins. You keep 80% - a .40€ transaction
                fee. For example: €5 purchase / .80 -.40 = €3.60 profit for you!
                That is 72% on this particular example. The minimum price we
                allow you to sell photos at is €1.{" "}
              </p>
            </div>
          </div>

          <div className="collapse bg-gradient-to-r from-slate-100 to-slate-200 w-[90%] sm:w-[60%]   shadow">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title w-full flex justify-center items-center ml-3 text-xl font-medium">
              Why wouldn't I just upload my photos on a big Stock photo website
              like Shutterstock or Adobe Stock?
            </div>
            <div className="collapse-content">
              <p>
                You can certainly do that, and one doesn't exclude the other,
                but keep in mind there are millions of photos on these website
                making it hard for yours to stand out. With Pic Pursuit, you can
                seamlessly share your newly uploaded albums on social media. On
                top of that, you get to keep way more of your revenue, on stock
                photo websites you usually only keep 15-20%.
              </p>
            </div>
          </div>

          <div className="collapse bg-gradient-to-r from-slate-100 to-slate-200 w-[90%] sm:w-[60%]  shadow">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title w-full flex justify-center items-center ml-3 text-xl font-medium">
              How often will I get paid?{" "}
            </div>
            <div className="collapse-content">
              <p>
                You can decide that for yourself once you've setup your account.
                Options are daily, weekly and monthly for European (SEPA) based
                photographers. We are looking into options for photographers
                outside Europe. For now they will get paid monthly.{" "}
              </p>
            </div>
          </div>

          <div className="collapse bg-gradient-to-r from-slate-100 to-slate-200 w-[90%] sm:w-[60%]   shadow">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title w-full flex justify-center items-center ml-3 text-xl font-medium">
              Where can I use photos that I purchase from Pic Pursuit?
            </div>
            <div className="collapse-content">
              <p>
                All photos purchased from Pic Pursuit can be used personally or
                commercially, unless stated otherwise by the photographer in
                question. You can contact them on their respected page.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
