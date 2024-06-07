import React from "react";
import { useShoppingCart } from "use-shopping-cart";
import { useSnackbar } from "notistack";

export default function AddToCart({
  product,
  buttonText = "Add to Cart",
  className,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { addItem, cartDetails } = useShoppingCart();

  if (!product) {
    return null; // or render some error message
  }
  const productId = product._id;

  if (!product) {
    return null; // or render some error message
  }
  const isInCart =
    cartDetails &&
    Object.values(cartDetails).some((item) => item.sku === product._id);
  const moreThanTen = cartDetails
    ? Object.keys(cartDetails).length >= 10
    : false;

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (moreThanTen) {
      enqueueSnackbar(
        "You can only add up to 10 items to the cart, time to checkout and come back for more!",
        {
          variant: "default",
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }
      );
      return;
    }

    if (!isInCart) {
      addItem({
        sku: product._id, // use _id as sku_id
        price: product.price,
        name: product.name,
        image: product.image,
        categories: product.categories,
        photographer: product.photographer,
        currency: "EUR",
        stripeConnectId: product.stripeConnectId,
      });
      enqueueSnackbar(`${product.name.substring(14)} added to cart`, {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
    } else {
      enqueueSnackbar(`${product.name.substring(14)} is already in the cart`, {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
    }
  };

  return (
    <button
      className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
      onClick={handleClick}
    >
      {" "}
      {buttonText}{" "}
    </button>
  );
}
