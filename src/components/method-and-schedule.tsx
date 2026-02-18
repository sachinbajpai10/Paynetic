"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Landmark, Wallet, Bitcoin, Check, Info, Globe, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrencyCombobox } from "@/components/currency-combobox";
import { CURRENCIES, getCurrencyByCode, convertCurrency, type Currency } from "@/data/currencies";
import { cn } from "@/lib/utils";

type PaymentMethodId = "bank" | "wise" | "crypto";

const METHOD_CONFIG: Record<
  PaymentMethodId,
  { transferRate: number; label: string; days: string; badge?: string }
> = {
  bank: { transferRate: 60, label: "Bank Transfer", days: "2-3 business days" },
  wise: {
    transferRate: 50.5,
    label: "Wise Transfer",
    days: "Same day Delivery",
    badge: "Best Value",
  },
  crypto: {
    transferRate: 47,
    label: "Cryptocurrency",
    days: "Instant Transfer",
  },
};

interface MethodAndScheduleProps {
  selectedMethod: PaymentMethodId;
  setSelectedMethod: (id: PaymentMethodId) => void;
  scheduleRecommendation: boolean;
  setScheduleRecommendation: (v: boolean) => void;
  /** When provided (e.g. from contractor table Pay Now), all amounts and totals use this. */
  initialSendAmount?: number;
  /** When provided (e.g. from contractor table Pay Now), sets the recipient currency automatically. */
  initialReceiveCurrency?: string;
}

function formatAmountForInput(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function MethodAndSchedule({
  selectedMethod,
  setSelectedMethod,
  scheduleRecommendation,
  setScheduleRecommendation,
  initialSendAmount,
  initialReceiveCurrency,
}: MethodAndScheduleProps) {
  const usd = getCurrencyByCode("USD")!;
  const inr = getCurrencyByCode("INR")!;

  // Determine initial receive currency: use contractor's currency if provided, otherwise default to INR
  const defaultReceiveCurrency = initialReceiveCurrency
    ? getCurrencyByCode(initialReceiveCurrency) ?? inr
    : inr;

  const defaultAmount = initialSendAmount ?? 2500;
  const [sendAmount, setSendAmount] = useState(() => formatAmountForInput(defaultAmount));
  const [sendCurrency, setSendCurrency] = useState<Currency>(usd);
  const [receiveCurrency, setReceiveCurrency] = useState<Currency>(defaultReceiveCurrency);

  // Simple scheduling flow for FX: user can pick a date and mark the payment as scheduled.
  const [isSchedulePickerOpen, setIsSchedulePickerOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [scheduleDraftDate, setScheduleDraftDate] = useState<string>("");

  useEffect(() => {
    if (initialSendAmount != null && initialSendAmount > 0) {
      setSendAmount(formatAmountForInput(initialSendAmount));
    }
  }, [initialSendAmount]);

  useEffect(() => {
    if (initialReceiveCurrency) {
      const currency = getCurrencyByCode(initialReceiveCurrency);
      if (currency) {
        setReceiveCurrency(currency);
      }
    }
  }, [initialReceiveCurrency]);

  const sendAmountNum = parseFloat(sendAmount.replace(/,/g, "")) || 0;
  const recipientGets = convertCurrency(sendAmountNum, sendCurrency.rate, receiveCurrency.rate);
  const currentBreakdown = METHOD_CONFIG[selectedMethod];
  const currentTotal = sendAmountNum + currentBreakdown.transferRate;
  const bankTotal = sendAmountNum + METHOD_CONFIG.bank.transferRate;
  const saveVsBank = Math.max(0, bankTotal - currentTotal);
  const exchangeRateLabel =
    sendCurrency.code === "USD"
      ? `1.00 USD = ${receiveCurrency.rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${receiveCurrency.code}`
      : `1 ${sendCurrency.code} = ${(receiveCurrency.rate / sendCurrency.rate).toFixed(4)} ${receiveCurrency.code}`;

  const formatRecipient = (n: number) => {
    if (n >= 1000) return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDraftDate) return;
    setScheduledDate(scheduleDraftDate);
    setIsSchedulePickerOpen(false);
    setScheduleRecommendation(true);
  };

  const formattedScheduledDate =
    scheduledDate &&
    (() => {
      try {
        const d = new Date(`${scheduledDate}T00:00:00`);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return scheduledDate;
      }
    })();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Center: Payment methods + FX + AI banner */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Payment Method</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                {
                  id: "bank" as const,
                  icon: Landmark,
                  iconBg: "bg-violet-100 text-violet-600",
                  days: "2-3 business days",
                  fees: "Fees: $0",
                },
                {
                  id: "wise" as const,
                  icon: Wallet,
                  iconBg: "bg-sky-100 text-sky-600",
                  days: "Same day Delivery",
                  badge: "Best Value",
                },
                {
                  id: "crypto" as const,
                  icon: Bitcoin,
                  iconBg: "bg-amber-100 text-amber-600",
                  days: "Instant Transfer",
                },
              ] as const
            ).map((m) => {
              const isSelected = selectedMethod === m.id;
              const Icon = m.icon;
              const methodTotal = sendAmountNum + METHOD_CONFIG[m.id].transferRate;
              const saveVsThis = m.id === "bank" ? 0 : Math.max(0, (sendAmountNum + METHOD_CONFIG.bank.transferRate) - methodTotal);
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={false}
                  animate={{ scale: isSelected ? 1.02 : 1 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  onClick={() => setSelectedMethod(m.id)}
                  className={cn(
                    "relative cursor-pointer rounded-xl border-2 bg-white p-4 shadow-sm transition-colors",
                    isSelected
                      ? "border-teal-500 ring-2 ring-teal-500/20"
                      : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  {"badge" in m && m.badge && (
                    <span className="absolute right-3 top-3 rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                      {m.badge}
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        m.iconBg
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                        isSelected ? "border-teal-500 bg-teal-500" : "border-slate-200"
                      )}
                    >
                      {isSelected && <Check className="size-3 text-white" aria-hidden />}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{m.days}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    ${methodTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  {"fees" in m && m.fees && (
                    <p className="mt-0.5 text-xs text-slate-600">{m.fees}</p>
                  )}
                  {saveVsThis > 0 && (
                    <p className="mt-0.5 text-xs font-medium text-teal-600">Save: ${saveVsThis.toFixed(2)}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <Card className="border border-slate-100 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-foreground">FX Converter</h3>
              <span
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                title="Supporting 80+ countries worldwide."
              >
                <Globe className="size-3.5 text-teal-600" aria-hidden />
                Supporting 80+ countries worldwide.
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-3 items-baseline">
              <label className="text-xs font-medium text-slate-600 whitespace-nowrap">You Send</label>
              <Input
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="bg-slate-50/50 min-w-0"
              />
              <CurrencyCombobox
                value={sendCurrency}
                onSelect={setSendCurrency}
                placeholder="Currency"
              />
              <label className="text-xs font-medium text-slate-600 whitespace-nowrap">
                Recipient Gets ({receiveCurrency.code})
              </label>
              <Input
                value={formatRecipient(recipientGets)}
                readOnly
                className="bg-slate-50/50 min-w-0"
              />
              <CurrencyCombobox
                value={receiveCurrency}
                onSelect={setReceiveCurrency}
                placeholder="Currency"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
              <span className="font-medium">{exchangeRateLabel}</span>
              <span className="font-medium">Transfer Fee: $8.50</span>
            </div>
          </CardContent>
        </Card>

        {formattedScheduledDate ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-300 bg-emerald-50/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
              <p className="text-sm font-medium text-emerald-800">
                Payment scheduled for {formattedScheduledDate} with AI smart scheduling.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 text-xs font-medium text-emerald-700 underline-offset-2 hover:underline"
              onClick={() => {
                setIsSchedulePickerOpen(true);
                setScheduleDraftDate(scheduledDate ?? "");
              }}
            >
              Change date
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Info className="size-4 shrink-0 text-teal-600" aria-hidden />
              <p className="text-sm font-medium text-teal-800">
                AI predicts FX will improve — schedule to save on this payout.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 text-sm font-medium text-teal-600 underline-offset-2 hover:underline"
              onClick={() => {
                setIsSchedulePickerOpen(true);
                setScheduleDraftDate(scheduledDate ?? "");
              }}
            >
              Schedule Payment
            </button>
          </div>
        )}

        {isSchedulePickerOpen && (
          <div className="rounded-lg border border-teal-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-teal-600" aria-hidden />
              <p className="text-sm font-medium text-foreground">
                Choose a date to schedule this payout.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="text-xs font-medium text-slate-600">
                Scheduled date
                <Input
                  type="date"
                  value={scheduleDraftDate}
                  onChange={(e) => setScheduleDraftDate(e.target.value)}
                  className="mt-1 w-48 bg-slate-50/50"
                />
              </label>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-700"
                  onClick={() => {
                    setIsSchedulePickerOpen(false);
                    setScheduleDraftDate(scheduledDate ?? "");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-teal-600 text-white hover:bg-teal-700"
                  disabled={!scheduleDraftDate}
                  onClick={handleConfirmSchedule}
                >
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Schedule and Save + Cost Breakdown */}
      <div className="space-y-4">
        <Card className="border border-slate-100 bg-sky-50/80 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground">Schedule and Save more</h3>
            <p className="mt-1 text-xs text-slate-600">
              Paynetic helps you analyze FX rates, cash flows and recommend best timing
            </p>
            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border-2 border-emerald-500 bg-white p-3">
              <input
                type="radio"
                name="schedule"
                checked={scheduleRecommendation}
                onChange={() => setScheduleRecommendation(true)}
                className="mt-0.5 size-4 border-teal-500 text-teal-600"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Scheduling for Thursday saves roughly <strong>$42.56</strong> in FX and Fees.
                </p>
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  Optimal Rate: {receiveCurrency.rate.toFixed(2)} {receiveCurrency.code} (+0.5%
                  better than today)
                </p>
              </div>
            </label>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground">Cost Breakdown</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Amount</dt>
                <dd className="font-medium text-foreground">
                  ${sendAmountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Exchange Rate</dt>
                <dd className="font-medium text-foreground">
                  {receiveCurrency.rate.toFixed(2)} {receiveCurrency.code}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Transfer Rate</dt>
                <dd className="font-medium text-foreground">
                  ${currentBreakdown.transferRate.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Network Rate</dt>
                <dd className="font-medium text-foreground">$00.00</dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="flex justify-between items-baseline">
                <dt className="text-sm font-semibold text-foreground">Total Cost</dt>
                <dd className="text-lg font-bold text-foreground">
                  $
                  {currentTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </dd>
              </div>
            </div>
            {saveVsBank > 0 && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Info className="size-3.5 shrink-0 text-teal-600" />
                Save ${saveVsBank.toFixed(2)} with Smart Scheduling
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
