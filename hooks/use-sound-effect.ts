"use client";

import { useEffect, useRef } from "react";

export function useSoundEffect() {
  // No-op implementation that does nothing
  const playSwipeSound = (type: "like" | "dislike") => {
    // Sound functionality removed
  };

  const toggleSoundEnabled = () => {
    return false; // Always disabled
  };

  return { playSwipeSound, toggleSoundEnabled };
}
