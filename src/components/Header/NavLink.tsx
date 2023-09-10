
import Link from "next/link";
import { forwardRef, type ComponentPropsWithRef } from "react";
import { cn } from "~lib/utils";
export interface NavLinkProps extends ComponentPropsWithRef<"a"> {
  isActive?: boolean;
  id?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  const { href, type, isActive, className, ...rest } = props;
  const activeClassName = isActive ? "text-blue-500 dark:text-blue-400" : "";

  return (
    <Link
      href={href}
      ref={ref}
      className={cn(
        "block px-4 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
        activeClassName,
        className
      )}
      {...rest}
    />
  );
});

NavLink.displayName = "NavLink";
export default NavLink;