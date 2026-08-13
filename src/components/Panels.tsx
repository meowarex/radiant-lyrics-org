"use client";

import {
  Button,
  Column,
  CountFx,
  Flex,
  Grid,
  Icon,
  Row,
  ShineFx,
  Text,
} from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";

import type { Feature, Stat, Step } from "@/resources";
import styles from "./Panels.module.scss";

/** Four-up hairline grid of headline numbers. A stat with an href becomes a link. */
export function StatsRow({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  /*
   * CountFx animates on mount, and this row sits below the fold — left alone it
   * would finish counting before anyone scrolled to it. Mounting it on first
   * intersection is what makes the count actually visible.
   */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Grid
      ref={ref}
      fillWidth
      columns={4}
      s={{ columns: 2 }}
      radius="l"
      border="neutral-alpha-weak"
      className={styles.hairlineGrid}
    >
      {stats.map((stat) => (
        <Column
          key={stat.label}
          className={styles.hairlineCell}
          paddingX="24"
          paddingY="32"
          horizontal="center"
          align="center"
          gap="8"
        >
          {stat.href ? (
            <Button
              href={stat.href}
              size="s"
              variant="secondary"
              data-border="rounded"
              weight="default"
              prefixIcon={stat.icon}
              arrowIcon
            >
              {/* speed is the cycle duration in seconds; baseOpacity keeps it readable */}
              <ShineFx speed={2.5} baseOpacity={0.55}>
                {stat.value}
              </ShineFx>
            </Button>
          ) : stat.count !== undefined ? (
            inView ? (
              <CountFx
                value={stat.count}
                speed={1600}
                easing="ease-out"
                effect="smooth"
                variant="display-strong-xs"
                onBackground="neutral-strong"
                className="mono-display"
                // Swaps the number in and keeps whatever the value wraps it in
                format={(v: number) => stat.value.replace(/\d+/, String(Math.round(v)))}
              />
            ) : (
              // Placeholder at zero, so nothing shifts when the counter mounts
              <Text
                variant="display-strong-xs"
                onBackground="neutral-strong"
                className="mono-display"
              >
                {stat.value.replace(/\d+/, "0")}
              </Text>
            )
          ) : (
            <Text
              variant="display-strong-xs"
              onBackground="neutral-strong"
              className="mono-display"
            >
              {stat.value}
            </Text>
          )}
          <Text
            variant="label-default-xs"
            onBackground="neutral-weak"
            style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            {stat.label}
          </Text>
        </Column>
      ))}
    </Grid>
  );
}

/** Hairline grid of small feature cells, Terax's "more built in" block. */
export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <Grid
      fillWidth
      columns={3}
      m={{ columns: 2 }}
      s={{ columns: 1 }}
      radius="l"
      border="neutral-alpha-weak"
      className={styles.hairlineGrid}
    >
      {features.map((feature) => (
        <Column
          key={feature.title}
          className={`${styles.hairlineCell} ${styles.featureCell}`}
          padding="24"
          gap="0"
        >
          <Flex className={styles.featureIcon} paddingBottom="20">
            <Icon name={feature.icon} size="s" onBackground="neutral-medium" />
          </Flex>
          <Text variant="label-strong-m" onBackground="neutral-strong">
            {feature.title}
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak" marginTop="8" wrap="pretty">
            {feature.desc}
          </Text>
        </Column>
      ))}
    </Grid>
  );
}

/** Numbered install steps. */
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <Column fillWidth gap="12">
      {steps.map((step, index) => (
        <Row
          key={step.title}
          fillWidth
          gap="20"
          padding="20"
          radius="l"
          background="surface"
          border="neutral-alpha-weak"
          vertical="start"
          s={{ direction: "column" }}
        >
          <Flex className={styles.stepNumber}>
            <Text variant="code-strong-s" onBackground="brand-medium">
              {index + 1}
            </Text>
          </Flex>
          <Column gap="4">
            <Text variant="label-strong-m">{step.title}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak" wrap="pretty">
              {step.body}
            </Text>
          </Column>
        </Row>
      ))}
    </Column>
  );
}
