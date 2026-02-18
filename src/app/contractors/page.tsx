"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus } from "lucide-react";
import {
  contractorDirectory,
  type ContractorDirectoryEntry,
  type ContractorDepartment,
  type ContractorTaxStatus,
} from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const DEPARTMENT_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All departments" },
  { value: "Design", label: "Design" },
  { value: "Engineering", label: "Engineering" },
  { value: "Marketing", label: "Marketing" },
];

const TAX_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "Verified", label: "Verified" },
  { value: "Expiring Soon", label: "Expiring Soon" },
];

function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-US", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      } catch {
        setTime("—");
      }
    };
    format();
    const id = setInterval(format, 60000);
    return () => clearInterval(id);
  }, [timezone]);
  return <span className="tabular-nums">{time || "—"}</span>;
}

function TaxStatusBadge({ status }: { status: ContractorTaxStatus }) {
  const isVerified = status === "Verified";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        isVerified
          ? "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
      )}
    >
      {status}
    </span>
  );
}

export default function ContractorsPage() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [taxStatusFilter, setTaxStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = contractorDirectory;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.jobTitle.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q)
      );
    }
    if (departmentFilter !== "all") {
      list = list.filter((c) => c.department === departmentFilter);
    }
    if (taxStatusFilter !== "all") {
      list = list.filter((c) => c.taxStatus === taxStatusFilter);
    }
    return list;
  }, [search, departmentFilter, taxStatusFilter]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contractors</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            People management directory — view profiles and stay in touch.
          </p>
        </div>

        <Card className="border border-slate-100 bg-white shadow-sm rounded-xl">
          <CardContent className="p-0">
            {/* Top Search & Management Bar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="Search by name, role, or country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  aria-label="Search contractors"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[160px] border-slate-200">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={taxStatusFilter} onValueChange={setTaxStatusFilter}>
                  <SelectTrigger className="w-[160px] border-slate-200">
                    <SelectValue placeholder="Tax status" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <UserPlus className="mr-2 size-4" aria-hidden />
                  Add New Contractor
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="px-4 py-3 font-medium text-slate-700">Contractor</TableHead>
                    <TableHead className="px-4 py-3 font-medium text-slate-700">Location & Time</TableHead>
                    <TableHead className="px-4 py-3 font-medium text-slate-700">Total Paid</TableHead>
                    <TableHead className="px-4 py-3 font-medium text-slate-700">Tax Status</TableHead>
                    <TableHead className="px-4 py-3 font-medium text-slate-700">Last Active</TableHead>
                    <TableHead className="px-4 py-3 text-right font-medium text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <ContractorRow key={c.id} contractor={c} />
                  ))}
                </TableBody>
              </Table>
            </div>

            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-600">
                No contractors match your filters.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContractorRow({ contractor }: { contractor: ContractorDirectoryEntry }) {
  const initials = contractor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.tr
      layout
      className="border-b border-slate-100 bg-white"
      initial={false}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      transition={{ duration: 0.2 }}
    >
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
            <AvatarImage src={contractor.avatarUrl} alt={contractor.name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{contractor.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{contractor.jobTitle}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none" aria-hidden>
            {contractor.countryFlag}
          </span>
          <div>
            <p className="text-sm text-foreground">{contractor.country}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <LocalTime timezone={contractor.timezone} />
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <span className="font-semibold text-foreground">
          ${contractor.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3">
        <TaxStatusBadge status={contractor.taxStatus} />
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
        {contractor.lastActive}
      </TableCell>
      <TableCell className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" className="h-8 rounded-lg border-slate-200">
            View Profile
          </Button>
          <Button size="sm" className="h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            Message
          </Button>
        </div>
      </TableCell>
    </motion.tr>
  );
}
