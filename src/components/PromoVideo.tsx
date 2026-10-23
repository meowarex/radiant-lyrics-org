"use client";

import { Card, Column, RevealFx, Row, Text } from "@once-ui-system/core";
import { MediaVideoPlayer } from "@once-ui-system/core/components/MediaVideoPlayer";
import { useEffect, useRef } from "react";

/** How much of the frame has to be on screen before playback starts */
const START_THRESHOLD = 0.5;

export function PromoVideo() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    // player keeps its <video> to itself
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const video = frame.querySelector("video");
        if (!video) return;
        observer.disconnect();
        video.play().catch(() => {});
      },
      { threshold: START_THRESHOLD },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <RevealFx fillWidth translateY={0.5}>
      <Card
        className="static-card"
        fillWidth
        direction="column"
        padding="8"
        gap="8"
        radius="xl"
        background="surface"
        border="neutral-alpha-weak"
        shadow="xl"
      >
        <Column
          ref={frameRef}
          fillWidth
          aspectRatio="16 / 9"
          radius="l"
          overflow="hidden"
          background="neutral-weak"
        >
          <MediaVideoPlayer src="/videos/radiant-lyrics-promo.mp4" muted loop />
        </Column>

        <Row fillWidth vertical="center" paddingX="12" paddingBottom="4">
          <Text variant="code-default-xs" onBackground="neutral-weak">
            radiant lyrics · in motion
          </Text>
        </Row>
      </Card>
    </RevealFx>
  );
}
