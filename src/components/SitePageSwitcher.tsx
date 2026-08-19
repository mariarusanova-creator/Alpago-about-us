"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PAGES = [
  { label: "All Pages", href: "/" },
  { label: "404 Page", href: "/404" },
  { label: "Thank You Page", href: "/thank-you" },
] as const;

export default function SitePageSwitcher() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<"all" | "404" | "thank-you">(
    pathname === "/404" ? "404" : pathname === "/thank-you" ? "thank-you" : "all"
  );

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("alpago-page-switcher-collapsed") === "true");
  }, []);

  useEffect(() => {
    if (pathname === "/thank-you") setActivePage("thank-you");
    else if (pathname === "/404" || document.querySelector("[data-not-found-page]")) setActivePage("404");
    else setActivePage("all");
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("alpago-page-switcher-collapsed", String(next));
      return next;
    });
  };

  return (
    <nav
      aria-label="Website page preview"
      className={`ease-alpago fixed bottom-5 z-[95] flex items-center rounded-full p-1 backdrop-blur-md transition-[left] duration-500 md:bottom-7 ${collapsed ? "left-[72px]" : "left-5 md:left-7"}`}
      style={{
        border: "1px solid rgba(241, 234, 223, 0.42)",
        background: "rgba(10, 8, 6, 0.88)",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.34)",
      }}
    >
      <div
        className={`ease-alpago flex overflow-hidden transition-[max-width,opacity] duration-500 ${collapsed ? "pointer-events-none max-w-0 opacity-0" : "max-w-[460px] opacity-100"}`}
        aria-hidden={collapsed}
      >
        {PAGES.map((page) => {
          const active =
            page.href === "/404"
              ? activePage === "404"
              : page.href === "/thank-you"
                ? activePage === "thank-you"
                : activePage === "all";
          return (
            <a
              key={page.href}
              href={page.href}
              tabIndex={collapsed ? -1 : 0}
              aria-current={active ? "page" : undefined}
              className="caption rounded-full px-4 py-2 transition-colors duration-300 md:px-5"
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.16em",
                background: active ? "#f1eadf" : "transparent",
                color: active ? "#1c150e" : "rgba(241, 234, 223, 0.78)",
              }}
            >
              {page.label}
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand page switcher" : "Collapse page switcher"}
        aria-expanded={!collapsed}
        className="ease-alpago grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[#f1eadf] outline-none transition-[background-color,transform] duration-500 hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#f1eadf]"
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12.5 4.5-5 5.5 5 5.5" />
        </svg>
      </button>
    </nav>
  );
}
