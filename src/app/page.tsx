"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  urgentPayments,
  contractorLedger,
  fxInsight,
} from "@/data/mockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContractorLedgerTable } from "@/components/contractor-ledger-table";
import { AlertCircle, HelpCircle, DollarSign, Clock, FileSearch, CheckCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const METRIC_CARD_CONFIG = [
  {
    label: "Total Spending",
    value: "$ 24,000",
    sublabel: "This month",
    icon: DollarSign,
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    label: "Payments Pending",
    value: 12,
    sublabel: undefined,
    icon: Clock,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    label: "Payment Review",
    value: 1,
    sublabel: undefined,
    icon: FileSearch,
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  },
  {
    label: "Payments Completed",
    value: 24,
    sublabel: undefined,
    icon: CheckCircle,
    iconBg: "bg-teal-100 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400",
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function UrgentStatusBadge({ status }: { status: "Overdue" | "Upcoming" }) {
  const label = status === "Overdue" ? "Payments Overdue" : "Payments Upcoming";
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        status === "Overdue"
          ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
      )}
    >
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const [urgentSelected, setUrgentSelected] = useState<Set<string>>(new Set());
  const [urgentModalOpen, setUrgentModalOpen] = useState(false);
  const [urgentPayoutSuccess, setUrgentPayoutSuccess] = useState(false);

  const urgentSelectedPayments = useMemo(
    () => urgentPayments.filter((p) => urgentSelected.has(p.id)),
    [urgentSelected]
  );
  const urgentSelectedTotal = useMemo(
    () => urgentSelectedPayments.reduce((sum, p) => sum + p.amount, 0),
    [urgentSelectedPayments]
  );
  const urgentSomeSelected = urgentSelected.size > 0;

  const toggleUrgentOne = (id: string, checked: boolean) => {
    const next = new Set(urgentSelected);
    if (checked) next.add(id);
    else next.delete(id);
    setUrgentSelected(next);
  };
  const clearUrgentSelection = () => setUrgentSelected(new Set());
  const openUrgentBulkModal = () => setUrgentModalOpen(true);
  const executeUrgentPayout = () => {
    setUrgentPayoutSuccess(true);
    setTimeout(() => {
      setUrgentPayoutSuccess(false);
      setUrgentModalOpen(false);
      setUrgentSelected(new Set());
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-12"
        >
          {/* Left column: Handle Urgent Payments First - stretches to align with right */}
          <div className="flex flex-col lg:col-span-5 xl:col-span-4 lg:min-h-0">
            <motion.section variants={item} className="flex flex-col min-h-0 h-full">
              <Card className="border border-slate-100 bg-white shadow-sm rounded-xl flex flex-col min-h-[420px] h-full">
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                  <div className="flex items-start gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                      <AlertCircle className="size-4 shrink-0" aria-hidden />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        Handle Urgent Payments First
                      </CardTitle>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        We suggest handling payments first which are overdue.
                      </p>
                    </div>
                  </div>
                  <CardAction className="mt-0 shrink-0">
                    <Link
                      href="#"
                      className="inline-flex items-center rounded-md px-2 py-1.5 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 hover:text-teal-700 hover:underline dark:text-teal-500 dark:hover:bg-teal-950/30 dark:hover:text-teal-400 whitespace-nowrap"
                    >
                      View All
                    </Link>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 space-y-3 px-6 pb-6 min-h-0">
                  {urgentPayments.map((p) => {
                    const shortDate = p.dueDate.split(",")[0]?.trim() ?? p.dueDate;
                    const initials = p.contractorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <div
                        key={p.id}
                        data-state={urgentSelected.has(p.id) ? "selected" : undefined}
                        className={cn(
                          "grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 rounded-lg border border-slate-100 bg-white p-4 shadow-sm",
                          "min-h-[72px]"
                        )}
                      >
                        <div className="flex shrink-0 items-center">
                          <Checkbox
                            checked={urgentSelected.has(p.id)}
                            onCheckedChange={(c) => toggleUrgentOne(p.id, c === true)}
                            aria-label={`Select ${p.contractorName}`}
                          />
                        </div>
                        <Avatar className="size-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                          <AvatarImage
                            src={p.contractorImage}
                            alt={p.contractorName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-medium leading-tight text-foreground">
                            {p.contractorName}
                          </p>
                          <p className="text-xs leading-tight text-slate-600 dark:text-slate-400">
                            {shortDate} · {p.currency} {p.amount.toLocaleString()}
                          </p>
                          <UrgentStatusBadge status={p.status} />
                        </div>
                        <div className="flex shrink-0 items-center justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 min-w-[72px] rounded-lg shrink-0">
                            Review
                          </Button>
                          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "tween", duration: 0.15 }}>
                            <Button size="sm" className="h-8 min-w-[80px] shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                              <Link href={`/payments?contractorId=${encodeURIComponent(p.id)}`}>
                                Pay Now
                              </Link>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* Right column: Metric cards (2x2), FX card, then table */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            {/* Metric cards - 2x2 grid */}
            <motion.section
              variants={item}
              className="grid grid-cols-2 gap-4 xl:grid-cols-4"
            >
              {METRIC_CARD_CONFIG.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "tween", duration: 0.15 }}
                    className="h-full"
                  >
                    <Card className="border border-slate-100 bg-white shadow-sm rounded-xl h-full min-h-[120px] overflow-hidden">
                      <CardContent className="flex h-full min-h-[120px] flex-col justify-center px-5 py-5">
                        <div className="flex items-center gap-3 min-h-[2.5rem]">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                            <div className={cn("flex size-8 items-center justify-center rounded-lg", m.iconBg)}>
                              <Icon className="size-4" aria-hidden />
                            </div>
                          </div>
                          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground leading-none inline-flex items-baseline gap-0.5">
                            {typeof m.value === "number" ? (
                              m.value.toLocaleString()
                            ) : (
                              <>
                                <span>$</span>
                                <span>{m.value.replace("$ ", "").replace("$", "")}</span>
                              </>
                            )}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {m.label}
                        </p>
                        {m.sublabel ? (
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
                            {m.sublabel}
                          </p>
                        ) : (
                          <div className="mt-0.5 min-h-[1.25rem]" aria-hidden />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.section>

            {/* Smart FX Insights - middle right, outline Schedule Now */}
            <motion.section variants={item}>
              <Card className="border border-slate-100 bg-white shadow-sm rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                      <HelpCircle className="size-4" aria-hidden />
                    </div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {fxInsight.title}
                    </CardTitle>
                  </div>
                  <CardAction>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-emerald-500 bg-white text-foreground hover:bg-emerald-50 hover:border-emerald-600 dark:border-emerald-600 dark:bg-transparent dark:hover:bg-emerald-950/30"
                      asChild
                    >
                      <Link href="/payments?step=2&schedule=1">
                        {fxInsight.ctaLabel}
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
              </Card>
            </motion.section>

            {/* Contractor Ledger */}
            <motion.section variants={item}>
              <ContractorLedgerTable rows={contractorLedger} />
            </motion.section>
          </div>
        </motion.div>

        {/* Urgent Payments – Bulk Action bar */}
        <AnimatePresence>
          {urgentSomeSelected && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
            >
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-semibold text-foreground">{urgentSelected.size} Payment{urgentSelected.size !== 1 ? "s" : ""} Selected</span>
                  {" · "}
                  Total: ${urgentSelectedTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-slate-200" onClick={clearUrgentSelection}>
                    Clear Selection
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openUrgentBulkModal}>
                    Smart Review & Pay All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Urgent Payments – Bulk Summary modal */}
        <AnimatePresence>
          {urgentModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
                onClick={() => !urgentPayoutSuccess && setUrgentModalOpen(false)}
                aria-hidden
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="urgent-bulk-title"
                onClick={(e) => e.stopPropagation()}
              >
                {urgentPayoutSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                      className="mx-auto flex size-16 items-center justify-center rounded-full bg-teal-500 text-white"
                    >
                      <Check className="size-8" strokeWidth={2.5} aria-hidden />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">All payments sent successfully</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {urgentSelectedPayments.length} payment{urgentSelectedPayments.length !== 1 ? "s" : ""} completed.
                    </p>
                  </motion.div>
                ) : (
                  <Card className="border border-slate-200 bg-white shadow-xl">
                    <CardHeader>
                      <CardTitle id="urgent-bulk-title" className="text-lg">
                        Bulk Payout Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <dl className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Total Payments</dt>
                          <dd className="font-medium text-foreground">{urgentSelectedPayments.length}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Total Amount</dt>
                          <dd className="font-medium text-foreground">
                            ${urgentSelectedTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </dd>
                        </div>
                      </dl>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1 border-slate-200" onClick={() => setUrgentModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={executeUrgentPayout}>
                          Execute Global Payout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
