import { Column, Heading, Line, Row, Text } from "@once-ui-system/core";
import type { SpacingToken } from "@once-ui-system/core";
import type { ReactNode } from "react";

/**
 * Terax's section rhythm: a mono eyebrow, a tight display heading, then a lead
 * paragraph capped well short of the container so it stays readable.
 */
export function Section({
  id,
  children,
  paddingY = "160",
}: {
  id?: string;
  children: ReactNode;
  paddingY?: SpacingToken;
}) {
  return (
    <Column
      id={id}
      fillWidth
      horizontal="center"
      paddingX="24"
      paddingY={paddingY}
      s={{ paddingY: "80" }}
    >
      <Column maxWidth="l" fillWidth gap="0">
        {children}
      </Column>
    </Column>
  );
}

export function SectionEyebrow({ index, children }: { index?: string; children: string }) {
  return (
    <Row gap="12" vertical="center">
      {index ? (
        <Text
          variant="code-default-xs"
          onBackground="neutral-weak"
          style={{ letterSpacing: "0.18em", opacity: 0.6 }}
        >
          {index}
        </Text>
      ) : null}
      <Line background="neutral-alpha-medium" maxWidth={2} />
      <Text
        variant="code-default-xs"
        onBackground="neutral-weak"
        style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
      >
        {children}
      </Text>
    </Row>
  );
}

export function SectionHeading({
  children,
  align,
}: {
  children: ReactNode;
  align?: "center";
}) {
  return (
    <Heading
      variant="display-strong-m"
      marginTop="16"
      wrap="balance"
      align={align}
      style={{ letterSpacing: "-0.02em" }}
    >
      {children}
    </Heading>
  );
}

export function SectionLead({
  children,
  align,
}: {
  children: ReactNode;
  align?: "center";
}) {
  return (
    <Text
      variant="body-default-l"
      onBackground="neutral-weak"
      marginTop="16"
      wrap="pretty"
      align={align}
      style={{ maxWidth: "42rem", ...(align === "center" ? { marginInline: "auto" } : {}) }}
    >
      {children}
    </Text>
  );
}
