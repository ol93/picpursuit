import React, { useState, useEffect, createContext } from "react";

import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import { CartProvider } from "use-shopping-cart";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import { ConfirmProvider } from "material-ui-confirm";
import Profile from "./pages/Profile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomePage from "./pages/HomePage";
import Photographers from "./pages/Photographers";
import Categories from "./pages/Categories";
import PhotosByCategory from "./pages/PhotosByCategory";
import AlbumsByPhotographer from "./pages/AlbumsByPhotographer";
import { createClient } from "@sanity/client";
import PhotosByAlbum from "./pages/PhotosByAlbum";
import Pricing from "./pages/Pricing";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SuccessPage from "./pages/SuccessPage";
import Tou from "./pages/tou";
import Privacy from "./pages/privacy";
import VerifyPage from "./pages/verifyEmail";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

export const OnboardingCompleteContext = createContext();
export const bioContext = createContext();
export const dataContext = createContext();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function NavbarWithLocation() {
  const location = useLocation();
  return <Navbar location={location} />;
}

function App() {
  const [data, setData] = useState(null);
  const [bio, setBio] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const stripeConnectId = bio.stripeConnectId;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const timer = setTimeout(() => {
        fetch(`${import.meta.env.VITE_APP_BACKEND}/account`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      });

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  const name = data?.user.name;
  const email = data?.user.email;

  const client = createClient({
    projectId: "kdt18ats",
    dataset: "production",
    useCdn: true,
    apiVersion: "2024-04-22",
  });

  useEffect(() => {
    if (!name || isDataFetched) {
      return;
    }
    const timeoutId = setTimeout(() => {
      client
        .fetch(
          `*[_type == "Photographer" && name == $name && email == $email]{bioImage{asset}, name, bio, IG, email, slug, stripeConnectId, interestedCategories[] -> {CategoryName},
        "albums": *[_type == "Album" && photographer._ref == ^._id]{
        name, image{asset}, "photoCount": count(photos), _id }}`,
          { name, email }
        )
        .then((data) => {
          if (data && data.length > 0) {
            setBio(data[0]);
            setIsDataFetched(true);
          }
        })
        .catch(console.error);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [name, isDataFetched]);

  // Check if onboarding is complete

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const checkOnboardingStatus = async () => {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND}/onboarding-status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ stripeConnectId: stripeConnectId }),
          }
        );

        if (response.ok) {
          const { completedOnboarding } = await response.json();
          setIsOnboardingComplete(completedOnboarding);
        }
      };

      const timeoutId = setTimeout(checkOnboardingStatus, 300);

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [bio.stripeConnectId]);
  // rest of your code...

  // In your render method
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="loading loading-spinner loading-md" />
      </div>
    ); // Or some loading spinner
  }

  // Rest of your component

  const stripeApiKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const googleClientId = import.meta.env.VITE_APP_GOOGLEO_CLIENT_ID;

  return (
    <div>
      <OnboardingCompleteContext.Provider value={isOnboardingComplete}>
        <bioContext.Provider value={bio}>
          <dataContext.Provider value={data}>
            <GoogleOAuthProvider clientId={googleClientId}>
              <ConfirmProvider>
                <SnackbarProvider maxSnack={1}>
                  <CartProvider stripe={stripeApiKey}>
                    <Router>
                      <NavbarWithLocation />

                      <Routes>
                        <Route path="/" element={<HomePage />}>
                          {" "}
                        </Route>
                        <Route
                          path="/photographers"
                          element={<Photographers />}
                        >
                          {" "}
                        </Route>
                        <Route
                          path="/photographers/:photographerName"
                          element={<AlbumsByPhotographer />}
                        >
                          {" "}
                        </Route>
                        <Route
                          path="/photographers/:photographerName/:albumName"
                          element={<PhotosByAlbum />}
                        >
                          {" "}
                        </Route>
                        <Route path="/categories" element={<Categories />}>
                          {" "}
                        </Route>
                        <Route
                          path="/categories/:categoryName"
                          element={<PhotosByCategory />}
                        >
                          {" "}
                        </Route>
                        <Route path="/success" element={<SuccessPage />}>
                          {" "}
                        </Route>
                        <Route path="/pricing" element={<Pricing />}>
                          {" "}
                        </Route>
                        <Route path="/cart" element={<Cart />}>
                          {" "}
                        </Route>
                        <Route path="/signup" element={<SignUpPage />}>
                          {" "}
                        </Route>
                        <Route path="/signin" element={<SignInPage />}>
                          {" "}
                        </Route>
                        <Route path="/verify" element={<VerifyPage />}>
                          {" "}
                        </Route>
                        <Route
                          path="/forgotpassword"
                          element={<ForgotPassword />}
                        >
                          {" "}
                        </Route>
                        <Route
                          path="/resetpassword"
                          element={<ResetPassword />}
                        >
                          {" "}
                        </Route>
                        <Route
                          path="/profile"
                          element={
                            localStorage.getItem("token") ? (
                              <Profile />
                            ) : (
                              <SignInPage message="You need to sign in first." />
                            )
                          }
                        ></Route>{" "}
                        <Route path="/tou" element={<Tou />}>
                          {" "}
                        </Route>
                        <Route path="/privacy" element={<Privacy />}>
                          {" "}
                        </Route>
                      </Routes>
                      <Footer />
                    </Router>{" "}
                  </CartProvider>
                </SnackbarProvider>
              </ConfirmProvider>{" "}
            </GoogleOAuthProvider>{" "}
          </dataContext.Provider>{" "}
        </bioContext.Provider>{" "}
      </OnboardingCompleteContext.Provider>
    </div>
  );
}

export default App;
