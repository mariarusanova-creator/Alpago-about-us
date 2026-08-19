"use client";

import Usps from "./Usps";
import UspsDepth from "./UspsDepth";
import UspsPanorama from "./UspsPanorama";
import UspsFacade from "./UspsFacade";

/**
 * USPs treatments — the variant is chosen on the SERVER (page.tsx reads ?usps=…)
 * and switching — via the ReviewPanel — performs a full page load. Never swap
 * client-side after load (see ConvictionSwitch notes).
 *   default        → panorama (client-team design: image melts into the page,
 *                    right text block, the shared animated trail, measuring ruler)
 *   ?usps=facade   → Framed Allure facade holds; gold arcs draw; claims cycle
 *   ?usps=depth    → Three.js depth gallery (the previous design)
 *   ?usps=blocks   → pinned full-image + sliding text blocks (URL-only)
 */
export type UspsVariant = "panorama" | "facade" | "depth" | "blocks";

export default function UspsSwitch({ variant = "panorama" }: { variant?: UspsVariant }) {
  if (variant === "facade") return <UspsFacade />;
  if (variant === "depth") return <UspsDepth />;
  if (variant === "blocks") return <Usps />;
  return <UspsPanorama />;
}
