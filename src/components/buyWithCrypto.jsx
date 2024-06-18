import React, { useContext, useEffect, useState } from "react";
import { useShoppingCart } from "use-shopping-cart";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const BuyWithCrypto = () => {
  const { cartCount, clearCart, cartDetails } = useShoppingCart();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  let sessionID = uuidv4();

  

  

  const handleBuyWithCrypto = (event) => {
    event.preventDefault();

    if (cartCount === 0) {
      enqueueSnackbar("Cart is empty", {
        variant: "default",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      });
      return;
    }



   
          
          
          
        axios({
            method: 'post',
            url: 'https://api.commerce.coinbase.com/charges',
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json', 
              'X-CC-Api-Key': import.meta.env.VITE_APP_COINBASE_API_KEY,
            },
            data : {
                "name": "Pic Pursuit",
              "local_price": {
                "amount": "100",
                "currency": "usd"
              },
              "checkout_id": sessionID,
              "cancel_url": "https://www.pic-pursuit.com/cart",
              "metadata": {
                "custom_field": "Cartdetails",
                "custom_field_two": ""
              },
              "pricing_type": "fixed_price",
              "redirect_url": `${import.meta.env.VITE_APP_URL}/success?session_id=${sessionID}`
            }
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });}
         

  return (
    <button
      className="flex w-full justify-center rounded-md bg-slate-300 hover:bg-slate-400 hover:text-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
      onClick={handleBuyWithCrypto}
    >
      Buy with Crypto
    </button>
  );
};

export default BuyWithCrypto;
