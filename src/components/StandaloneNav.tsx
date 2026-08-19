export default function StandaloneNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[80]">
      <div className="relative flex w-full items-center justify-between px-6 py-9 md:px-14">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="cursor-default transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-fedra), system-ui",
            fontSize: "15px",
            color: "var(--ink)",
          }}
        >
          العربية
        </button>

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Alpago Properties"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/alpago-logo.svg"
            alt="Alpago"
            className="h-7 w-auto md:h-9"
            style={{ opacity: 0.95 }}
          />
        </div>

        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Menu unavailable in this standalone presentation"
          className="flex cursor-default items-center gap-3 text-[12px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
          style={{ color: "var(--ink)" }}
        >
          <span className="hidden sm:inline">Menu</span>
          <span className="flex h-4 w-6 flex-col justify-between">
            <span className="block h-px w-full" style={{ background: "currentColor" }} />
            <span className="block h-px w-full" style={{ background: "currentColor" }} />
            <span className="block h-px w-full" style={{ background: "currentColor" }} />
          </span>
        </button>
      </div>
    </header>
  );
}
