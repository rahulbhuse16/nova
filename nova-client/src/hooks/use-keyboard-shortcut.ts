"use client";

import * as React from "react";

interface ShortcutOptions {
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
}

/** Bind a global keyboard shortcut, e.g. useKeyboardShortcut("k", openPalette, { meta: true }). */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) {
  const savedCallback = React.useRef(callback);
  savedCallback.current = callback;

  React.useEffect(() => {
    function handler(event: KeyboardEvent) {
      const metaOk = options.meta ? event.metaKey || event.ctrlKey : true;
      const shiftOk = options.shift ? event.shiftKey : true;
      if (event.key.toLowerCase() === key.toLowerCase() && metaOk && shiftOk) {
        event.preventDefault();
        savedCallback.current();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, options.meta, options.shift]);
}
