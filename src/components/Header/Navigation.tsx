import React, { useRef } from "react";
import { usePathname } from "next/navigation";
// import siteConfig from "data/config";
import { useScrollSpy } from "~hooks/use-scrollspy";
// import ThemeToggle from "./theme-toggle";
// import MobileNavButton from "components/mobile-nav/MobileNavButton";
// import MobileNavContent from "components/mobile-nav/MobileNavContent";
import NavLink from "./NavLink";
import { headerRoutes } from "~config/header";

const Navigation = () => {
  const pathname = usePathname();
  // const activeId = useScrollSpy(
  //   headerRoutes.filter(({ path }) => path).map(({ path }) => `#${path}`),
  //   {
  //     threshold: 0.75,
  //   }
  // );

  const mobileNavBtnRef = useRef(null);

  return (
    <div className="flex space-x-2">
      {headerRoutes.map(({ path, id, ...props }, i) => (
        <NavLink
          key={i}
          href={path || "/"}
          // isActive={(path && pathname.startsWith(path)) || pathname === path}
          {...props}
        >
          {props.title}
        </NavLink>
      ))}

      {/* <ThemeToggle /> */}

      {/* <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={MobileNavButton.onClick}
      />

      <MobileNavContent
        isOpen={MobileNavContent.isOpen}
        onClose={MobileNavContent.onClose}
      /> */}
    </div>
  );
};

export default Navigation;
