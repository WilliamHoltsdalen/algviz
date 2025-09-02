'use client';

import { useCallback, useState } from 'react';
import * as htmlToImage from 'html-to-image';

type GifShotOptions = {
  images: string[];
  gifWidth: number;
  gifHeight: number;
  interval?: number; 
  numFrames?: number;
  frameDuration?: number; 
  sampleInterval?: number;
  numWorkers?: number;
  fontWeight?: string | number;
};

type GifShotResult = { image: string };

declare const window: any;

// Module-level storage so all hook instances share the same frames
let framesStore: string[] = [];
type ExportOptions = {
  includeUI: boolean;
  loop: boolean;
  delayMs: number;
};

let optionsStore: ExportOptions = {
  includeUI: true,
  loop: true,
  delayMs: 200,
};

export function setGlobalExportOptions(opts: Partial<ExportOptions>) {
  optionsStore = { ...optionsStore, ...opts };
}

export function getGlobalExportOptions(): ExportOptions {
  return optionsStore;
}

export function useGifExport() {
  const [isExporting, setIsExporting] = useState(false);

  const reset = useCallback(() => {
    framesStore = [];
  }, []);

  const captureFrame = useCallback(async (element: HTMLElement, width?: number, height?: number) => {
    // Use pixelRatio=2 for sharper output
    const rawDataUrl = await htmlToImage.toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      width: width ?? element.offsetWidth,
      height: height ?? element.offsetHeight,
      style: {
        transform: 'none', // avoid scaled capture issues
      },
    });
    // Ensure frame is fully opaque to avoid ghosting from alpha blending during quantization
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load frame image'));
      img.src = rawDataUrl;
    });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = width ?? element.offsetWidth;
    const h = height ?? element.offsetHeight;
    canvas.width = w * 2; // match pixelRatio used above
    canvas.height = h * 2;
    if (ctx) {
      // Paint an opaque background and then draw the frame
      ctx.fillStyle = '#0b1220'; // matches dark theme panel background to reduce contouring
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    const opaqueDataUrl = canvas.toDataURL('image/png');
    framesStore.push(opaqueDataUrl);
    return opaqueDataUrl;
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
    async (options?: { filename?: string; delayMs?: number; width?: number; height?: number; loop?: boolean }) => {
      if (framesStore.length === 0) return;

      setIsExporting(true);
      try {
        const delayMs = options?.delayMs ?? optionsStore.delayMs ?? 200;
        const width = options?.width ?? 800;
        const height = options?.height ?? 600;
        const loop = options?.loop ?? optionsStore.loop ?? true;

        // Calculate how many times to duplicate each frame based on desired delay
        const baseInterval = 100; // ms between captures
        const frameMultiplier = Math.max(1, Math.round(delayMs / baseInterval));
        
        // Create duplicated frames array
        const duplicatedFrames: string[] = [];
        framesStore.forEach((frame, index) => {
          // Add each frame multiple times to create the desired delay effect
          for (let i = 0; i < frameMultiplier; i++) {
            duplicatedFrames.push(frame);
          }
          // If this is the final frame, add extra copies to make it linger longer before looping
          if (index === framesStore.length - 1) {
            const finalFrameLingerMultiplier = Math.max(2, Math.round(frameMultiplier * 2));
            for (let i = 0; i < finalFrameLingerMultiplier; i++) {
              duplicatedFrames.push(frame);
            }
          }
        });

        // Lazy-load gifshot in browser to avoid SSR issues
        const gifshot = await import('gifshot');

        const result: GifShotResult = await new Promise((resolve, reject) => {
          const gifOptions: GifShotOptions = {
            images: duplicatedFrames,
            gifWidth: width,
            gifHeight: height,
            interval: 0.1, // 100ms in seconds
            numWorkers: 2,
            sampleInterval: 10,
          };
          (gifOptions as any).repeat = loop ? 0 : -1; // gif.js: 0 = forever, -1 = no repeat
          (gifOptions as any).numLoops = loop ? 0 : 1; // alternative field in some builds
          (gifOptions as any).loop = loop; // boolean flag some wrappers read
          // Configure worker path (use our bundled one) and disposal method to prevent frame blending
          (gifOptions as any).workerScript = '/gif.worker.js';
          // disposal: 2 => restore to background, avoids ghosting from previous frames
          (gifOptions as any).disposal = 2;

          (gifshot as any).createGIF(gifOptions as any, (obj: any) => {
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
        }
      },
      []
  );

  return {
    isExporting,
    framesCount: () => framesStore.length,
    reset,
    captureFrame,
    captureAnimationFrames,
    exportToGif,
    setExportOptions: setGlobalExportOptions,
  };
}


