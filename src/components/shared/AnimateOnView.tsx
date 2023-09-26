"use client";
import { motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cn } from '~lib/utils';

export function AnimateOnView<T extends ElementType = 'div'>({
  // TODO: add things like framer motion props, direction, etc
  as,
  className,
  children,
}: Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'> & {
  as?: T
  className?: string
}) {
  let Component = as ?? 'div';

  const MotionComponent = motion(Component);

  return (
    <MotionComponent
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
    </MotionComponent>
  );
};

export default AnimateOnView;
