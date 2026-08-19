"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import EnquiryDrawer from "@/components/sections/EnquiryDrawer";

const OFFICES: [string, string][] = [
  ["Head Office", "Boulevard Plaza Tower, Downtown Dubai"],
  ["Technical Office", "Golden Mile, Palm Jumeirah, Dubai"],
  ["Manufacturing Unit", "Dubai Investment Park 02, Dubai"],
  ["Turkey Office", "Vadistanbul / Sarıyer, Istanbul"],
];

export default function StandaloneFooter() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const enquiryTrigger = useRef<HTMLButtonElement>(null);

  const closeEnquiry = () => {
    setEnquiryOpen(false);
    requestAnimationFrame(() => enquiryTrigger.current?.focus());
  };

  return (
    <footer id="contact" className="relative px-6 pb-10 pt-[14vh] md:px-14">
      <div className="w-full">
        <div className="mx-auto flex w-full max-w-[620px] flex-col items-center pb-[11vh]">
          <Reveal className="w-full">
            <div className="flex flex-col items-center gap-9 text-center">
              <p
                className="display m-0"
                style={{
                  fontSize: "clamp(1.4rem, 2.6vw, 34px)",
                  lineHeight: 1.25,
                  color: "var(--ink)",
                  maxWidth: "22ch",
                }}
              >
                Explore the properties where quality speaks for itself
              </p>
              <button
                ref={enquiryTrigger}
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="alpago-dark-button caption inline-block cursor-pointer px-10 py-4 outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]"
                style={{ letterSpacing: "0.14em" }}
              >
                Make an enquiry
              </button>
            </div>
          </Reveal>
        </div>

        <div className="border-t pt-12" style={{ borderColor: "var(--line)" }}>
          <div
            className="display"
            style={{ fontSize: "clamp(1.8rem, 2.6vw, 40px)", letterSpacing: "0.06em" }}
          >
            Alpago
          </div>
        </div>

        <div
          className="mt-14 grid grid-cols-1 gap-12 border-t pb-4 pt-14 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderColor: "var(--line)" }}
        >
          {OFFICES.map(([label, address]) => (
            <div key={label}>
              <div className="display mb-4" style={{ fontSize: "23px", color: "var(--ink)" }}>
                {label}
              </div>
              <div className="text-[15.5px] leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {address}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-14 flex items-center justify-between border-t pt-8 text-[12px] tracking-[0.1em]"
          style={{ borderColor: "var(--line)", color: "var(--ink-faint)" }}
        >
          <span>© Alpago {new Date().getFullYear()}. All Rights Reserved.</span>
          <span>
            Made with <span style={{ color: "var(--bronze-hi)" }}>♥</span> by tentwenty
          </span>
        </div>
      </div>

      <EnquiryDrawer open={enquiryOpen} onClose={closeEnquiry} />
    </footer>
  );
}
