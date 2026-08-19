"use client";

import { useEffect, useState } from "react";
import BillionairesRow from "./BillionairesRow";
import BillionairesRowAlt from "./BillionairesRowAlt";

/**
 * A/B switch for the last section:
 *   /          → full-width soft straight-edge reveal (default; was the rising sun
 *                until client feedback asked for a plain full-section overlap)
 *   /?row=alt  → scale-down + travel-left + right text + mask-in version
 */
export default function RowSwitch() {
  const [mode, setMode] = useState<"default" | "alt">("default");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("row") === "alt") {
      setMode("alt");
    }
  }, []);

  return mode === "alt" ? <BillionairesRowAlt /> : <BillionairesRow />;
}
