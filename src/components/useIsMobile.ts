"use client";

import { useEffect, useState } from "react";

/** Once UI's `s` breakpoint. */
const MOBILE_QUERY = "(max-width: 768px)";

/**
 * True on phone-width viewports (mobile friendly)
 */
export function useIsMobile(query: string = MOBILE_QUERY) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}
