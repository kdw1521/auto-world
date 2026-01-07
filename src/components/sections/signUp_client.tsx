"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type SignUpClientProps = {
  children: ReactNode;
};

export default function SignUpClient({ children }: SignUpClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-md"
    >
      {children}
    </motion.div>
  );
}
