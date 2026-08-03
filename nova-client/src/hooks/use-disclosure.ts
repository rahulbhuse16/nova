"use client";

import * as React from "react";

/** Shared open/close/toggle state for Sheet, Modal, Popover, Dropdown, CommandPalette. */
export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const onOpen = React.useCallback(() => setIsOpen(true), []);
  const onClose = React.useCallback(() => setIsOpen(false), []);
  const onToggle = React.useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, onOpen, onClose, onToggle };
}
