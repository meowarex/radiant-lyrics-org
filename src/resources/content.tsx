/** Everything the page says, in one place. */

import type { ReactNode } from "react";

import type { IconName } from "./icons";

export const RADIANT = "#9966cc";

export const site = {
  name: "Radiant Lyrics",
  tagline: "",
  parent: { label: "atomix.one", href: "https://atomix.one" },
};

export const links = {
  desktopRepo: "https://github.com/meowarex/tidaluna-plugins",
  desktopForgejo: "https://git.atomix.one/meoware.exe/TidalLuna-Plugins",
  store: "https://github.com/meowarex/tidaluna-plugins/releases/download/latest/store.json",
  mobileRepo: "https://github.com/meowarex/rl-mobile",
  mobileReleases: "https://github.com/meowarex/rl-mobile/releases/latest",
  mobileIssues: "https://github.com/meowarex/rl-mobile/issues",
  tidaluna: "https://github.com/Inrixia/TidaLuna",
  github: "https://github.com/meowarex",
  siteRepo: "https://github.com/meowarex/radiant-lyrics-org",
  email: "rl@atomix.one",
};

/** Terax-style nav: one page, anchored sections. */
export const navLinks = [
  { href: "#lyrics", label: "Lyrics" },
  { href: "#ui", label: "UI" },
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
];

/**
 * A stat with an `href` renders as a link button instead of a figure; one with a
 * `count` ticks up to that number, keeping whatever `value` wraps around it.
 */
export type Stat = {
  value: string;
  label: string;
  href?: string;
  icon?: IconName;
  count?: number;
};

export const stats: Stat[] = [
  { value: "Word/Syllable", label: "Lyric Timings" },
  { value: "Tidaluna", label: "Plugin Ecosystem" },
  { value: "Free!", label: "Yup thats right!" },
  { value: "GitHub", label: "GPL 3.0 · Open source", href: links.desktopRepo, icon: "github" },
];

export type Bullet = { icon: IconName; label: string };

export type Showcase = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  /** ReactNode so copy can use <strong> (for bold text) */
  description: ReactNode;
  bullets: Bullet[];
};

export const showcases: Showcase[] = [
  {
    id: "lyrics",
    index: "01",
    eyebrow: "Lyrics",
    title: "Lyrics that light up as they're sung.",
    description: "Line, word & syllable level timing & Beautiful styling options!",
    bullets: [
      { icon: "sparkles", label: "Syllable level highlighting" },
      { icon: "note", label: "Glow size, font scale and blur are all sliders <3" },
      { icon: "language", label: "Romanization for non-latin languages" },
      { icon: "cursor", label: "Context aware background vocals and duet positioning" },
    ],
  },
  {
    id: "ui",
    index: "02",
    eyebrow: "UI",
    title: "UI.. Overhauled!",
    description: (
      <>
        Completely changes the UI so you can <strong>really feel the radiance!</strong>
      </>
    ),
    bullets: [
      { icon: "swatch", label: "Cover art shaders, reacting to playback" },
      { icon: "layout", label: "Floating player bar with radius, spacing and blur" },
      { icon: "cursor", label: "Hide UI mode, and Cover Art everywhere across the app" },
    ],
  },
];

export type Shot = { src: string; alt: string; caption: string };
export type ShotGroup = {
  value: string;
  label: string;
  autoRotate?: boolean /** Advances on its own (Groups without are stepped by hand) */;
  /** Barely-there bottom fade, for shots where the player bar has to stay readable */
  subtleFade?: boolean;
  shots: Shot[];
};

/* Screenshot switcher */
export const screenshotAspect = "2160 / 1107";

export const screenshots: ShotGroup[] = [
  {
    value: "home",
    label: "Home",
    shots: [
      {
        src: "/images/screenshots/home.avif",
        alt: "TIDAL home screen with the Radiant Lyrics cover art backdrop",
        caption: "home · cover everywhere",
      },
    ],
  },
  {
    value: "now-playing",
    label: "Now Playing",
    subtleFade: true,
    shots: [
      {
        src: "/images/screenshots/now-playing-1.avif",
        alt: "Radiant Lyrics now playing view with word level highlighting",
        caption: "now playing · word timing",
      },
      {
        src: "/images/screenshots/now-playing-2.avif",
        alt: "Radiant Lyrics showing a background vocal under the active line",
        caption: "now playing · background vocals",
      },
    ],
  },
  {
    value: "more",
    label: "More",
    autoRotate: true,
    shots: [
      {
        src: "/images/screenshots/more-1.avif",
        alt: "A TIDAL playlist page tinted by the Radiant Lyrics backdrop",
        caption: "playlists · dynamic backdrop",
      },
      {
        src: "/images/screenshots/more-2.avif",
        alt: "The Radiant Lyrics settings panel inside TidaLuna",
        caption: "settings · every toggle",
      },
      {
        src: "/images/screenshots/more-3.avif",
        alt: "The lyrics menu showing romanization, AI syllables and timing modes",
        caption: "lyrics menu · timing modes",
      },
    ],
  },
];

export type Feature = { icon: IconName; title: string; desc: string };

export const desktopFeatures: Feature[] = [
  {
    icon: "sparkles",
    title: "Syllable level lyrics",
    desc: "Line, word & syllable timings!",
  },
  {
    icon: "note",
    title: "Radiant glow",
    desc: "Adjustable from subtle to blinding",
  },
  {
    icon: "swatch",
    title: "Cover art shaders",
    desc: "Variety of shaders that use Kawase blur, dithering and warp effects",
  },
  {
    icon: "language",
    title: "Romanization",
    desc: "Latin text for non-latin lyrics",
  },
  {
    icon: "layout",
    title: "Floating player bar",
    desc: "Radius, spacing, backdrop blur and an integrated seek bar.",
  },
  {
    icon: "cursor",
    title: "Hide UI mode",
    desc: "Hide the UI for a true fullscreen view",
  },
  {
    icon: "chip",
    title: "Syllable AI",
    desc: "A self trained model generates syllable timings from Line when unavailable",
  },
  {
    icon: "bolt",
    title: "Performance mode",
    desc: "A variety of adjustments that cut GPU/CPU load",
  },
  {
    icon: "code",
    title: "Built on TidaLuna",
    desc: "Installs from the plugin store in two clicks. No patching required <3",
  },
];

export const mobileFeatures: Feature[] = [
  {
    icon: "sparkles",
    title: "Radiant Lyrics API",
    desc: "Higher quality lyrics & word/syllable timings",
  },
  {
    icon: "swatch",
    title: "Player backdrop adjustments",
    desc: "Full image adjustments for Tidals mobile player backdrop!",
  },
  {
    icon: "play",
    title: "Lyrics screen",
    desc: "Progress pill restored, controls stay visible and more!",
  },
  {
    icon: "hand",
    title: "One handed mode",
    desc: "Bottom controls mirrored for thumb reach",
  },
  {
    icon: "mobile",
    title: "Redesigned mini player",
    desc: "Seekbar folded into the controls, with swipe gestures for track changes!",
  },
  {
    icon: "sliders",
    title: "Every patch optional",
    desc: "Everything is always optional and customisable <3",
  },
];

export type Step = { title: string; body: string };

export const desktopSteps: Step[] = [
  {
    title: "Install TidaLuna",
    body: "Radiant Lyrics runs on TidaLuna, Inrixia's plugin framework for the TIDAL desktop app.",
  },
  {
    title: "Open Luna Settings",
    body: "Launch TIDAL and hit the Luna settings entry in the top right menu.",
  },
  {
    title: "Find the Plugin Store",
    body: "Switch to the Plugin Store tab and scroll to Radiant Lyrics, then click to install.",
  },
  {
    title: "Make it yours!",
    body: "Head to the Plugins tab and asjust every setting/feature.",
  },
];

export const mobileSteps: Step[] = [
  {
    title: "Grab the Manager",
    body: "Download the latest rl-manager.apk from Releases and install it, allowing unknown sources if prompted.",
  },
  {
    title: "Pick your patches",
    body: "Open the Manager and toggle the patches and integrations you actually want. Everything is optional <3",
  },
  {
    title: "Patch & install",
    body: "The Manager downloads TIDAL, applies your patches and hands you the rebuilt APK to install.",
  },
  {
    title: "Play something",
    body: "Open the patched TIDAL, hit the sparkle and watch the lyrics light up <3",
  },
];
