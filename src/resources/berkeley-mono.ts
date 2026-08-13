import localFont from "next/font/local";

// Place your purchased TTF at: public/fonts/BerkeleyMono-Regular.ttf
// Add other weights/styles below if you have them.
//
// The same file is declared twice, because next/font/local needs its options
// written as literals — it can't take a shared `src` variable. Next dedupes the
// underlying file, so this is one download, two CSS variables.

/** Explicit handle, for anywhere that wants Berkeley Mono regardless of variant. */
export const berkeleyMono = localFont({
  src: [
    {
      path: "../../public/fonts/BerkeleyMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-berkeley-mono",
  display: "swap",
});

/** Drives every `code-*` text variant. */
export const berkeleyMonoCode = localFont({
  src: [
    {
      path: "../../public/fonts/BerkeleyMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-code",
  display: "swap",
});
