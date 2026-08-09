import { useState, useLayoutEffect, type RefObject } from "react";

export function useDropdownPosition(
  triggerRef: RefObject<HTMLElement | null>,
  open: boolean,
  estimatedHeight = 240,
) {
  const [openUpward, setOpenUpward] = useState(false);

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < estimatedHeight && rect.top > estimatedHeight);
    }
  }, [open, triggerRef, estimatedHeight]);

  return openUpward;
}