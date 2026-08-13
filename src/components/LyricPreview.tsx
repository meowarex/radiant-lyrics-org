"use client";

import { Card, Column } from "@once-ui-system/core";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import styles from "./LyricPreview.module.scss";
import { Segmented } from "./Segmented";

/** Words → syllables. One dataset drives all three timing modes. */
type Tokens = string[][];

/**
 * A background vocal.
 *
 * `offsetMs` places its first token relative to the *end* of the line it belongs
 * to. Defaults to 0, so the adlib picks up the moment the lead vocal drops; push
 * it positive to leave a beat first, negative to overlap the line's tail.
 */
type Adlib = { tokens: Tokens; offsetMs?: number };

/**
 * Demo lyrics.
 *
 * `singer` and `adlib` mirror the plugin's context-aware output: duet lines are
 * assigned an agent and pushed to their side of the column, and background vocals
 * ride along on their own timing rather than the line's.
 */
type DemoLine = {
  words: Tokens;
  singer?: "left" | "right";
  adlib?: Adlib;
};

/** Agents trade off in blocks — two lines, then three, then two back. */
const lyricDemo: DemoLine[] = [
  { words: [["Been"], ["put"], ["to", "geth", "er"]], singer: "left" },
  {
    words: [["Dif", "fer", "ent", "ly"]],
    singer: "left",
    adlib: { tokens: [["(dif", "fer", "ent", "ly)"]] },
  },
  {
    words: [["And"], ["I"], ["know"], ["you"], ["said"], ["it"], ["be", "fore,"], ["you"], ["go"]],
    singer: "right",
    adlib: { tokens: [["(you"], ["go,"], ["you"], ["go)"]] },
  },
  {
    words: [["You"], ["did", "n't"], ["wan", "na"], ["steal"], ["the"], ["show"]],
    singer: "right",
  },
  {
    words: [["But"], ["here"], ["you"], ["are"], ["now"]],
    singer: "right",
    adlib: { tokens: [["(are"], ["now)"]] },
  },
  {
    words: [["Caught"], ["in"], ["the"], ["af", "ter", "glow"]],
    singer: "left",
    adlib: { tokens: [["(af", "ter", "glow)"]] },
  },
  {
    words: [["Ev", "ery"], ["word"], ["you"], ["nev", "er"], ["said"]],
    singer: "left",
  },
];

const lyricModes = [
  { value: "line", label: "Line" },
  { value: "word", label: "Word" },
  { value: "syllable", label: "Syllable" },
];

/** ms per unit — a syllable fires faster than a word, which fires faster than a line. */
const lyricTempo: Record<string, number> = { line: 2200, word: 330, syllable: 210 };
/** Line mode holds a whole line for 2.2s; an adlib echo that long would overstay. */
const adlibTempoFor = (mode: string) => (mode === "line" ? 900 : lyricTempo[mode]);
/** Breathing room between an adlib landing and the next line picking up */
const ADLIB_GAP_MS = 1000;
/** Quiet beat at the end before the loop restarts */
const LOOP_TAIL_MS = 500;

const unitsIn = (tokens: Tokens, mode: string) => {
  if (mode === "line") return 1;
  if (mode === "word") return tokens.length;
  return tokens.reduce((total, word) => total + word.length, 0);
};

const toText = (tokens: Tokens) => tokens.map((word) => word.join("")).join(" ");

/** Duet positioning only kicks in when the track actually has more than one agent */
const isDuet = lyricDemo.some((line) => line.singer === "right");

type Frame = {
  at: number;
  line: number;
  unit: number;
  adlibLine: number;
  adlibUnit: number;
  /** Last line to have finished. Holds the view steady through the gaps. */
  hold: number;
};

/**
 * Lays the whole loop out on one timeline, then reduces it to the moments where
 * something actually changes.
 *
 * Adlibs need to start and stop independently of their line — one arrives 500ms
 * early, another only after the line is over — so a per-unit interval can't drive
 * this. Playback walks these frames with a setTimeout sized to the gap, which is
 * exact and costs one render per change rather than one per frame.
 */
function buildTimeline(mode: string) {
  const tempo = lyricTempo[mode];
  const adlibTempo = adlibTempoFor(mode);

  let clock = 0;
  const lines = lyricDemo.map((line) => {
    const units = unitsIn(line.words, mode);
    const start = clock;
    const end = start + units * tempo;
    clock = end;

    if (!line.adlib) return { units, start, end, adlib: null };

    const adlibUnits = unitsIn(line.adlib.tokens, mode);
    const duration = adlibUnits * adlibTempo;
    // Default: picks up the moment the lead vocal drops
    const adlibStart = end + (line.adlib.offsetMs ?? 0);
    const adlibEnd = adlibStart + duration;
    // Hold the next line back so the echo gets a clear beat to itself
    clock = Math.max(end, adlibEnd + ADLIB_GAP_MS);

    return {
      units,
      start,
      end,
      adlib: { units: adlibUnits, start: adlibStart, end: adlibEnd, step: adlibTempo },
    };
  });

  const lastAdlibEnd = lines.reduce((max, line) => Math.max(max, line.adlib?.end ?? 0), 0);
  const total = Math.max(clock, lastAdlibEnd) + LOOP_TAIL_MS;

  const moments = new Set<number>([0]);
  for (const line of lines) {
    for (let k = 0; k < line.units; k++) moments.add(line.start + k * tempo);
    if (line.adlib) {
      for (let j = 0; j < line.adlib.units; j++) {
        moments.add(line.adlib.start + j * line.adlib.step);
      }
      moments.add(line.adlib.end);
    }
  }

  const frames: Frame[] = [...moments]
    .filter((at) => at >= 0 && at < total)
    .sort((a, b) => a - b)
    .map((at) => {
      const line = lines.findIndex((l) => at >= l.start && at < l.end);
      const adlibLine = lines.findIndex((l) => l.adlib && at >= l.adlib.start && at < l.adlib.end);
      // Between lines nothing is active, so remember what just finished — the
      // plugin's gap-hold, which keeps the last line clear instead of letting
      // the whole panel drop into the blur during the pause.
      let hold = -1;
      lines.forEach((l, i) => {
        if (at >= l.end) hold = i;
      });
      return {
        at,
        line,
        unit: line >= 0 ? Math.floor((at - lines[line].start) / tempo) : 0,
        adlibUnit:
          adlibLine >= 0
            ? Math.floor((at - lines[adlibLine].adlib!.start) / lines[adlibLine].adlib!.step)
            : 0,
        adlibLine,
        hold,
      };
    });

  return { frames, total, lines };
}

const tokenClass = (index: number, cursor: number, mode: string) => {
  // Syllable mode sweeps a gradient across the glyphs instead of flipping colour.
  // All three states keep the same base class so only the geometry changes.
  if (mode === "syllable") {
    const state =
      index < cursor ? styles.sylDone : index > cursor ? styles.sylUpcoming : styles.sylActive;
    return `${styles.syl} ${state}`;
  }
  if (index < cursor) return styles.tokenSung;
  if (index > cursor) return styles.tokenUpcoming;
  return styles.tokenCurrent;
};

/**
 * Renders a run of text, lighting tokens up to the cursor.
 *
 * Rendered for every line, not just the active one — pass `unit: -1` and nothing
 * is lit. Swapping between plain text and token spans as a line activates would
 * rebuild the DOM mid-transition, which is what made the adlibs flicker as they
 * faded in. Now only class names change.
 */
function SungText({ tokens, mode, unit }: { tokens: Tokens; mode: string; unit: number }) {
  if (mode === "line") {
    return <span className={tokenClass(0, unit, mode)}>{toText(tokens)}</span>;
  }

  let index = 0;
  return (
    <>
      {tokens.map((word, wordIndex) => {
        const key = `${word.join("")}-${wordIndex}`;
        if (mode === "word") {
          const position = index++;
          return (
            <span key={key} className={styles.word}>
              <span className={tokenClass(position, unit, mode)}>{word.join("")}</span>
            </span>
          );
        }
        return (
          <span key={key} className={styles.word}>
            {word.map((syllable, syllableIndex) => {
              const position = index++;
              return (
                <span
                  key={`${syllable}-${syllableIndex}`}
                  className={tokenClass(position, unit, mode)}
                >
                  {syllable}
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

/**
 * Mock lyric panel showing the glow, the distance-based blur falloff, the duet
 * and adlib treatment, and how line / word / syllable timing actually differ.
 */
export function LyricPreview() {
  const [mode, setMode] = useState("syllable");
  const timeline = useMemo(() => buildTimeline(mode), [mode]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [timeline]);

  useEffect(() => {
    const { frames, total } = timeline;
    const current = frames[frameIndex] ?? frames[0];
    const nextIndex = (frameIndex + 1) % frames.length;
    // Wrapping back to the top has to cover the tail as well as the gap
    const delay = nextIndex === 0 ? total - current.at : frames[nextIndex].at - current.at;
    const id = setTimeout(() => setFrameIndex(nextIndex), Math.max(16, delay));
    return () => clearTimeout(id);
  }, [frameIndex, timeline]);

  const frame = timeline.frames[frameIndex] ?? timeline.frames[0];

  return (
    <Column fillWidth fillHeight className={styles.shell}>
      <Card
        className={`${styles.card} static-card`}
        fillWidth
        fillHeight
        direction="column"
        padding="0"
        radius="xl"
        background="surface"
        border="neutral-alpha-weak"
        shadow="xl"
      >
        {/* Straddles the card's top border, half above it and half below */}
        <div className={styles.controlDock}>
          <Segmented selected={mode} buttons={lyricModes} onToggle={setMode} />
        </div>

        <Column
          fillWidth
          fillHeight
          padding="32"
          s={{ padding: "20" }}
          vertical="center"
          className={`${styles.lyricStage} ${isDuet ? styles.stageDuet : ""}`}
          // Sweep finishes exactly as the token hands over to the next one
          style={{ "--syllable-duration": `${lyricTempo[mode]}ms` } as CSSProperties}
        >
          {lyricDemo.map((line, index) => {
            const isActive = frame.line === index;
            const adlibOn = frame.adlibLine === index;
            // A line whose adlib is still echoing — or which is simply the last
            // one sung during the gap before the next — stays lit rather than
            // dropping into the blur
            const isHold = frame.line < 0 && frame.hold === index;
            const isTrailing = (adlibOn && !isActive) || isHold;

            // Falls back to the held line so distance stays meaningful in a gap
            const reference = frame.line >= 0 ? frame.line : frame.hold;
            const distance = reference >= 0 ? Math.abs(index - reference) : 99;
            const state = isActive
              ? styles.lyricActive
              : isTrailing
                ? styles.lyricTrailing
                : distance === 1
                  ? styles.lyricInactive
                  : styles.lyricFar;
            const singer = line.singer === "right" ? styles.singerRight : styles.singerLeft;
            // Stays forward through its adlib, then slides back — but only once
            // the echo is done, not the moment the lead vocal stops
            const posHeld = isActive || adlibOn ? styles.posHeld : "";

            /*
             * Syllable mode is sticky: the plugin marks each syllable
             * `.rl-syl-finished` as it passes and never clears it, so every line
             * already sung stays lit — only the blur falloff separates them from
             * the current one. Line and word mode drop back to unsung instead.
             */
            const alreadySung = reference >= 0 && index <= reference && !isActive;
            const mainUnit = isActive
              ? frame.unit
              : mode === "syllable" && alreadySung
                ? timeline.lines[index].units
                : -1;
            const adlibStep = timeline.lines[index].adlib?.step ?? lyricTempo[mode];
            const adlibUnits = timeline.lines[index].adlib?.units ?? 0;
            // Stays on screen past its own sweep, until the next line takes over.
            // Tokens hold their finished state, so it settles rather than snapping
            // back to unsung — and in syllable mode it stays fully lit like the
            // lines do, rather than dimming once the sweep is over.
            const adlibShown = adlibOn || isHold;
            const adlibUnit = adlibOn ? frame.adlibUnit : adlibShown ? adlibUnits : -1;
            const adlibState = !adlibShown
              ? ""
              : adlibOn || mode === "syllable"
                ? styles.adlibVisible
                : styles.adlibSpent;

            return (
              <div
                key={toText(line.words)}
                className={`${styles.lyricLine} ${state} ${singer} ${posHeld}`}
              >
                <div className={styles.lineMain}>
                  <SungText tokens={line.words} mode={mode} unit={mainUnit} />
                </div>
                {line.adlib ? (
                  <div
                    className={`${styles.adlib} ${adlibState}`}
                    style={{ "--syllable-duration": `${adlibStep}ms` } as CSSProperties}
                  >
                    <SungText tokens={line.adlib.tokens} mode={mode} unit={adlibUnit} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </Column>
      </Card>
    </Column>
  );
}
