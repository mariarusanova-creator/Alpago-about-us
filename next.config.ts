import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const createNextConfig = (phase: string): NextConfig => ({
  reactStrictMode: false,
  // three.js ESM addons (GLTFLoader, RoomEnvironment) need transpiling for the
  // production/webpack build (the 3D infinity on the Manifesto page).
  transpilePackages: ["three"],
  // Keep development and production artifacts separate. Running `next build`
  // while the local site is open must not replace the dev server's manifests.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next.dev.nosync" : ".next.nosync",
});

export default createNextConfig;
