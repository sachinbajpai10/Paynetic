"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import type { ContractorLedgerRow, PaymentStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "In Review", label: "In Review" },
  { value: "Completed", label: "Completed" },
  { value: "Overdue", label: "Overdue" },
  { value: "Upcoming", label: "Upcoming" },
];

function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    Overdue: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
    Upcoming: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    Pending: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    "In Review": "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
    Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap sm:text-xs",
        styles[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}

interface ContractorLedgerTableProps {
  rows: ContractorLedgerRow[];
}

export function ContractorLedgerTable({ rows }: ContractorLedgerTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRows = useMemo(() => {
    let result = rows;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (r) =>
          r.contractorName.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.currency.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }
    return result;
  }, [rows, search, statusFilter]);

  const toggleAll = (checked: boolean) => {
    if (checked) setSelected(new Set(filteredRows.map((r) => r.id)));
    else setSelected(new Set());
  };

  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const allSelected = filteredRows.length > 0 && selected.size === filteredRows.length;
  const someSelected = selected.size > 0;

  const selectedRows = useMemo(
    () => filteredRows.filter((r) => selected.has(r.id)),
    [filteredRows, selected]
  );
  const selectedTotal = useMemo(
    () => selectedRows.reduce((sum, r) => sum + r.amount, 0),
    [selectedRows]
  );
  const selectedWithAnomaly = useMemo(
    () => selectedRows.filter((r) => r.anomaly),
    [selectedRows]
  );
  const verifiedCount = selectedRows.length - selectedWithAnomaly.length;

  const [modalOpen, setModalOpen] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const handleSmartReviewPayAll = () => setModalOpen(true);
  const handleClearSelection = () => setSelected(new Set());
  const handleExecuteGlobalPayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setModalOpen(false);
      setSelected(new Set());
    }, 2500);
  };

  return (
    <Card className="border border-slate-100 bg-white shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          Select Contracts to Pay
        </CardTitle>
        <CardAction className="mt-0 shrink-0">
          <Link
            href="#"
            className="inline-flex items-center rounded-md px-2 py-1.5 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 hover:text-teal-700 hover:underline dark:text-teal-500 dark:hover:bg-teal-950/30 dark:hover:text-teal-400 whitespace-nowrap"
          >
            View All
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pb-6">
        {/* Search + Filter row */}
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              type="search"
              placeholder="Search contractors, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700",
                "placeholder:text-slate-500 outline-none transition-colors",
                "focus:border-primary focus:ring-2 focus:ring-primary/20"
              )}
              aria-label="Search contracts"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] border-slate-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table: fixed layout so all columns fit viewport width, no horizontal scroll */}
        <div className="mt-4 overflow-y-visible rounded-lg border border-slate-100">
          <Table className="w-full table-fixed border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-[2.5%] px-2 py-2 sm:px-3" aria-label="Select all rows">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(c) => toggleAll(c === true)}
                    aria-label="Select all contracts"
                  />
                </TableHead>
                <TableHead className="w-[15%] px-2 py-2 sm:px-3">Contractor</TableHead>
                <TableHead className="hidden w-[12%] px-3 py-2 md:table-cell sm:px-4">Invoice Date</TableHead>
                <TableHead className="w-[12%] px-3 py-2 sm:px-4">Amount</TableHead>
                <TableHead className="hidden w-[11%] px-2 py-2 lg:table-cell sm:px-3">Country</TableHead>
                <TableHead className="w-[18.5%] px-2 py-2 sm:px-3">Risk</TableHead>
                <TableHead className="w-[10%] px-2 py-2 sm:px-3">Status</TableHead>
                <TableHead className="w-[19%] px-2 py-2 text-right sm:px-3">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selected.has(row.id) ? "selected" : undefined}
                  className="border-slate-100"
                >
                  <TableCell className="px-2 py-1.5 sm:px-3">
                    <Checkbox
                      checked={selected.has(row.id)}
                      onCheckedChange={(c) => toggleOne(row.id, c === true)}
                      aria-label={`Select ${row.contractorName}`}
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1.5 sm:px-3">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Avatar className="size-7 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
                        <AvatarImage
                          src={row.contractorImage}
                          alt={row.contractorName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                          {row.contractorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-xs font-medium text-foreground sm:text-sm">
                        {row.contractorName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden min-w-0 overflow-hidden px-3 py-1.5 md:table-cell sm:px-4">
                    <span className="block whitespace-nowrap text-xs text-slate-600 sm:text-sm" title={row.invoiceDate}>
                      {row.invoiceDate}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-0 overflow-hidden pl-4 pr-3 py-1.5 sm:pl-5 sm:pr-4">
                    <span className="block whitespace-nowrap text-xs font-medium text-foreground sm:text-sm" title={`${row.currency} ${row.amount.toLocaleString()}`}>
                      {row.currency} {row.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="hidden px-2 py-1.5 text-xs text-slate-600 lg:table-cell sm:px-3 sm:text-sm">
                    {row.country}
                  </TableCell>
                  <TableCell className="px-2 py-1.5 sm:px-3 align-middle">
                    {row.anomaly ? (
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                          <AlertTriangle className="size-4 text-amber-600" />
                        </span>
                        <span className="min-w-0 text-[11px] leading-tight text-amber-700 sm:text-xs" title={`Anomaly Detected: ${row.anomaly}`}>
                          Rate +15% vs last month
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                          <Check className="size-4 text-emerald-600" />
                        </span>
                        <span className="min-w-0 text-[11px] text-emerald-700 sm:text-xs">No anomalies</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-2 py-1.5 sm:px-3 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="px-2 py-1.5 text-right sm:px-3">
                    <div className="flex flex-wrap justify-end gap-1 sm:gap-2">
                      <Button size="sm" variant="outline" className="h-7 min-w-0 shrink-0 rounded-md border-slate-200 px-2 text-xs sm:min-w-[60px] sm:px-2">
                        Review
                      </Button>
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "tween", duration: 0.15 }} className="shrink-0">
                        <Button size="sm" className="h-7 min-w-0 shrink-0 rounded-md px-2 text-xs sm:min-w-[64px] sm:px-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                          <Link href={`/payments?contractorId=${encodeURIComponent(row.id)}`}>
                            Pay Now
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRows.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-slate-600">No contracts match your filters.</p>
        )}
        {someSelected && filteredRows.length > 0 && (
          <p className="mt-3 px-4 text-sm text-slate-600">
            {selected.size} contract{selected.size !== 1 ? "s" : ""} selected
          </p>
        )}
      </CardContent>

      {/* Bulk Action bar – slides up when selection exists */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <p className="text-sm font-medium text-slate-700">
                <span className="font-semibold text-foreground">{selected.size} Contractors Selected</span>
                {" · "}
                Total: ${selectedTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200"
                  onClick={handleClearSelection}
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSmartReviewPayAll}
                >
                  Smart Review & Pay All
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Payout Summary modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => !payoutSuccess && setModalOpen(false)}
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
              aria-labelledby="bulk-payout-title"
              onClick={(e) => e.stopPropagation()}
            >
              {payoutSuccess ? (
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
                    {selectedRows.length} payout{selectedRows.length !== 1 ? "s" : ""} completed.
                  </p>
                </motion.div>
              ) : (
                <Card className="border border-slate-200 bg-white shadow-xl">
                  <CardHeader>
                    <CardTitle id="bulk-payout-title" className="text-lg">
                      Bulk Payout Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <dl className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-slate-600">Total Contractors</dt>
                        <dd className="font-medium text-foreground">{selectedRows.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-600">Total Amount</dt>
                        <dd className="font-medium text-foreground">
                          ${selectedTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-600">Compliance Status</dt>
                        <dd className="font-medium text-foreground">
                          {verifiedCount}/{selectedRows.length} Verified
                        </dd>
                      </div>
                    </dl>
                    {selectedWithAnomaly.length > 0 && (
                      <motion.div
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-amber-800">
                          {selectedWithAnomaly.length} Item{selectedWithAnomaly.length !== 1 ? "s" : ""} require
                          manual review: {selectedWithAnomaly.map((r) => r.contractorName).join(", ")}.
                        </p>
                      </motion.div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-200"
                        onClick={() => setModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handleExecuteGlobalPayout}
                      >
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
    </Card>
  );
}
