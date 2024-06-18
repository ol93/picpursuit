import React, { useContext } from "react";
import { useShoppingCart } from "use-shopping-cart";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import UrlFor from "../../sanity/imageBuilder";
import { useSnackbar } from "notistack";
import Checkout from "../components/Checkout";
import { useConfirm } from "material-ui-confirm";
import BuyWithCredits from "../components/BuyWithCredits";
import { PhotosContext } from "../components/PhotosContext";
import BuyWithCrypto from "../components/buyWithCrypto";

export default function Cart() {
  const product = useContext(PhotosContext);
  const { enqueueSnackbar } = useSnackbar();
  const {
    cartDetails,
    incrementItem,
    decrementItem,
    cartCount,
    removeItem,
    totalPrice,
    clearCart,
  } = useShoppingCart();
  const handleRemoveItem = (product) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeItem(product.id);
    enqueueSnackbar(
      `${product.name.substring(14).slice(0, 30)} removed from cart`,
      {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      }
    );
  };

  return (
    <div className="pt-[110px]">
      <div className="bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              <div
                className="absolute  w-[30%] h-[30%] inset-y-10 inset-x-[20%]     overflow-hidden blur-3xl "
                aria-hidden="true"
              >
                <div
                  className="relative aspect-[1155/678] w-[100%] h-[100%] inset-x-0 bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-10 sm:opacity-10"
                  style={{
                    clipPath:
                      "polygon(0% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 0% 1%)",
                  }}
                />
              </div>

              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {Object.values(cartDetails).map((product) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={UrlFor(product.image)}
                        alt={product.imageAlt}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a className="font-medium text-gray-700 hover:text-gray-800">
                                {product.name.substring(14).slice(0, 15)}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.price}€
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-black hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                onClick={handleRemoveItem(product)}
                                className="h-5 w-5"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        {product.inStock ? (
                          <CheckIcon
                            className="h-5 w-5 flex-shrink-0 text-green-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <ClockIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-300"
                            aria-hidden="true"
                          />
                        )}

                        <span>
                          You will get your downloads right after checkout is
                          done!
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded shadow bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  €{totalPrice}
                </dd>
              </div>

              <div className="mt-6">
                <Checkout />
              </div>

              <div className="mt-6">
                <BuyWithCredits />
              </div>
              <div className="mt-6">
                <BuyWithCrypto/>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
