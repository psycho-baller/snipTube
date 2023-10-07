import { forwardRef, type ComponentPropsWithRef } from "react";
import Link from "next/link";
import { cn } from "~lib/utils";
import { twMerge } from "tailwind-merge";
export interface NavLinkProps extends ComponentPropsWithRef<"a"> {
  isActive: boolean;
  isBelowHeader?: boolean;
  id?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  const { href, type, isActive, className, isBelowHeader, ...rest } = props;

  const activeClassName = isActive ? twMerge("dark:bg-white/10", isBelowHeader ? " bg-white/40" : " bg-black/10") : "";

  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        "block px-3.5 sm:px-6 py-1 sm:py-1.5 font-medium rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition ease-in-out",
        activeClassName,
        className
      )}
      {...rest}
    />
  );
});

NavLink.displayName = "NavLink";
export default NavLink;
