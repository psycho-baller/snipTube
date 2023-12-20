import { usePathname } from "next/navigation";
import { useStore } from "~stores/website";
import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import NavLink from "./NavLink";
import { headerRoutes } from "~config/header";
import { cn } from "~lib/utils";

interface Props extends ComponentPropsWithoutRef<"nav"> {}

const Navigation = (props: Props) => {
  const {} = props;
  const pathname = usePathname();

  const heroTextRef = useStore((state) => state.heroTextRef);
  const [isBelowHeader, setIsBelowHeader] = useState(false);
  useEffect(() => {
    const phoneOrTablet = window.innerWidth < 1024;
    const handleOffset = phoneOrTablet ? -50 : 50;
    const handleScroll = () => {
      setIsBelowHeader(heroTextRef.current?.getBoundingClientRect().top + handleOffset < 0);
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [heroTextRef]);
  // const [y, setY] = useState<number>(0);

  // const { scrollY } = useScroll();
  // useEffect(() => {
  //   return scrollY.on("change", (latest) => setY(latest));
  // }, [scrollY]);
  // const activeId = useScrollSpy(
  //   headerRoutes.filter(({ path }) => path).map(({ path }) => `#${path}`),
  //   {
  //     threshold: 0.75,
  //   }
  // );
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav
        className={cn(
          "flex sm:gap-x-2 lg:gap-x-8 backdrop-blur-3xl rounded-full p-2.5 transition ease-in-out",
          isBelowHeader ? "backdrop-brightness-90 dark:backdrop-brightness-75" : ""
        )}
        {...props}
      >
        {headerRoutes.map(({ path, id, ...props }, i) => (
          <NavLink
            key={i}
            href={path ?? "/"}
            isActive={pathname === path}
            isBelowHeader={isBelowHeader}
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
