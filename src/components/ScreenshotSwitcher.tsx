"use client";

import { Card, Column, Fade, Flex, Icon, Media, Row, Text } from "@once-ui-system/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { screenshotAspect, screenshots } from "@/resources";
import styles from "./ScreenshotSwitcher.module.scss";
import { Segmented } from "./Segmented";

/** How long an auto-rotating shot holds before advancing. */
const ROTATE_MS = 4200;

type Slide = { src: string; alt: string; caption: string; group: string };

/**
 * One flat list behind the whole control. The segmented buttons jump to a group,
 * the click zones walk the list, and an auto-rotating group cycles within its own
 * range — all off a single index, so the three never disagree about what's on
 * screen.
 */
const slides: Slide[] = screenshots.flatMap((group) =>
  group.shots.map((shot) => ({ ...shot, group: group.value })),
);

const views = screenshots.map((group) => ({ value: group.value, label: group.label }));

const groupOf = (value: string) => screenshots.find((group) => group.value === value);
const firstOfGroup = (group: string) => slides.findIndex((slide) => slide.group === group);
const lastOfGroup = (group: string) =>
  slides.length - 1 - [...slides].reverse().findIndex((slide) => slide.group === group);

/** Opens on the middle group — the one people actually came to see. */
const DEFAULT_INDEX = firstOfGroup(screenshots[Math.floor(screenshots.length / 2)].value);

export function ScreenshotSwitcher() {
  const [index, setIndex] = useState(DEFAULT_INDEX);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const active = slides[index];
  const rotates = groupOf(active.group)?.autoRotate ?? false;
  const subtleFade = groupOf(active.group)?.subtleFade ?? false;

  // Rotation wraps inside the active group rather than spilling into the others
  useEffect(() => {
    if (!rotates || paused || reducedMotion.current) return;
    const group = active.group;
    const id = setInterval(() => {
      setIndex((current) => (current + 1 > lastOfGroup(group) ? firstOfGroup(group) : current + 1));
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [rotates, paused, active.group]);

  const step = useCallback((delta: number) => {
    setIndex((current) => (current + delta + slides.length) % slides.length);
  }, []);

  const onToggle = useCallback((group: string) => {
    setIndex(firstOfGroup(group));
  }, []);

  // Pips appear for any group holding more than one shot, not just the rotating one
  const groupShots = useMemo(
    () => slides.filter((slide) => slide.group === active.group),
    [active.group],
  );
  const groupStart = firstOfGroup(active.group);

  return (
    <Column fillWidth className={styles.shell}>
      <Card
        className={`${styles.card} static-card`}
        fillWidth
        direction="column"
        padding="8"
        gap="8"
        radius="xl"
        background="surface"
        border="neutral-alpha-weak"
        shadow="xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Straddles the card's top border, half above it and half below */}
        <div className={styles.controlDock}>
          <Segmented value={active.group} buttons={views} onChange={onToggle} />
        </div>

        <Column fillWidth className={styles.viewport} radius="l" overflow="hidden">
          <div className={styles.stack}>
            {slides.map((slide, slideIndex) => (
              <Flex
                key={slide.src}
                fillWidth
                className={`${styles.frame} ${slideIndex === index ? styles.frameActive : ""}`}
                aria-hidden={slideIndex !== index}
              >
                <Media
                  fillWidth
                  src={slide.src}
                  alt={slide.alt}
                  aspectRatio={screenshotAspect}
                  radius="l"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={slideIndex === DEFAULT_INDEX}
                />
              </Flex>
            ))}
          </div>

          {/*
            Melts the bottom edge of the shot into the card instead of cutting it.
          */}
          <Fade
            base="surface"
            to="top"
            position="absolute"
            bottom="0"
            left="0"
            fillWidth
            height={subtleFade ? "16" : "64"}
            pointerEvents="none"
            zIndex={1}
          />

          <button
            type="button"
            aria-label="Previous screenshot"
            onClick={() => step(-1)}
            className={`${styles.zone} ${styles.zoneLeft}`}
          >
            <span className={styles.chevron}>
              <Icon name="chevronLeft" size="s" />
            </span>
          </button>
          <button
            type="button"
            aria-label="Next screenshot"
            onClick={() => step(1)}
            className={`${styles.zone} ${styles.zoneRight}`}
          >
            <span className={styles.chevron}>
              <Icon name="chevronRight" size="s" />
            </span>
          </button>
        </Column>

        <Row
          fillWidth
          horizontal="between"
          vertical="center"
          paddingX="12"
          paddingBottom="4"
          gap="16"
        >
          <Text variant="code-default-xs" onBackground="neutral-weak">
            {active.caption}
          </Text>

          {groupShots.length > 1 ? (
            <Row gap="8" vertical="center">
              {groupShots.map((shot, shotIndex) => (
                <button
                  key={shot.src}
                  type="button"
                  aria-label={`Show ${shot.caption}`}
                  aria-current={groupStart + shotIndex === index}
                  onClick={() => setIndex(groupStart + shotIndex)}
                  className={`${styles.pip} ${
                    groupStart + shotIndex === index ? styles.pipActive : ""
                  }`}
                />
              ))}
            </Row>
          ) : null}
        </Row>
      </Card>
    </Column>
  );
}
