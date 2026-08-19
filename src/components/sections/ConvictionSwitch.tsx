"use client";

import ExpandingType from "./ExpandingType";
import ExpandingTypeAlt from "./ExpandingTypeAlt";

/**
 * Conviction ("Markets evolve…") reveal treatments:
 *   shape → the Vector 2440 silhouette scales up in place from the centre (default)
 *   wipe  → the film reveals bottom-to-top behind a soft, feathered mask edge
 *
 * The variant is chosen on the SERVER (page.tsx reads ?conviction=…) and switching —
 * via the ReviewPanel — performs a full page load. Never turn this back into a
 * client-side swap: mounting one variant and replacing it after hydration rebuilds
 * the pinned sections mid-flight, and their ScrollTriggers end up ghosting.
 */
export type ConvictionVariant = "shape" | "wipe";

export default function ConvictionSwitch({ variant }: { variant: ConvictionVariant }) {
  return variant === "wipe" ? <ExpandingTypeAlt /> : <ExpandingType />;
}
