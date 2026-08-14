/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  /*
   * Dev only: accept dev-asset/HMR requests from any host (LAN IPs, tunnels).
   * Next rejects a bare "*" — its matcher requires at least two label segments,
   * so "**.*" is the widest pattern it will honour.
   */
  ...(process.env.NODE_ENV === "development"
    ? { allowedDevOrigins: ["**.*"] }
    : {}),
  /*
   * Appwrite Sites' build container kills the type check (exit 137 = OOM).
   * `tsc` holds the whole program graph in memory and is by far the biggest
   * spike in the build, so it runs locally and in CI instead — `pnpm typecheck`
   * before you push. This skips the check, it does not weaken the types.
   */
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    /*
     * Next fans page-data collection and static generation out across one worker
     * per CPU — the log showed 5. Each is a full Node process rendering the app,
     * so on a memory-capped builder that's five heaps at once and the OOM killer
     * takes the build. There are two routes here; doing them in series costs a
     * few seconds and removes the spike.
     */
    cpus: 1,
    /* Belt and braces: scale workers to available memory, not just core count */
    memoryBasedWorkersCount: true,
  },
};

export default nextConfig;
