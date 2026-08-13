"use client";

import { Flex, SegmentedControl } from "@once-ui-system/core";
import type { ComponentProps } from "react";

/**
 * SegmentedControl pulls `radius` out for its inner track and hands everything
 * else — including `background` — to Scroller's outer element, which never gets a
 * radius. A filled control therefore renders as a square panel behind the rounded
 * track. Putting the fill on a wrapper keeps the background and the rounding on
 * the same box.
 */
export function Segmented(props: ComponentProps<typeof SegmentedControl>) {
  return (
    <Flex fitWidth background="neutral-weak" radius="l">
      <SegmentedControl fillWidth={false} {...props} />
    </Flex>
  );
}
