"use client";
import { motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, type FC } from 'react';
import { cn } from '~lib/utils';

interface Props extends ComponentPropsWithoutRef<"div"> {
  // TODO: add things like framer motion props, direction, etc
}

const Component: FC<Props> = (props) => {
const { children, className } = props;

  return (
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
    className={cn("animate_top", className)}>
      {children}
    </motion.div>
  );
};

export default Component;
