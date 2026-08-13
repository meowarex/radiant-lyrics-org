"use client";

import type { Kawarp } from "@kawarp/core";
import { useEffect, useRef, useState } from "react";

import styles from "./KawarpBackdrop.module.scss";

/**
 * The Radiant Lyrics backdrop, running the real @kawarp/core shader.
 *
 * This is a port of the plugin's `backdrop.ts` (KawarpLayer) with its stock
 * settings baked in — same option mapping, same DPR handling, same manual render
 * loop, same CSS contrast/auto-darken pass. The one difference is the source
 * texture: the plugin feeds it the album art of whatever is playing, and nothing
 * is playing on a website, so it gets one fixed cover instead.
 */

/** Stock values from the plugin's settings defaults. */
const DEFAULTS = {
  opacity: 75,
  warp: 100,
  blurPasses: 5,
  speed: 175,
  contrast: 125,
  saturation: 125,
  dithering: 15,
  scale: 100,
  darken: 80,
};

/** The same unit conversion the plugin does before handing options to kawarp. */
const KAWARP_OPTIONS = {
  warpIntensity: DEFAULTS.warp / 100,
  blurPasses: DEFAULTS.blurPasses,
  animationSpeed: DEFAULTS.speed / 100,
  saturation: DEFAULTS.saturation / 100,
  dithering: DEFAULTS.dithering / 1000,
  scale: DEFAULTS.scale / 100,
};

/**
 * The cover art the shader renders from. Served locally, so no CORS to fight.
 *
 * Deliberately the 80x80 variant: kawarp blurs the source into a 128x128
 * framebuffer the moment it loads and every frame after that samples the blurred
 * copy, so resolution above that is decoded and thrown away. The plugin asks
 * TIDAL for 1280x1280, but it's reusing an image the player has already cached —
 * on a cold page load that would be half a megabyte for no visible difference.
 */
const COVER_SRC = "/images/products/radiant/cover.jpg";

// Auto-darken constants, lifted from the plugin
const SAMPLE_SIZE = 16;
const MIN_BRIGHTNESS = 0.15;
const CEILING_AT_MIN_STRENGTH = 0.9;
const CEILING_AT_MAX_STRENGTH = 0.15;

/** Mean Rec. 709 luma of the source art, 0-1. */
const measureLuminance = (source: CanvasImageSource): number | null => {
  const sampler = document.createElement("canvas");
  sampler.width = SAMPLE_SIZE;
  sampler.height = SAMPLE_SIZE;
  const ctx = sampler.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  try {
    ctx.drawImage(source, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    }
    return sum / (data.length / 4);
  } catch {
    return null;
  }
};

/** The plugin's auto-darken: pull bright covers down so text stays readable. */
const darkenFilter = (luminance: number | null): string => {
  const parts: string[] = [];
  if (DEFAULTS.contrast !== 100) parts.push(`contrast(${DEFAULTS.contrast}%)`);

  if (DEFAULTS.darken > 0 && luminance !== null) {
    const effective = luminance * (DEFAULTS.opacity / 100);
    const ceiling =
      CEILING_AT_MIN_STRENGTH -
      (DEFAULTS.darken / 100) * (CEILING_AT_MIN_STRENGTH - CEILING_AT_MAX_STRENGTH);
    if (effective > ceiling && effective > 0) {
      parts.push(`brightness(${Math.max(ceiling / effective, MIN_BRIGHTNESS).toFixed(3)})`);
    }
  }
  return parts.join(" ");
};

export const KawarpBackdrop = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let engine: Kawarp | null = null;
    let rafId: number | null = null;
    let disposed = false;
    let shaderTime = 0;
    let lastFrame = 0;
    let visible = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncSize = () => {
      // Performance mode is off by default, so DPR is capped at 2 like the plugin
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      engine?.resize();
    };

    const tick = () => {
      rafId = null;
      if (!engine || disposed) return;
      const now = performance.now();
      // Clamped so a backgrounded tab doesn't jump the shader on return
      const dt = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      shaderTime += dt * (DEFAULTS.speed / 100);
      engine.renderFrame(shaderTime);
      if (visible && !reducedMotion.matches) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const startLoop = () => {
      if (rafId !== null || !engine || disposed) return;
      lastFrame = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    const resizeObserver = new ResizeObserver(() => syncSize());
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) startLoop();
      else stopLoop();
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) stopLoop();
      else startLoop();
    };

    (async () => {
      try {
        const { Kawarp } = await import("@kawarp/core");
        if (disposed) return;

        syncSize();
        engine = new Kawarp(canvas, KAWARP_OPTIONS);
        canvas.style.opacity = String(DEFAULTS.opacity / 100);

        // Decode once and hand the bitmap over, the same way the plugin does
        try {
          const res = await fetch(COVER_SRC);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const bitmap = await createImageBitmap(await res.blob());
          if (disposed) {
            bitmap.close();
            return;
          }
          try {
            canvas.style.filter = darkenFilter(measureLuminance(bitmap));
            engine.loadImageElement(bitmap);
          } finally {
            bitmap.close();
          }
        } catch {
          // Fall back to kawarp's own loader; auto-darken sits this one out
          canvas.style.filter = darkenFilter(null);
          await engine.loadImage(COVER_SRC);
          if (disposed) return;
        }

        resizeObserver.observe(host);
        document.addEventListener("visibilitychange", onVisibility);
        reducedMotion.addEventListener("change", onMotionChange);

        setReady(true);
        // One frame regardless, so reduced-motion users still get the artwork
        engine.renderFrame(0);
        if (!reducedMotion.matches) startLoop();
      } catch {
        // No WebGL, or the context was refused — the page reads fine without it
      }
    })();

    return () => {
      disposed = true;
      stopLoop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
      engine?.dispose();
      engine = null;
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.host} aria-hidden="true">
      <canvas ref={canvasRef} className={`${styles.canvas} ${ready ? styles.canvasReady : ""}`} />
    </div>
  );
};
