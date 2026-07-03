import { useEffect, useRef, useCallback } from "react";

interface ScrollytellingCanvasProps {
  /** Total number of frames (e.g. 180 for image000–image179) */
  frameCount: number;
  /** Base path, e.g. "/PIL_GAME/image" */
  basePath: string;
  /** Zero-padded digits, e.g. 3 → "000" */
  padLength?: number;
  /** File extension */
  ext?: string;
  /** How many vh of scroll space to pin the section */
  scrollHeight?: number;
  /** Called on every frame change with current frame index */
  onFrameChange?: (frame: number) => void;
}

export default function ScrollytellingCanvas({
  frameCount,
  basePath,
  padLength = 3,
  ext = "png",
  scrollHeight = 500,
  onFrameChange,
}: ScrollytellingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Build zero-padded filename
  const getFramePath = useCallback(
    (index: number) => {
      const padded = String(index).padStart(padLength, "0");
      return `${basePath}${padded}.${ext}`;
    },
    [basePath, padLength, ext]
  );

  // Draw a specific frame onto canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cover-fit the image into the canvas
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const ox = (cw - sw) / 2;
    const oy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, ox, oy, sw, sh);
  }, []);

  // Resize canvas to match window
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Preload all images
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;

    const loadImage = (i: number) => {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (i === 0) drawFrame(0);
      };
      images[i] = img;
    };

    loadImage(0);
    for (let i = 1; i < frameCount; i++) loadImage(i);
  }, [frameCount, getFramePath, drawFrame]);

  // Set up scroll handler
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      /**
       * FIX: derive scroll range from getBoundingClientRect() + scrollY
       * so the measurement is always accurate regardless of when/where
       * the component is in the page.
       *
       * scrollStart  = absolute top of the wrapper
       * scrollEnd    = scrollStart + wrapperHeight - viewportHeight
       *                (the last scroll position where sticky is still pinned)
       *
       * progress = how far we are between those two points → [0, 1]
       */
      const rect = container.getBoundingClientRect();
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      const scrollStart = scrollY + rect.top;                         // abs top of wrapper
      const scrollEnd   = scrollStart + container.offsetHeight - viewportHeight; // last pinned scroll pos

      const rawProgress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
      const progress    = Math.min(1, Math.max(0, rawProgress));

      const targetFrame = Math.min(
        frameCount - 1,
        Math.floor(progress * frameCount)
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        onFrameChange?.(targetFrame);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount to set frame 0 correctly

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount, drawFrame, resizeCanvas, onFrameChange]);

  return (
    <div
      ref={containerRef}
      className="scrollytelling-wrapper"
      style={{ height: `${scrollHeight}vh` }}
    >
      {/* Sticky viewport — pins exactly one screen while user scrolls through the wrapper */}
      <div className="scrollytelling-sticky">
        <canvas ref={canvasRef} className="scrollytelling-canvas" />
      </div>
    </div>
  );
}