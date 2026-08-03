"use client";

import * as React from "react";

/** Fire a callback when a click/touch lands outside the given ref's element. */
export function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
  active = true
) {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (!active) return;
    function handler(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [onOutside, active]);

  return ref;
}
