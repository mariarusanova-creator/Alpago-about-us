"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const VERSIONS = [
  { label: "Version 1", href: "/the-alpago", value: "1" },
  { label: "Version 2", href: "/the-alpago?version=2", value: "2" },
  { label: "Version 3", href: "/the-alpago?version=3", value: "3" },
] as const;

export default function TheAlpagoVersionSwitcher() {
  const searchParams = useSearchParams();
  const requestedVersion = searchParams.get("version");
  const activeVersion = requestedVersion === "2" || requestedVersion === "3" ? requestedVersion : "1";

  return (
    <nav
      aria-label="The Alpago page version"
      className="fixed bottom-5 left-1/2 z-[95] flex -translate-x-1/2 items-center rounded-full p-1 backdrop-blur-md md:bottom-7"
      style={{
        border: "1px solid rgba(241, 234, 223, 0.42)",
        background: "rgba(10, 8, 6, 0.88)",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.34)",
      }}
    >
      {VERSIONS.map((version) => {
        const active = activeVersion === version.value;
        return (
          <Link
            key={version.value}
            href={version.href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className="caption whitespace-nowrap rounded-full px-4 py-2 transition-colors duration-300 md:px-5"
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.16em",
              background: active ? "#f1eadf" : "transparent",
              color: active ? "#1c150e" : "rgba(241, 234, 223, 0.78)",
            }}
          >
            {version.label}
          </Link>
        );
      })}
    </nav>
  );
}
