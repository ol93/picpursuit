import React from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import HandleSubCheckout from "../components/CheckoutSubs";

const Pricing = () => {
  const tiers = [
    {
      name: "Pixel Plan",
      price_Id: "price_1PIob6AlUDUZLsip0N6AWN5o",

      priceMonthly: "€5",
      description: "Includes 1 download per month",
      features: ["1 Download per month"],
      mostPopular: false,
    },

    {
      name: "Image Plan",
      price_Id: "price_1PIobFAlUDUZLsipEcrEamCg",

      priceMonthly: "€10",
      description: "Includes 3 downloads per month",
      features: ["3 Downloads per month"],
      mostPopular: true,
    },

    {
      name: "Gallery Plan",
      price_Id: "price_1PIobSAlUDUZLsipmMXaM527",

      priceMonthly: "€15",
      description: "Includes 10 downloads per month",
      features: ["10 Downloads per month"],
      mostPopular: false,
    },
  ];
  return (
    <div className="pt-[110px] z-10">
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 shadow relative  ">
        <div
          className="absolute  w-[90%] h-[50%]      overflow-hidden blur-3xl "
          aria-hidden="true"
        >
          <div
            className="relative aspect-[1155/678] w-[100%] inset-x-0 bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-10 sm:opacity-10 sm:w-[100%]"
            style={{
              clipPath:
                "polygon(0% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 0% 1%)",
            }}
          />
        </div>

        {/* Pricing section */}
        <div className="py-24 flex  flex-col items-center  relative">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 mb-20 sm:text-4xl">
            Pricing
          </p>

          <p className="mb-10 text-xl w-[60%]">
            {" "}
            If you just want to buy a couple of photos you can just add them to
            the cart and checkout normally. If you feel like you are interested
            in purchasing photos regularly you can pick your plan here!
          </p>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base font-semibold leading-7 text-[#FF4500]">
                For regular users
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Choose a plan that works for you
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600"></p>
            <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-x-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {tiers.map((tier, tierIdx) => (
                <div
                  key={tier.id}
                  className={classNames(
                    tier.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                    tierIdx === 0 ? "lg:rounded-r-none" : "",
                    tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
                    "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
                  )}
                >
                  <div>
                    <div className="flex relative items-center justify-between gap-x-4">
                      <div
                        className="absolute  w-[90%]   -z-10 transform-gpu overflow-hidden blur-3xl "
                        aria-hidden="true"
                      >
                        <div
                          className="relative aspect-[1155/678] w-[100%] right-0  bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-50 sm:opacity-30 sm:w-[100%]"
                          style={{
                            clipPath:
                              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                          }}
                        />
                      </div>
                      <h3
                        id={tier.id}
                        className={classNames(
                          tier.mostPopular ? "text-[#FF4500]" : "text-gray-900",
                          "text-lg font-semibold leading-8"
                        )}
                      >
                        {tier.name}
                      </h3>
                      {tier.mostPopular ? (
                        <p className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold leading-5 text-[#FF4500]">
                          Most popular
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {tier.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        {tier.priceMonthly}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-600">
                        /month
                      </span>
                    </p>
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <HandleSubCheckout priceId={tier.price_Id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default Pricing;
