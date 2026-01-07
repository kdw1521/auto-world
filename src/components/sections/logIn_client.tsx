"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type LogInClientProps = {
  children: ReactNode;
};

export default function LogInClient({ children }: LogInClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md relative z-10"
    >
      {children}
    </motion.div>
  );
}
