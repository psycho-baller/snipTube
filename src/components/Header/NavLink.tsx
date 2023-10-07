import Link from "next/link";
import { forwardRef, type ComponentPropsWithRef } from "react";
import { cn } from "~lib/utils";
export interface NavLinkProps extends ComponentPropsWithRef<"a"> {
  isActive: boolean;
  id?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  const { href, type, isActive, className, ...rest } = props;
  const activeClassName = isActive ? "dark:bg-white/10 bg-secondary/40" : "";

  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        "block px-3.5 sm:px-6 py-1 sm:py-1.5 font-medium rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
        activeClassName,
        className
      )}
      {...rest}
    />
  );
});

NavLink.displayName = "NavLink";
export default NavLink;
