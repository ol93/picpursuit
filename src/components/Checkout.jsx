import React, { useContext } from "react";
import { useShoppingCart } from "use-shopping-cart";
import { useSnackbar } from "notistack";
import { PhotosContext } from "./PhotosContext";

export default function Checkout() {
  const { redirectToCheckout, cartDetails, cartCount, clearCart } =
    useShoppingCart();
  const { enqueueSnackbar } = useSnackbar();

  const product = useContext(PhotosContext);

  async function handleCheckout(event) {
    try {
      event.preventDefault();
      if (cartCount === 0) {
        enqueueSnackbar("Cart is empty", {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        });
        return;
      }

      // Request a session ID from your server
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: cartDetails }),
        }
      );

      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message);
        });
      }

      const { sessionId } = await response.json();

      // Redirect to the checkout
      redirectToCheckout(sessionId);

      // Clear the cart
      clearCart();

      // Download the products
    } catch (error) {
      enqueueSnackbar("An error occurred please try again.", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
    }
  }

  return (
    <button
      className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
      onClick={handleCheckout}
    >
      Checkout
    </button>
  );

  // ...
}
