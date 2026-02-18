"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCIES, type Currency } from "@/data/currencies";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyComboboxProps {
  value: Currency | null;
  onSelect: (currency: Currency) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyCombobox({
  value,
  onSelect,
  placeholder = "Select currency",
  className,
  disabled,
}: CurrencyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs transition-colors",
          "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-teal-500 ring-2 ring-teal-500/20"
        )}
      >
        {value ? (
          <span className="flex items-center gap-2 truncate">
            <span className="text-base leading-none" aria-hidden>
              {value.flag}
            </span>
            <span className="font-medium">{value.code}</span>
          </span>
        ) : (
          <span className="text-slate-500">{placeholder}</span>
        )}
        <ChevronDown
          className={cn("size-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-1 w-full min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
          style={{ minWidth: containerRef.current?.offsetWidth ?? 160 }}
        >
          <div className="border-b border-slate-100 p-2">
            <Input
              placeholder="Search currency..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 border-slate-200 text-sm"
              autoFocus
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">No currency found.</p>
            ) : (
              filtered.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => {
                    onSelect(currency);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm transition-colors",
                    "hover:bg-slate-100 focus:bg-slate-100 focus:outline-none",
                    value?.code === currency.code && "bg-teal-50 text-teal-800"
                  )}
                >
                  <span className="text-base leading-none">{currency.flag}</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-slate-500 truncate">
                    {currency.name} · {currency.country}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
