import React from "react";
import { useShoppingCart } from "use-shopping-cart";
import { useSnackbar } from "notistack";

export default function HandleSubCheckout({ priceId }) {
  const { redirectToCheckout, clearCart } = useShoppingCart();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubCheckout = async (event) => {
    try {
      event.preventDefault();

      // Get the priceId of the selected plan

      // Request a subscription from your server
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND}/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ priceId }),
        }
      );

      if (!response.ok) {
        return response.json().then((data) => {
          enqueueSnackbar(`Please sign in before ordering`, {
            variant: "default",
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
          });

          throw new Error(data.message);
        });
      }

      const responseJson = await response.json();

      const { sessionId } = responseJson;
      redirectToCheckout(sessionId);

      // Clear the cart
      clearCart();

      // Handle the response from the server
      // ...
    } catch (error) {
      enqueueSnackbar(
        "Failed to start checkout",
        { variant: "default" },
        { anchorOrigin: { vertical: "bottom", horizontal: "left" } }
      );
    }
  };

  return (
    <button
      className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
      onClick={handleSubCheckout}
    >
      Buy Plan
    </button>
  );
}
