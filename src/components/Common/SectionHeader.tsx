"use client";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { motion } from "framer-motion";
import { title } from "process";
import { cn } from "~lib/utils";

type HeaderInfo = {
  title?: string;
  subtitle: string;
  description: string;
};
interface Props extends ComponentPropsWithoutRef<"div"> {
  headerInfo: HeaderInfo;
}

const SectionHeader: FC<Props> = (props) => {
  const { className, headerInfo } = props;
  const { title, subtitle, description } = headerInfo;

  return (
    <>
      {/* <!-- Section Title Start --> */}
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -20,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true }}
        className={cn("animate_top text-center mx-auto", className)}
      >
        {title && (
          <div className="bg-zumthor dark:bg-blacksection dark:border dark:border-strokedark inline-block rounded-full py-1.5 px-4.5 mb-4">
            <h4 className="font-medium text-sectiontitle text-black dark:text-white">{title}</h4>
          </div>
        )}
        <h2 className="font-bold text-3xl md:text-4xl xl:text-5xl xl:text-sectiontitle3 text-black dark:text-white mx-auto mb-4">
          {subtitle}
        </h2>
        <p className="mx-auto md:w-4/5 lg:w-3/5 xl:w-[46%]">{description}</p>
      </motion.div>
      {/* <!-- Section Title End --> */}
    </>
  );
};

export default SectionHeader;
