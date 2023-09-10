"use client";
import Link from "next/link";

const SidebarLink = () => {

  return (
    <>
      <li className="block">
        <Link
          href={`/docs`}
          className={`text-base py-2 px-3 rounded-sm flex w-full bg-stroke text-black dark:text-white dark:bg-blackho`}
        >
          Introduction
        </Link>
        <Link
          href={`/docs`}
          className={`text-base py-2 px-3 rounded-sm flex w-full text-black dark:text-white dark:bg-blackho`}
        >
          Bootstrap Template Guide
        </Link>
        <Link
          href={`/docs`}
          className={`text-base py-2 px-3 rounded-sm flex w-full text-black dark:text-white dark:bg-blackho`}
        >
          Style Guide
        </Link>
        <Link
          href={`/docs`}
          className={`text-base py-2 px-3 rounded-sm flex w-full text-black dark:text-white dark:bg-blackho`}
        >
          Using Tailwind Components
        </Link>
      </li>
    </>
  );
};

export default SidebarLink;
