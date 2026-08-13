"use client";

import { IconButton } from "@once-ui-system/core";
import type React from "react";

import styles from "./ThemeToggle.module.scss";

/**
 * Light mode isn't built yet, so the site is pinned to dark.
 *
 * The control stays in the nav rather than disappearing — it signals the feature
 * exists and is coming — but it's inert and says so on hover. It uses
 * `aria-disabled` instead of `disabled` because a natively disabled button
 * doesn't emit mouse events, which would leave the tooltip unreachable.
 */
export const ThemeToggle: React.FC = () => (
  <IconButton
    icon="light"
    variant="ghost"
    size="m"
    tooltip="Light mode — WIP"
    tooltipPosition="bottom"
    className={styles.wip}
    aria-disabled="true"
    aria-label="Light mode is not available yet"
    onClick={(event: React.MouseEvent) => event.preventDefault()}
  />
);
