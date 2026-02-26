"use client";
import { easeIn, motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function MotionSection({
  children,
  className,
  delay = 0,
}: Props) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: easeIn }}
    >
      {children}
    </motion.section>
  );
}
