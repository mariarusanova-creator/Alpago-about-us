"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

export type AlpagoSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AlpagoSelectProps = {
  ariaLabel: string;
  options: AlpagoSelectOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  invalid?: boolean;
  prefix?: string;
  className?: string;
  style?: CSSProperties;
};

export default function AlpagoSelect({
  ariaLabel,
  options,
  name,
  value,
  defaultValue,
  onValueChange,
  invalid = false,
  prefix,
  className = "",
  style,
}: AlpagoSelectProps) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const root = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options.find((option) => !option.disabled)?.value ?? "");
  const selectedValue = value ?? internalValue;
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === selectedValue));
  const firstEnabledIndex = Math.max(0, options.findIndex((option) => !option.disabled));
  const initialActiveIndex = options[selectedIndex]?.disabled ? firstEnabledIndex : selectedIndex;
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selectedOptionIndex = Math.max(0, options.findIndex((option) => option.value === selectedValue));
    const next = options[selectedOptionIndex]?.disabled ? firstEnabledIndex : selectedOptionIndex;
    setActiveIndex(next);
    requestAnimationFrame(() => optionRefs.current[next]?.focus());
  }, [firstEnabledIndex, open, options, selectedValue]);

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onValueChange?.(option.value);
    setOpen(false);
    requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>("[role='combobox']")?.focus());
  };

  const move = (direction: 1 | -1) => {
    let next = activeIndex;
    do next = (next + direction + options.length) % options.length;
    while (options[next]?.disabled && next !== activeIndex);
    setActiveIndex(next);
    optionRefs.current[next]?.focus();
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      move(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home"
        ? options.findIndex((option) => !option.disabled)
        : options.findLastIndex((option) => !option.disabled);
      setActiveIndex(next);
      optionRefs.current[next]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(index);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className={`alpago-select relative min-w-0 ${className}`} style={style}>
      {name && <input type="hidden" name={name} value={selectedValue} />}
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleButtonKeyDown}
        className="alpago-field flex h-14 w-full min-w-0 items-center border bg-transparent px-5 text-left outline-none"
        style={{ color: "var(--ink)" }}
      >
        {prefix && (
          <span className="caption mr-4 shrink-0" style={{ color: "var(--ink-faint)", letterSpacing: "0.14em" }}>
            {prefix}
          </span>
        )}
        <span className={`min-w-0 flex-1 truncate ${prefix ? "text-right" : ""}`} style={{ color: selected?.disabled ? "var(--ink-dim)" : "var(--ink)" }}>
          {selected?.label}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className={`ease-alpago ml-4 h-2 w-3 shrink-0 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          style={{ color: "var(--bronze-hi)" }}
        >
          <path d="m1 1 5 5 5-5" />
        </svg>
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="alpago-select-menu absolute inset-x-0 top-full z-[90] mt-2 max-h-72 overflow-y-auto border p-2"
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            return (
              <button
                key={`${option.value}-${index}`}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => choose(index)}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                className="alpago-select-option flex w-full items-center justify-between gap-5 px-4 py-3 text-left outline-none transition-colors duration-300 disabled:cursor-not-allowed"
              >
                <span>{option.label}</span>
                {isSelected && !option.disabled && (
                  <svg aria-hidden viewBox="0 0 16 12" className="h-3 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="m1 6 4.2 4L15 1" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
