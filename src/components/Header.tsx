"use client";

import { Flex, Line, ToggleButton } from "@once-ui-system/core";
import { useEffect, useState } from "react";

import { navLinks, site } from "@/resources";
import styles from "./Header.module.scss";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      // Back in the hero: hand selection to the logo rather than leaving the
      // observer's last section stuck on
      if (window.scrollY < 240) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy, so the pill reflects where you actually are on the page
  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      // Bias toward the middle of the viewport rather than the very top
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <Flex
      as="header"
      className={styles.header}
      fillWidth
      horizontal="center"
      padding="8"
      paddingTop="16"
    >
      <Flex
        className={`${styles.pill} ${scrolled ? styles.pillScrolled : ""}`}
        padding="4"
        horizontal="center"
      >
        <Flex gap="4" vertical="center" textVariant="body-default-s">
          {/* Back to the parent site, so it never takes the selected state */}
          <ToggleButton
            prefixIcon="atomix"
            href={site.parent.href}
            selected={false}
            aria-label={`Go to ${site.parent.label}`}
          />
          {/*
            Shrink the Feature Pill (mobile friendly)
          */}
          <Line
            background="neutral-alpha-medium"
            vert
            maxHeight="24"
            className={`${styles.divider} ${scrolled ? styles.dividerVisible : ""} s-flex-hide`}
          />
          <Flex gap="4" vertical="center" className="s-flex-hide">
            {navLinks.map((link) => (
              <ToggleButton
                key={link.href}
                href={link.href}
                label={link.label}
                selected={active === link.href.replace("#", "")}
              />
            ))}
          </Flex>
          <Line
            background="neutral-alpha-medium"
            vert
            maxHeight="24"
            className={`${styles.divider} ${scrolled ? styles.dividerVisible : ""}`}
          />
          <ThemeToggle />
        </Flex>
      </Flex>
    </Flex>
  );
};
