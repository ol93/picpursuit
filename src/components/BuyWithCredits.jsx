import React, { useContext, useEffect, useState } from "react";
import { useShoppingCart } from "use-shopping-cart";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { v4 as uuidv4 } from "uuid";
import { dataContext } from "../App.jsx";
const BuyWithCredits = () => {
  const { cartCount, clearCart, cartDetails } = useShoppingCart();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  const data = useContext(dataContext);
  function canBuyWithCredits(cartDetails) {
    for (let item of Object.values(cartDetails)) {
      for (let category of item.categories) {
        if (category.CategoryName === "Premium") {
          return false;
        }
      }
    }
    return true;
  }

  const handleBuyWithCredits = (event) => {
    event.preventDefault();
    const sessionId = uuidv4();

    if (cartCount === 0) {
      enqueueSnackbar("Cart is empty", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      return;
    }

    if (!canBuyWithCredits(cartDetails)) {
      enqueueSnackbar(
        `One or more items in your cart are premium items, you can't buy premium items with credits`,
        {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }
      );
      return;
    }

    if (data && data.user.credits < cartCount) {
      enqueueSnackbar("Not enough credits to checkout", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      return;
    }

    if (data && data.user.credits >= cartCount) {
      confirm({
        description: `Are you sure you want to checkout with ${cartCount} ${
          cartCount > 1 ? "items" : "item"
        }?`,
      }).then(() => {
        fetch(`${import.meta.env.VITE_APP_BACKEND}/checkout-with-credits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ cartDetails, sessionId }),
        })
          .then((response) => {
            if (response.ok) {
              clearCart();
              enqueueSnackbar(
                "Checkout succesful! You will be redirected to get your photos!",
                {
                  variant: "default",
                  anchorOrigin: { vertical: "bottom", horizontal: "left" },
                }
              );
              setTimeout(() => {
                window.location.href = `${
                  import.meta.env.VITE_APP_URL
                }/success?session_id=${sessionId}`;
              }, 3000);
              return;
            } else {
              enqueueSnackbar("Checkout failed", {
                variant: "default",
                anchorOrigin: { vertical: "bottom", horizontal: "left" },
              });
              return;
            }
          })
          .catch((error) => {});
      });
    }
  };

  return (
    <button
      className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
      onClick={handleBuyWithCredits}
    >
      Buy with Pic Credits ( {data && data.user.credits} )
    </button>
  );
};

export default BuyWithCredits;
