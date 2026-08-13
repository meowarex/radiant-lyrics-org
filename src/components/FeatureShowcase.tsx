"use client";

import { Column, Flex, Heading, Icon, RevealFx, Row, Text } from "@once-ui-system/core";
import type { ReactNode } from "react";

import type { Showcase } from "@/resources";
import styles from "./FeatureShowcase.module.scss";
import { SectionEyebrow } from "./Section";

/**
 * Terax's alternating showcase: a narrow copy column with an indexed eyebrow and
 * a rule-bordered bullet list, beside a wider visual. Flips on `reverse`.
 */
export function FeatureShowcase({
  showcase,
  visual,
  reverse,
}: {
  showcase: Showcase;
  visual: ReactNode;
  reverse?: boolean;
}) {
  const copy = (
    <Flex flex={4} key="copy" className={styles.copy}>
      <RevealFx fillWidth translateY={0.5}>
        <Column fillWidth gap="0">
          <SectionEyebrow index={showcase.index}>{showcase.eyebrow}</SectionEyebrow>
          <Heading
            variant="display-strong-s"
            marginTop="20"
            wrap="balance"
            style={{ letterSpacing: "-0.03em" }}
          >
            {showcase.title}
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" marginTop="20" wrap="pretty">
            {showcase.description}
          </Text>
          <Column
            marginTop="32"
            gap="12"
            paddingLeft="20"
            borderLeft="neutral-alpha-weak"
            fillWidth
          >
            {showcase.bullets.map((bullet) => (
              <Row key={bullet.label} gap="12" vertical="start">
                <Flex paddingTop="2">
                  <Icon name={bullet.icon} size="xs" onBackground="brand-weak" />
                </Flex>
                <Text variant="body-default-s" onBackground="neutral-medium" wrap="pretty">
                  {bullet.label}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
      </RevealFx>
    </Flex>
  );

  const media = (
    <Flex flex={6} key="media">
      <RevealFx fillWidth delay={0.1} translateY={0.75}>
        {visual}
      </RevealFx>
    </Flex>
  );

  return (
    <Row
      id={showcase.id}
      className={styles.row}
      fillWidth
      gap="64"
      vertical="center"
      m={{ direction: "column" }}
      s={{ direction: "column" }}
    >
      {reverse ? [media, copy] : [copy, media]}
    </Row>
  );
}
