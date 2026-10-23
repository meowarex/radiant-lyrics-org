import React from "react";
import type { IconBaseProps, IconType } from "react-icons";

import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiArrowUpRight,
  HiCalendarDays,
  HiChevronLeft,
  HiChevronRight,
  HiCodeBracket,
  HiCodeBracketSquare,
  HiEnvelope,
  HiMiniCodeBracket,
  HiMiniCodeBracketSquare,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowDownTray,
  HiOutlineBolt,
  HiOutlineComputerDesktop,
  HiOutlineCpuChip,
  HiOutlineCursorArrowRays,
  HiOutlineDevicePhoneMobile,
  HiOutlineDocument,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineHandRaised,
  HiOutlineHeart,
  HiOutlineLanguage,
  HiOutlineLink,
  HiOutlineMoon,
  HiOutlineMusicalNote,
  HiOutlinePlayCircle,
  HiOutlineRocketLaunch,
  HiOutlineShieldExclamation,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineSun,
  HiOutlineSwatch,
} from "react-icons/hi2";

import {
  PiBookBookmarkDuotone,
  PiGridFourDuotone,
  PiHouseDuotone,
  PiImageDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";

import {
  FaAndroid,
  FaApple,
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaLinux,
  FaThreads,
  FaWindows,
  FaX,
} from "react-icons/fa6";

// Lucide's stroke-outline marks, matching the icon style Terax uses
import { LuGithub } from "react-icons/lu";

// Create image-based icons that integrate with the IconProvider API
const createImageIcon =
  (src: string, alt: string): IconType =>
  (props: IconBaseProps) => {
    const size =
      typeof props?.size === "number" ? `${props.size}px` : (props?.size as string) || "1em";
    return React.createElement("img", {
      src,
      alt,
      style: {
        width: size,
        height: size,
        display: "inline-block",
        objectFit: "contain",
      },
    });
  };

const atomix = createImageIcon("/images/brand/atomix.png", "Atomix");

export const iconLibrary: Record<string, IconType> = {
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  home: PiHouseDuotone,
  gallery: PiImageDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: LuGithub,
  githubSolid: FaGithub,
  linkedin: FaLinkedin,
  x: FaX,
  threads: FaThreads,
  windows: FaWindows,
  android: FaAndroid,
  apple: FaApple,
  linux: FaLinux,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  sparkles: HiOutlineSparkles,
  swatch: HiOutlineSwatch,
  note: HiOutlineMusicalNote,
  language: HiOutlineLanguage,
  bolt: HiOutlineBolt,
  sliders: HiOutlineAdjustmentsHorizontal,
  mobile: HiOutlineDevicePhoneMobile,
  desktop: HiOutlineComputerDesktop,
  download: HiOutlineArrowDownTray,
  cursor: HiOutlineCursorArrowRays,
  layout: HiOutlineSquares2X2,
  play: HiOutlinePlayCircle,
  hand: HiOutlineHandRaised,
  warning: HiOutlineShieldExclamation,
  heart: HiOutlineHeart,
  chevronLeft: HiChevronLeft,
  chevronRight: HiChevronRight,
  chip: HiOutlineCpuChip,
  light: HiOutlineSun,
  dark: HiOutlineMoon,
  // Image-based icons
  atomix: atomix,
  // The plugin's own mark — the sparkle that replaces TIDAL's lyrics button
  radiant: HiOutlineSparkles,
  forgejo: HiCodeBracketSquare,
  code: HiCodeBracket,
  miniCode: HiMiniCodeBracketSquare,
  miniRCode: HiMiniCodeBracket,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;

// Once UI types icon names as a union; register ours so `name="github"` compiles
declare module "@once-ui-system/core" {
  interface IconLibraryOverrides extends Record<IconName, true> {}
}
