"use client";

import { Column, Flex, Icon, Line, Row, Text } from "@once-ui-system/core";
import Link from "next/link";

import { links, site } from "@/resources";
import styles from "./Footer.module.scss";

const columns = [
  {
    title: "Desktop",
    items: [
      { label: "Plugin repository", href: links.desktopRepo, external: true },
      { label: "Forgejo mirror", href: links.desktopForgejo, external: true },
      { label: "TidaLuna", href: links.tidaluna, external: true },
    ],
  },
  {
    title: "Android",
    items: [
      { label: "Download the Manager", href: links.mobileReleases, external: true },
      { label: "rl-mobile repository", href: links.mobileRepo, external: true },
      { label: "Issues", href: links.mobileIssues, external: true },
    ],
  },
  {
    title: "Elsewhere",
    items: [
      { label: "GitHub", href: links.github, external: true },
      { label: site.parent.label, href: site.parent.href, external: true },
      { label: "Email", href: `mailto:${links.email}`, external: false },
    ],
  },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Column as="footer" fillWidth horizontal="center" borderTop="neutral-alpha-weak">
      <Column
        className={styles.inner}
        maxWidth="l"
        fillWidth
        paddingX="24"
        paddingY="64"
        gap="48"
      >
        <Row fillWidth gap="48" m={{ direction: "column" }} s={{ direction: "column" }}>
          <Column flex={3} gap="16">
            <Row gap="8" vertical="center">
              <Icon name="radiant" size="s" />
              <Text variant="label-strong-m" onBackground="neutral-strong">
                {site.name}
              </Text>
            </Row>
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
              style={{ maxWidth: "22rem" }}
            >
              Built on TidaLuna by Inrixia, inspired by beautiful-lyrics from
              surfbryce.
            </Text>
          </Column>

          {/* Links collapse on phones (mobile friendly)*/}
          {columns.map((column) => (
            <Column key={column.title} flex={2} gap="12" className="s-flex-hide">
              <Text variant="label-strong-s" onBackground="neutral-strong">
                {column.title}
              </Text>
              <Column gap="8">
                {column.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={styles.footerLink}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    <Text variant="body-default-s">{item.label}</Text>
                  </Link>
                ))}
              </Column>
            </Column>
          ))}
        </Row>

        <Line background="neutral-alpha-weak" />

        <Row fillWidth horizontal="between" vertical="center" gap="16" s={{ direction: "column" }}>
          <Text variant="code-default-xs" onBackground="neutral-weak">
            © {year} meoware.exe — not affiliated with TIDAL
          </Text>
          <Flex gap="16" className="s-flex-hide">
            <Link
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className={styles.footerLink}
            >
              <Row gap="8" vertical="center">
                <Icon name="github" size="xs" />
                <Text variant="body-default-s">GitHub</Text>
              </Row>
            </Link>
          </Flex>
        </Row>
      </Column>
    </Column>
  );
};
