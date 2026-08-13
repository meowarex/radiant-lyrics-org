"use client";

import { Accordion, Flex, Row, Text } from "@once-ui-system/core";
import type { ReactNode } from "react";

import styles from "./MobileCollapse.module.scss";
import { useIsMobile } from "./useIsMobile";

/**
 * Collapses long blocks behind an accordion on phones (mobile friendly)
 */
export function MobileCollapse({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  const isMobile = useIsMobile();

  if (!isMobile) return <>{children}</>;

  return (
    <Flex
      fillWidth
      direction="column"
      className={styles.shell}
      radius="l"
      border="neutral-alpha-weak"
      overflow="hidden"
    >
      <Accordion
        className={styles.header}
        radius="l"
        title={
          <Row fillWidth gap="8" vertical="center" horizontal="between">
            <Text variant="label-strong-m">{title}</Text>
            <Text variant="code-default-xs" onBackground="neutral-weak">
              {count}
            </Text>
          </Row>
        }
      >
        {children}
      </Accordion>
    </Flex>
  );
}
