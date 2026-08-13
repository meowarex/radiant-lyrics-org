/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  /*
   * Appwrite Sites' build container kills the type check (exit 137 = OOM).
   * `tsc` holds the whole program graph in memory and is by far the biggest
   * spike in the build, so it runs locally and in CI instead — `pnpm typecheck`
   * before you push. This skips the check, it does not weaken the types.
   */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
