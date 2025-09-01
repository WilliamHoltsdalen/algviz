'use client';

import { useCallback, useState } from 'react';
import * as htmlToImage from 'html-to-image';

// gifshot has no official types; we'll type minimal surface we use
type GifShotOptions = {
  images: string[];
  gifWidth: number;
  gifHeight: number;
  interval?: number; // seconds between frames
  numFrames?: number;
  frameDuration?: number; // ms per frame (alternative to interval)
  sampleInterval?: number;
  numWorkers?: number;
  fontWeight?: string | number;
};

type GifShotResult = { image: string };

declare const window: any;

// Module-level storage so all hook instances share the same frames
let framesStore: string[] = [];

export function useGifExport() {
  const [isExporting, setIsExporting] = useState(false);

  const reset = useCallback(() => {
    framesStore = [];
  }, []);

  const captureFrame = useCallback(async (element: HTMLElement, width?: number, height?: number) => {
    // Use pixelRatio=2 for sharper output
    const dataUrl = await htmlToImage.toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      width: width ?? element.offsetWidth,
      height: height ?? element.offsetHeight,
      style: {
        transform: 'none', // avoid scaled capture issues
      },
    });
    framesStore.push(dataUrl);
    return dataUrl;
  }, []);

  const captureAnimationFrames = useCallback(
    async (
      element: HTMLElement,
      options?: { frames?: number; delayMs?: number; width?: number; height?: number }
    ) => {
      const frames = options?.frames ?? 0;
      const delayMs = options?.delayMs ?? 200;
      const width = options?.width ?? element.offsetWidth;
      const height = options?.height ?? element.offsetHeight;

      // If frames is 0, just capture one still frame
      if (frames <= 1) {
        await captureFrame(element, width, height);
        return;
      }

      for (let i = 0; i < frames; i++) {
        // eslint-disable-next-line no-await-in-loop
        await captureFrame(element, width, height);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, delayMs));
      }
    },
    [captureFrame]
  );

  const exportToGif = useCallback(
    async (options?: { filename?: string; delayMs?: number; width?: number; height?: number }) => {
      if (framesStore.length === 0) return;

      setIsExporting(true);
      try {
        const delayMs = options?.delayMs ?? 200;
        const width = options?.width ?? 800;
        const height = options?.height ?? 600;

        // Lazy-load gifshot in browser to avoid SSR issues
        const gifshot = await import('gifshot');

        const result: GifShotResult = await new Promise((resolve, reject) => {
          const gifOptions: GifShotOptions = {
            images: framesStore,
            gifWidth: width,
            gifHeight: height,
            // gifshot uses interval in seconds
            interval: Math.max(delayMs / 1000, 0.02),
            numWorkers: 2,
            sampleInterval: 10,
          };

          gifshot.createGIF(gifOptions as any, (obj: any) => {
            if (!obj || obj.error) {
              reject(new Error(obj?.errorMsg || 'Failed to create GIF'));
              return;
            }
            resolve({ image: obj.image as string });
          });
        });

        // Trigger download
        const link = document.createElement('a');
        link.href = result.image;
        link.download = options?.filename ?? 'algorithm-visualization.gif';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } finally {
        setIsExporting(false);
        reset();
      }
    },
    [reset]
  );

  return {
    isExporting,
    framesCount: () => framesStore.length,
    reset,
    captureFrame,
    captureAnimationFrames,
    exportToGif,
  };
}


