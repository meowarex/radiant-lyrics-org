"use client";

import {
  Button,
  Card,
  Column,
  Flex,
  Heading,
  HoloFx,
  Icon,
  LetterFx,
  Row,
  RevealFx,
  Text,
} from "@once-ui-system/core";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { FeatureShowcase } from "@/components/FeatureShowcase";
import { LyricPreview } from "@/components/LyricPreview";
import { MobileCollapse } from "@/components/MobileCollapse";
import { FeatureGrid, StatsRow, StepList } from "@/components/Panels";
import { ScreenshotSwitcher } from "@/components/ScreenshotSwitcher";
import { Section, SectionEyebrow, SectionHeading, SectionLead } from "@/components/Section";
import { Segmented } from "@/components/Segmented";
import { useIsMobile } from "@/components/useIsMobile";
import {
  desktopFeatures,
  desktopSteps,
  links,
  mobileFeatures,
  mobileSteps,
  showcases,
  stats,
} from "@/resources";
import styles from "./page.module.scss";

/*
 * Anything keyed on `platform` remounts when you flip the tab, so it can't use
 * the page's entrance timing — RevealFx defaults to 2000ms, which reads as a
 * stall on an interaction. These keep it a transition instead.
 */
const SWAP_SPEED = 550;
const SWAP_LIFT = 0.4;

export default function HomePage() {
  const [platform, setPlatform] = useState("desktop");

  const isMobileDevice = useIsMobile();

  /*
   * Open on the tab that matches the device platform <3
   */
  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) setPlatform("mobile");
  }, []);

  const isDesktop = platform === "desktop";
  const features = isDesktop ? desktopFeatures : mobileFeatures;
  const steps = isDesktop ? desktopSteps : mobileSteps;

  const platformSwitch = (
    <Segmented
      selected={platform}
      onToggle={setPlatform}
      buttons={[
        { value: "desktop", label: "Desktop", prefixIcon: "desktop" },
        { value: "mobile", label: "Android", prefixIcon: "android" },
      ]}
    />
  );

  return (
    <>
      {/* -------------------------------------------------------------- hero */}
      <Column
        id="top"
        className={styles.hero}
        fillWidth
        horizontal="center"
        paddingX="24"
        paddingTop="160"
        paddingBottom="80"
      >
        <Column maxWidth="m" fillWidth horizontal="center" align="center" gap="0">
          <RevealFx horizontal="center">
            <Link
              href={links.siteRepo}
              target="_blank"
              rel="noreferrer"
              className={styles.heroPill}
            >
              {/* Cursor-driven, and the overlays are hidden below the m breakpoint */}
              <HoloFx
                radius="l"
                shine={{ opacity: 80, blending: "color-dodge" }}
                burn={{ opacity: 50, blending: "color-dodge" }}
                texture={{ opacity: 40, blending: "color-dodge" }}
              >
                <Row
                  gap="8"
                  vertical="center"
                  paddingX="12"
                  paddingY="4"
                  radius="l"
                  border="neutral-alpha-medium"
                  background="surface"
                >
                  <Icon name="github" size="xs" onBackground="neutral-weak" />
                  <Text
                    variant="code-default-xs"
                    onBackground="neutral-weak"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    The site is open-source, too
                  </Text>
                </Row>
              </HoloFx>
            </Link>
          </RevealFx>

          {/*
            No RevealFx here on purpose — LetterFx is the entrance. Wrapped, its
            ~700ms scramble ran underneath the fade and you never saw it, which is
            why atomix.one's wordmark isn't wrapped either.
          */}
          <Heading variant="display-strong-xl" align="center" marginTop="32">
            <LetterFx trigger="instant" speed="slow" className={styles.radiantText}>
              Radiant Lyrics
            </LetterFx>
          </Heading>

          <RevealFx horizontal="center" delay={0.2}>
            <Text
              variant="heading-default-l"
              onBackground="neutral-weak"
              align="center"
              wrap="balance"
              marginTop="24"
              style={{ maxWidth: "38rem" }}
            >
              Radiant and beautiful overhaul of the TIDAL UI, From Syllable Lyrics &amp; Glow to
              fancy Shaders.
            </Text>
          </RevealFx>

          <RevealFx horizontal="center" delay={0.3}>
            {/* Android leads and takes the brand fill (mobile friendly) */}
            <Row gap="12" wrap horizontal="center" marginTop="40">
              <Button
                href={isMobileDevice ? links.mobileReleases : links.desktopRepo}
                size="l"
                variant="primary"
                data-border="rounded"
                weight="default"
                prefixIcon={isMobileDevice ? "android" : "desktop"}
                arrowIcon
              >
                {isMobileDevice ? "Get it for Android" : "Get it for Desktop"}
              </Button>
              <Button
                href={isMobileDevice ? links.desktopRepo : links.mobileReleases}
                size="l"
                variant="secondary"
                data-border="rounded"
                weight="default"
                prefixIcon={isMobileDevice ? "desktop" : "android"}
                arrowIcon
              >
                {isMobileDevice ? "Get it for Desktop" : "Get it for Android"}
              </Button>
            </Row>
          </RevealFx>

          <RevealFx horizontal="center" delay={0.4}>
            <Row gap="12" vertical="center" marginTop="32" wrap horizontal="center">
              {["Windows", "macOS", "Linux", "Android"].map((platformName, index) => (
                <Row key={platformName} gap="12" vertical="center">
                  {index > 0 ? (
                    <Flex
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        background: "var(--neutral-alpha-medium)",
                      }}
                    />
                  ) : null}
                  <Text
                    variant="code-default-xs"
                    onBackground="neutral-weak"
                    style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
                  >
                    {platformName}
                  </Text>
                </Row>
              ))}
            </Row>
          </RevealFx>

          <RevealFx horizontal="center" delay={0.5}>
            <Row gap="8" vertical="center" marginTop="24">
              <Text variant="code-default-s" onBackground="neutral-weak" wrap="balance">
                {"// the backdrop behind this page is the real shader <3"}
              </Text>
            </Row>
          </RevealFx>
        </Column>
      </Column>

      {/* ------------------------------------------------------------- stats */}
      <Section paddingY="48">
        <RevealFx fillWidth>
          <StatsRow stats={stats} />
        </RevealFx>
      </Section>

      {/* --------------------------------------------------------- showcases */}
      <Section>
        <FeatureShowcase showcase={showcases[0]} visual={<LyricPreview />} />
      </Section>

      <Section>
        <FeatureShowcase showcase={showcases[1]} reverse visual={<ScreenshotSwitcher />} />
      </Section>

      {/* ---------------------------------------------------------- features */}
      <Section id="features">
        <Column fillWidth maxWidth="m">
          <SectionEyebrow index="03">Everything it does</SectionEyebrow>
          <SectionHeading>Features</SectionHeading>
          <SectionLead>
            On desktop it&apos;s a TidaLuna plugin. On Android it&apos;s a set of optional patches
            applied by a Manager app.
          </SectionLead>
        </Column>

        <Row fillWidth horizontal="center" marginTop="40">
          {platformSwitch}
        </Row>

        <Flex fillWidth marginTop="32">
          <RevealFx fillWidth key={platform} speed={SWAP_SPEED} translateY={SWAP_LIFT}>
            <MobileCollapse
              title={isDesktop ? "Desktop features" : "Android features"}
              count={features.length}
            >
              <FeatureGrid features={features} />
            </MobileCollapse>
          </RevealFx>
        </Flex>
      </Section>

      {/* ----------------------------------------------------------- install */}
      <Section id="install">
        <Column fillWidth maxWidth="m">
          <SectionEyebrow index="04">Getting it running</SectionEyebrow>
          <RevealFx key={`heading-${platform}`} speed={SWAP_SPEED} translateY={SWAP_LIFT}>
            <SectionHeading>
              {isDesktop ? "Install on desktop." : "Install on Android."}
            </SectionHeading>
          </RevealFx>
        </Column>

        <Row fillWidth horizontal="center" marginTop="40">
          {platformSwitch}
        </Row>

        <Row
          fillWidth
          gap="24"
          marginTop="32"
          vertical="start"
          m={{ direction: "column" }}
          s={{ direction: "column" }}
        >
          <Flex flex={6}>
            <RevealFx fillWidth key={`steps-${platform}`} speed={SWAP_SPEED} translateY={SWAP_LIFT}>
              <MobileCollapse title="Install steps" count={steps.length}>
                <StepList steps={steps} />
              </MobileCollapse>
            </RevealFx>
          </Flex>
          <Flex flex={4}>
            <RevealFx fillWidth key={`links-${platform}`} speed={SWAP_SPEED} translateY={SWAP_LIFT}>
              <Column fillWidth gap="16">
                <Card
                  className="static-card"
                  fillWidth
                  direction="column"
                  padding="24"
                  gap="16"
                  radius="l"
                  background="surface"
                  border="neutral-alpha-weak"
                >
                  <Text variant="label-strong-m">
                    {isDesktop ? "Desktop links" : "Android links"}
                  </Text>
                  <Column fillWidth gap="8">
                    {isDesktop ? (
                      <>
                        <Button
                          fillWidth
                          href={links.tidaluna}
                          variant="secondary"
                          data-border="rounded"
                          weight="default"
                          prefixIcon="rocket"
                          arrowIcon
                        >
                          TidaLuna framework
                        </Button>
                        <Button
                          fillWidth
                          href={links.desktopRepo}
                          variant="secondary"
                          data-border="rounded"
                          weight="default"
                          prefixIcon="github"
                          arrowIcon
                        >
                          Plugin repository
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          fillWidth
                          href={links.mobileReleases}
                          variant="secondary"
                          data-border="rounded"
                          weight="default"
                          prefixIcon="download"
                          arrowIcon
                        >
                          Download rl-manager.apk
                        </Button>
                        <Button
                          fillWidth
                          href={links.mobileRepo}
                          variant="secondary"
                          data-border="rounded"
                          weight="default"
                          prefixIcon="github"
                          arrowIcon
                        >
                          rl-mobile repository
                        </Button>
                      </>
                    )}
                  </Column>
                </Card>

                <Card
                  className="static-card"
                  // this one isn't on surface, so point the hover override at its own token
                  style={{ "--static-card-bg": "var(--neutral-alpha-weak)" } as CSSProperties}
                  fillWidth
                  direction="column"
                  padding="24"
                  gap="12"
                  radius="l"
                  background="neutral-alpha-weak"
                  border="neutral-alpha-weak"
                >
                  <Row gap="8" vertical="center">
                    <Icon
                      name={isDesktop ? "code" : "warning"}
                      size="xs"
                      onBackground="neutral-weak"
                    />
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {isDesktop ? "Install from URL" : "Batteries required"}
                    </Text>
                  </Row>
                  {isDesktop ? (
                    <Text
                      variant="code-default-xs"
                      onBackground="neutral-medium"
                      style={{ wordBreak: "break-all" }}
                    >
                      {links.store}
                    </Text>
                  ) : (
                    <Column gap="4">
                      <Text variant="code-default-s" onBackground="neutral-weak">
                        {"// Android 7.0+ and >340 DPI"}
                      </Text>
                      <Text variant="code-default-s" onBackground="neutral-weak">
                        {"// a paid TIDAL account"}
                      </Text>
                      <Text variant="code-default-s" onBackground="neutral-weak">
                        {"// the smallest amount of brain damage"}
                      </Text>
                    </Column>
                  )}
                </Card>
              </Column>
            </RevealFx>
          </Flex>
        </Row>
      </Section>
    </>
  );
}
