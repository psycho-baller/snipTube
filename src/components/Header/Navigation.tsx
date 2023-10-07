import React, { useRef, type ComponentPropsWithoutRef } from "react";
import { usePathname } from "next/navigation";
// import siteConfig from "data/config";
import { useScrollSpy } from "~hooks/use-scrollspy";
// import ThemeToggle from "./theme-toggle";
// import MobileNavButton from "components/mobile-nav/MobileNavButton";
// import MobileNavContent from "components/mobile-nav/MobileNavContent";
import NavLink from "./NavLink";
import { headerRoutes } from "~config/header";
import { cn } from "~lib/utils";

interface Props extends ComponentPropsWithoutRef<"nav"> {
  bg: string;
}

const Navigation = (props: Props) => {
  const { bg } = props;
  const pathname = usePathname();
  // const activeId = useScrollSpy(
  //   headerRoutes.filter(({ path }) => path).map(({ path }) => `#${path}`),
  //   {
  //     threshold: 0.75,
  //   }
  // );

  const mobileNavBtnRef = useRef(null);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className={cn("flex transition sm:gap-x-2 lg:gap-x-8 backdrop-blur-xl rounded-full p-2.5", bg)}>
        {headerRoutes.map(({ path, id, ...props }, i) => (
          <NavLink
            key={i}
            href={path || "/"}
            isActive={pathname === path}
            {...props}
          >
            {props.title}
          </NavLink>
        ))}
      </nav>

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
