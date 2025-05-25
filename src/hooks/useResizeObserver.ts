import { useEffect, useState, RefObject } from 'react';

export interface ResizeObserverSize {
  width: number;
  height: number;
}

/**
 * Custom hook that observes the size of a DOM element using ResizeObserver
 * @param ref - React ref to the element to observe
 * @returns Object containing width and height of the observed element
 */
export function useResizeObserver(ref: RefObject<HTMLElement | null>): ResizeObserverSize {
  const [size, setSize] = useState<ResizeObserverSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
}
