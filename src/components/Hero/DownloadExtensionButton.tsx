"use client";
import Link from "next/link";
import { siteConfig } from "~config/site";
import { cn, buttonVariants } from "~lib/utils";
import { useEffect, type ComponentPropsWithoutRef, useState, use } from "react";
import styles from "./styles.module.css";
import { type Browsers } from "~types/config";
import useBrowserName from "~hooks/useBrowserName";

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