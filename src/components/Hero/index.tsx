import Link from "next/link";
import { siteConfig } from "~config/site";
import { cn, buttonVariants } from "~lib/utils";
import styles from "./styles.module.css";

const Hero = () => {

  return (
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 mt-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          {/* <Link
            href={siteConfig.links.github}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Twitter
          </Link> */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Unlock the knowledge in YouTube videos with AI
          </h1>
          <p className="max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            {siteConfig.description}
          </p>
          <div className="space-x-4">
            <Link href="/login"
            className={cn(buttonVariants({ variant: "secondary" }), styles.cta)}
            >
              <span>Check it out</span>
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
  );
};

export default Hero;
