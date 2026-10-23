import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { KawarpBackdrop } from "@/components/KawarpBackdrop";
import { Providers } from "@/components/Providers";
import { SeasonalEffects } from "@/components/SeasonalEffects";
import { baseURL, dataStyle, fonts, homeMeta, style } from "@/resources";
import { berkeleyMono } from "@/resources/berkeley-mono";
import { Column, Flex, Meta, Schema } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: homeMeta.home.title,
    description: homeMeta.home.description,
    baseURL: baseURL,
    path: homeMeta.home.path,
    canonical: homeMeta.home.canonical,
    image: homeMeta.home.image,
    robots: homeMeta.home.robots,
    alternates: homeMeta.home.alternates,
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="en"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
        berkeleyMono.variable,
      )}
    >
      <head>
        <script
          id="theme-init"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline bootstrap, no user input
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const root = document.documentElement;
                const config = ${JSON.stringify({
                  theme: style.theme,
                  brand: style.brand,
                  accent: style.accent,
                  neutral: style.neutral,
                  solid: style.solid,
                  "solid-style": style.solidStyle,
                  border: style.border,
                  surface: style.surface,
                  transition: style.transition,
                  scaling: style.scaling,
                  "viz-style": dataStyle.variant,
                })};
                Object.entries(config).forEach(([key, value]) => {
                  root.setAttribute('data-' + key, value);
                });
                // Other style keys still honour localStorage, but theme is pinned —
                // skipping it here is what stops a previously saved 'light' from
                // coming back after the toggle was disabled.
                Object.keys(config).forEach(key => {
                  if (key === 'theme') return;
                  const value = localStorage.getItem('data-' + key);
                  if (value) {
                    root.setAttribute('data-' + key, value);
                  }
                });
                root.setAttribute('data-theme', 'dark');
              } catch (e) {
                console.error('Failed to initialize theme:', e);
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();
          `,
          }}
        />
        {/* JSON-LD has to live in <head>: a <script> directly under <html> breaks hydration */}
        <Schema
          as="webPage"
          baseURL={baseURL}
          title={homeMeta.home.title}
          description={homeMeta.home.description}
          path={homeMeta.home.path}
        />
      </head>
      <Providers>
        <Column as="body" background="page" fillWidth margin="0" padding="0" position="relative">
          <KawarpBackdrop />
          <SeasonalEffects />
          <Header />
          <Column as="main" fillWidth horizontal="center" position="relative">
            {children}
          </Column>
          <Footer />
        </Column>
      </Providers>
    </Flex>
  );
}
