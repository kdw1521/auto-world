"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      style={{ zIndex: 2147483647 }}
      offset={{ top: 96, right: 16 }}
    />
  );
}
