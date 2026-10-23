"use client";

import { WeatherFx } from "@once-ui-system/core";
import { type CSSProperties, useEffect, useState } from "react";

/*
 * Ported from atomix-one.
 */
const LAYER: CSSProperties = {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  pointerEvents: "none",
};

type Season = "december" | "autumn" | null;

/** Seasons follow wherever the visitor happens to be */
const currentSeason = (): Season => {
  // Dev only: `?season=autumn` or `?season=december` to preview out of season
  if (process.env.NODE_ENV !== "production") {
    const forced = new URLSearchParams(window.location.search).get("season");
    if (forced === "autumn" || forced === "december") return forced;
  }

  const date = new Date();
  let month: number;
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Australia/Sydney",
      month: "numeric",
    });
    month = Number.parseInt(formatter.format(date), 10);
  } catch (error) {
    console.warn("Could not determine Sydney time, falling back to local time", error);
    month = date.getMonth() + 1;
  }
  if (month === 12) return "december";
  // Southern-hemisphere autumn: March, April, May
  if (month >= 3 && month <= 5) return "autumn";
  return null;
};

export const SeasonalEffects = () => {

  const [season, setSeason] = useState<Season>(null);

  useEffect(() => {
    setSeason(currentSeason());
  }, []);

  if (season === "december") {
    return (
      <WeatherFx
        style={LAYER}
        type="snow"
        data-solid="contrast"
        colors={["brand-solid-strong", "neutral-solid-weak"]}
        intensity={100}
        speed={0.7}
      />
    );
  }

  if (season === "autumn") {
    return (
      <WeatherFx
        style={LAYER}
        type="leaves"
        colors={["warning-solid-strong", "danger-solid-strong", "success-solid-medium"]}
        intensity={120}
        speed={0.6}
        angle={5}
      />
    );
  }

  return null;
};
