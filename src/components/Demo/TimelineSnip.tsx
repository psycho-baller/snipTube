import { useState, type FC, type RefObject, useEffect } from 'react';
import { motion } from "framer-motion";
import type { Snip } from '~lib/types';

interface Props {
  snip: Snip;
  videoRef: RefObject<HTMLVideoElement>;
  firstSnip: boolean;
}

const TimelineSnip: FC<Props> = (props) => {
  const { snip, videoRef, firstSnip } = props;

  const [showDescription, setShowDescription] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowDescription(false);
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const startPercent = (snip.startTimestamp / videoRef.current?.duration) * 100;
  const endPercent = (snip.endTimestamp / videoRef.current?.duration) * 100;
  return (
    <>
    <div
      className="absolute h-full bg-primary transition-transform ease-in-out duration-150 transform z-40"
      key={snip.id}
      style={{
        left: Math.max(startPercent, 0) + "%",
        width: endPercent - Math.max(startPercent, 0) + "%",
      }}
    />
    {/* add illustration to tell user of the outcome of creating the snip */}
    {firstSnip && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: showDescription ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-10 transform z-40 font-sketch text-2xl text-center"
      style={{
        left: Math.max(startPercent, 0) + "%",
        width: Math.max(endPercent - Math.max(startPercent, 0), 10) + "%",
      }}
    >
      This snip will be taken to our powerful AI to summarize it then will be stored for you to visit whenever it suits you
    </motion.p>
    )}
    </>
  );
};

export default TimelineSnip;
