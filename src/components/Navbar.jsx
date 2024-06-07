import React, { Fragment, useState, useRef } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useSignOut } from "./Signout";
import logo from "./Icon/Logo.png";
import { NavLink } from "react-router-dom";
import { useShoppingCart } from "use-shopping-cart";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const signOut = useSignOut();
  const [isOpen, setIsOpen] = useState(false);

  const { cartCount } = useShoppingCart();

  return (
    <div className="fixed left-0 right-0 mx-auto max-w-[1280px] z-[50]  bg-gradient-to-r from-slate-100 to-slate-200 shadow">
      <Disclosure as="nav" className="flex flex-row justify-around">
        {({ open }) => (
          <>
            <div className="shadow flex w-full h-[100px]">
              <img
                src={logo}
                className="w-[80px] h-[80px] ml-10  my-auto"
                alt=""
              />

              <div className="w-full flex flex-row items-center justify-center sm:hidden">
                {/* Mobile menu button */}

                <Menu as="div" className="relative z-10">
                  <div>
                    <Menu.Button className="relative ml-4 items-center justify-center rounded-md p-2 shadow-xl text-[#FF4500] bg-gradient-to-r from-slate-100 to-slate-200 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset">
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="fixed inset-x-0 flex flex-col mx-auto items-center w-[90%] z-10 mt-[50px] items-center gap-5 py-5 hover:bg-slate-200  rounded-md bg-slate-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/"
                            className={classNames(
                              active
                                ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                                : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            )}
                          >
                            Home
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/photographers"
                            className={classNames(
                              active
                                ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                                : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            )}
                          >
                            Photographers
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/categories"
                            className={classNames(
                              active
                                ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                                : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            )}
                          >
                            Categories
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/pricing"
                            className={classNames(
                              active
                                ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                                : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            )}
                          >
                            Pricing
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="flex flex-1 mr-[10px]  items-center justify-center">
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8 ">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                        : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/photographers"
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                        : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }
                  >
                    Photographers
                  </NavLink>

                  <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                        : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }
                  >
                    Categories
                  </NavLink>

                  <NavLink
                    to="/pricing"
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                        : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }
                  >
                    Pricing
                  </NavLink>
                </div>
              </div>

              <div className="relative mr-5 flex items-center justify-around">
                <div>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 border-[#FF4500] inline-flex items-center px-1 pt-1 text-m font-medium text-gray-900"
                        : "border-b-2 border-transparent inline-flex items-center px-1 pt-1 text-m font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }
                  >
                    <ShoppingCartIcon
                      className="h-8 w-8  text-gray-500"
                      aria-hidden="true"
                      href="/cart"
                    />
                    <span className="text-[#FF4500] text-ml bg-slate-200 rounded">
                      {cartCount}
                    </span>
                  </NavLink>
                </div>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-5 mt-[5px] mr-5">
                  <div>
                    <Menu.Button className="rounded-full bg-slate- text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <UserIcon className="h-8 w-8 rounded-full" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/profile"
                            className={classNames(
                              active ? "bg-gray-200" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => {
                              window.location.href = "/signin";
                            }}
                            style={{ cursor: "pointer" }}
                            className={classNames(
                              active ? "bg-gray-200" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign in / Sign up
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={signOut}
                            style={{ cursor: "pointer" }}
                            className={classNames(
                              active ? "bg-gray-200" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Logout
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
