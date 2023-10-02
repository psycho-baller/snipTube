"use client";
import { type FC, type ComponentPropsWithoutRef, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useScroll } from "framer-motion";

import ThemeToggler from "./ThemeToggler";
import Navigation from "./Navigation";
import { Logo } from "../Logo";
import { headerRoutes } from "~config/header";

interface Props extends ComponentPropsWithoutRef<"header"> {}

const Header: FC<Props> = (props) => {
  const { ...rest } = props;
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const pathUrl = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLHeadElement>(null);
  const [y, setY] = useState<number>(0);
  const { scrollY } = useScroll();
  useEffect(() => {
    return scrollY.on("change", (latest) => setY(latest));
  }, [scrollY]);

  const bg = y > ref.current?.getBoundingClientRect().height ? "bg-whiteAlpha-700" : "bg-opacity-70";

  // TODO: hide when scrolling down, show when scrolling up (using framer-motion)
  return (
    <header
      ref={ref}
      className={`fixed transition duration-300 top-0 w-full ${bg} backdrop-blur-md z-50 ${
        y > ref.current?.getBoundingClientRect().height ? "shadow-b shadow-lg dark:shadow-gray-800" : ""
      } ${y > ref.current?.getBoundingClientRect().height ? "" : ""}`}
      {...rest}
    >
      <div className="container mx-auto px-8 py-4">
        <Logo
          width={200}
          className="cursor-pointer"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            } else {
              router.push("/");
            }
          }}
        />
        <div
          className={`w-full lg:w-full h-0 lg:h-auto invisible lg:visible lg:flex items-center justify-between ${
            navigationOpen &&
            "!visible bg-white dark:bg-blacksection shadow-solid-5 h-auto max-h-[400px] overflow-y-scroll rounded-md mt-4 p-7.5"
          }`}
        >
          {/*        <Navigation />
           <ThemeToggler />
         </div>
       </div>
     </header> */}
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-label="hamburger Toggler"
            className="lg:hidden block"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="block relative cursor-pointer w-5.5 h-5.5">
              <span className="block absolute w-full h-full">
                <span
                  className={`block relative top-0 left-0 bg-black dark:bg-white rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                    !navigationOpen ? "!w-full delay-300" : ""
                  }`}
                ></span>
                <span
                  className={`block relative top-0 left-0 bg-black dark:bg-white rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                    !navigationOpen ? "!w-full delay-400" : ""
                  }`}
                ></span>
                <span
                  className={`block relative top-0 left-0 bg-black dark:bg-white rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                    !navigationOpen ? "!w-full delay-500" : ""
                  }`}
                ></span>
              </span>
              <span className="block absolute w-full h-full rotate-45">
                <span
                  className={`block bg-black dark:bg-white rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-0 ${
                    navigationOpen ? "h-full delay-[0]" : ""
                  }`}
                ></span>
                <span
                  className={`block bg-black dark:bg-white rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-[.03rem] w-full h-0 ${
                    navigationOpen ? "h-0.5 dealy-200" : ""
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          {/* Nav Menu Start   */}
          {/* </div>
        <div
          className={`w-full lg:w-full h-0 lg:h-auto invisible lg:visible lg:flex items-center justify-between ${
            navigationOpen &&
            "!visible bg-white dark:bg-blacksection shadow-solid-5 h-auto max-h-[400px] overflow-y-scroll rounded-md mt-4 p-7.5"
          }`}
        > */}
          <nav>
        <ul className="flex lg:items-center flex-col lg:flex-row gap-5 lg:gap-10">
          {headerRoutes.map((menuItem, key) => (
            <li
              key={key}
              className={menuItem.submenu && "group relative"}
            >
              {menuItem.submenu ? (
                <>
                  <a
                    onClick={() => setDropdownToggler(!dropdownToggler)}
                    className="hover:text-primary flex items-center justify-between gap-3 cursor-pointer"
                  >
                    {menuItem.title}
                    <span>
                      <svg
                        className="fill-waterloo group-hover:fill-primary w-3 h-3 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                    </span>
                  </a>

                  <ul className={`dropdown ${dropdownToggler ? "flex" : ""}`}>
                    {menuItem.submenu.map((item, key) => (
                      <li
                        key={key}
                        className="hover:text-primary"
                      >
                        <Link href={item.path || "#"}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={`${menuItem.path}`}
                  className={pathUrl === menuItem.path ? "hover:text-primary text-primary" : "hover:text-primary"}
                >
                  {menuItem.title}
                </Link>
              )}
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggler />
          {/* <div className="flex items-center gap-6 mt-7 lg:mt-0">

            <Link
              href="https://github.com/NextJSTemplates/solid-nextjs"
              className="text-waterloo text-regular font-medium hover:text-primary"
            >
              GitHub Repo 🌟
            </Link>

            <Link
              href="https://nextjstemplates.com/templates/solid"
              className="flex items-center justify-center bg-primary hover:bg-primaryho ease-in-out duration-300 text-white text-regular rounded-full py-2.5 px-7.5"
            >
              Get Pro 🔥
            </Link>
          </div> */}
        </div>
      </div>
    </header>
  );
};

// w-full delay-300

export default Header;
