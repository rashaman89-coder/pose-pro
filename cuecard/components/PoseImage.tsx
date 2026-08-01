"use client";

import { useCallback, useState } from "react";
import type { Pose } from "@/lib/types";

type Size = "thumb" | "card" | "full";

interface Props {
  pose: Pose;
  size?: Size;
  className?: string;
  /** Above-the-fold images skip lazy loading so the first paint isn't blank. */
  priority?: boolean;
  sizes?: string;
}

/**
 * Renders a catalog image over its inline blur placeholder, so a slow
 * connection shows the composition immediately instead of a grey box.
 *
 * Deliberately a plain <img>: the build already produced right-sized WebP
 * variants, and next/image's optimizer doesn't exist in a static export.
 */
export default function PoseImage({
  pose,
  size = "card",
  className = "",
  priority = false,
  sizes,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  /*
   * A cached image can finish decoding before React attaches onLoad, and then
   * the event never fires — leaving the real photo stuck at opacity 0 behind
   * the blur. Checking `complete` when the node mounts covers that case, which
   * is the common one on every page after the first.
   */
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-paper-sunk ${className}`}>
      <img
        src={pose.image.blur}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 size-full scale-105 object-cover blur-xl
                    transition-opacity duration-500
                    ${loaded ? "opacity-0" : "opacity-100"}`}
      />
      <img
        ref={ref}
        src={pose.image[size]}
        alt={pose.title}
        width={pose.image.width}
        height={pose.image.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={`relative size-full object-cover transition-opacity duration-500
                    ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
