"use client";
import Link from "next/link";
import { siteConfig } from "~config/site";
import { cn, buttonVariants } from "~lib/utils";
import { useEffect, type ComponentPropsWithoutRef, useState } from "react";
import styles from "./styles.module.css";
import { type Browsers } from "~types/config";

interface Props extends ComponentPropsWithoutRef<"div"> {}

function Component(props: Props) {
  const {} = props;

  const [browserName, setBrowserName] = useState<Browsers>("chrome");

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    switch (true) {
      case /Edg/i.test(userAgent) || /Edge/i.test(userAgent):
        setBrowserName("edge");
        break;
      case /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent):
        setBrowserName("safari");
        break;
      case /Firefox/i.test(userAgent):
        setBrowserName("firefox");
        break;
      // case /Chrome/i.test(userAgent):
      //   setBrowserName("chrome");
      //   break;
      // default:
      //   setBrowserName("chrome");
      //   break;
    }
  }, []);

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
