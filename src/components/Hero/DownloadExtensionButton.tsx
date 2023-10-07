"use client";
import Link from "next/link";
import { siteConfig } from "~config/site";
import { cn, buttonVariants } from "~lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";
import useBrowserName from "~hooks/use-browser-name";

interface Props extends ComponentPropsWithoutRef<"div"> {}

function Component(props: Props) {
  const {} = props;

  const browserName = useBrowserName();

  return (
    <Link
      href={siteConfig.links[browserName]}
      className={cn(buttonVariants({ variant: "secondary" }), styles.cta)}
    >
      <span>Download extension</span>
    </Link>
  );
}

export default Component;
