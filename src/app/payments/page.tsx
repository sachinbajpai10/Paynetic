"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  FileText,
  Check,
  Plus,
  Trash2,
  CalendarIcon,
  Search,
  Landmark,
  Info,
  ChevronLeft,
  Eye,
  CreditCard,
  FileWarning,
  AlertTriangle,
  Download,
} from "lucide-react";
import Link from "next/link";
import { PaymentStepper } from "@/components/payment-stepper";
import { MethodAndSchedule } from "@/components/method-and-schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { contractorLedger } from "@/data/mockData";
import { CURRENCIES } from "@/data/currencies";

const PARSED_FORM_DEFAULT = {
  contractorName: "Aligned Assets",
  contractorCountry: "United Kingdom",
  contractorImage: "https://i.pravatar.cc/150?u=AlignedAssets",
  invoiceNumber: "INV-2025-847",
  date: "11/28/2025",
  taxForm: "W-8BEN",
  amount: "2,500",
};

export default function PaymentsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [formData, setFormData] = useState<{
    contractorName: string;
    contractorCountry: string;
    contractorImage: string;
    contractorCurrency: string;
    invoiceNumber: string;
    date: string;
    taxForm: string;
    amount: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileRef = useRef<File | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Step 2: Method and Schedule
  type PaymentMethodId = "bank" | "wise" | "crypto";
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>("wise");
  const [scheduleRecommendation, setScheduleRecommendation] = useState(true);

  // Step 3: Review and Compliance (Payment Form) – pre-filled for demo
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [firstName, setFirstName] = useState("Sarah");
  const [lastName, setLastName] = useState("Doe");
  const [expDate, setExpDate] = useState("12/28");
  const [cvv, setCvv] = useState("123");

  // Step 4: Completion (Success / Failure) – first attempt fails, retry succeeds
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [sendPaymentAttempts, setSendPaymentAttempts] = useState(0);

  // Swift transfer flow (after "Pay with Swift" on failure)
  const [useSwiftTransfer, setUseSwiftTransfer] = useState(false);
  const [paymentViaSwift, setPaymentViaSwift] = useState(false);
  const [swiftReference, setSwiftReference] = useState("INV-2025-847-SWIFT");
  const [swiftBankName, setSwiftBankName] = useState("HDFC Bank");
  const [swiftBic, setSwiftBic] = useState("HDFCINBB");
  const [swiftAccountNumber, setSwiftAccountNumber] = useState("****8845");

  const handleSendPayment = () => {
    setPaymentStatus("processing");
    const nextAttempt = sendPaymentAttempts + 1;
    setSendPaymentAttempts(nextAttempt);
    setTimeout(() => {
      setCurrentStep(4);
      setPaymentStatus(nextAttempt === 1 ? "failed" : "success");
    }, 2000);
  };

  const handlePayWithSwift = () => {
    setUseSwiftTransfer(true);
    setCurrentStep(3);
  };

  const handleConfirmSwiftTransfer = () => {
    setPaymentStatus("processing");
    setPaymentViaSwift(true);
    setTimeout(() => {
      setCurrentStep(4);
      setPaymentStatus("success");
    }, 2000);
  };

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        uploadedFileRef.current = null;
        setUploadedFile(null);
        return;
      }
      uploadedFileRef.current = file;
      setUploadedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)}KB`,
      });
      setIsParsing(true);
      setTimeout(() => {
        setFormData({ ...PARSED_FORM_DEFAULT });
        setIsParsing(false);
      }, 3000);
    },
    []
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && /\.(pdf|jpeg|jpg|png|mp4)$/i.test(file.name)) {
      handleFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onBrowse = () => fileInputRef.current?.click();

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const deleteFile = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    uploadedFileRef.current = null;
    setUploadedFile(null);
    setFormData(null);
  };

  const paymentAmountNum = formData?.amount
    ? parseFloat(String(formData.amount).replace(/,/g, "")) || 0
    : 2500;
  const transferFee = 50.5;
  const totalCostNum = paymentAmountNum + transferFee;

  const [viewSummaryOpen, setViewSummaryOpen] = useState(false);

  const openUploadedContract = () => {
    const file = uploadedFileRef.current;
    if (file) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = URL.createObjectURL(file);
      window.open(objectUrlRef.current, "_blank", "noopener,noreferrer");
    } else {
      setViewSummaryOpen(true);
    }
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const contractorId = searchParams.get("contractorId");
    if (!contractorId) return;
    const contractor = contractorLedger.find((c) => c.id === contractorId);
    if (!contractor) return;
    const payoutCurrency =
      CURRENCIES.find(
        (c) => c.country.toLowerCase() === contractor.country.toLowerCase()
      )?.code ?? contractor.currency;
    setFormData({
      contractorName: contractor.contractorName,
      contractorCountry: contractor.country,
      contractorImage: contractor.contractorImage,
      contractorCurrency: payoutCurrency,
      invoiceNumber: `INV-${contractor.id.replace("cl-", "")}`,
      date: contractor.invoiceDate,
      taxForm: "W-8BEN",
      amount: contractor.amount.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    });
    setUploadedFile({ name: "Contract from dashboard", size: "—" });
  }, [searchParams]);

  // If user comes from the FX \"Schedule Now\" CTA, jump them directly to Method & Schedule
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam === "2") {
      setCurrentStep(2);
      setScheduleRecommendation(true);
    }
  }, [searchParams, setScheduleRecommendation]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Left: Stepper */}
          <aside className="shrink-0">
            <PaymentStepper currentStep={currentStep} />
          </aside>

          {/* Main: Step content */}
          <div className="min-w-0">
            {formData && searchParams.get("contractorId") && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50/80 px-4 py-3">
                <Avatar className="size-10 shrink-0 overflow-hidden rounded-full border border-teal-100">
                  <AvatarImage src={formData.contractorImage} alt={formData.contractorName} className="object-cover" />
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-medium">
                    {formData.contractorName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-teal-900">Paying to</p>
                  <p className="text-sm font-semibold text-foreground">{formData.contractorName} · {formData.contractorCountry}</p>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                {/* Upload zone + file card: show drop zone only when no file; otherwise file card + "Upload another" */}
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpeg,.jpg,.png,.mp4"
                    className="hidden"
                    onChange={onFileInputChange}
                  />
                  {!uploadedFile ? (
                    <div
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onClick={onBrowse}
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 px-6 transition-colors",
                        isDragging
                          ? "border-teal-400 bg-teal-50/50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      )}
                    >
                      <Cloud className="size-12 text-slate-400" aria-hidden />
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Drop your invoice here.
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4 border-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBrowse();
                        }}
                      >
                        Browse Files
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Card className="border border-slate-100 bg-white shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-red-50">
                            <FileText className="size-7 text-red-600" aria-hidden />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {uploadedFile.name}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-slate-600">
                              <span>
                                1 of 1
                                {uploadedFile.size !== "—" && ` • ${uploadedFile.size}`}
                              </span>
                              <span className="text-teal-600">•</span>
                              <span className="inline-flex items-center gap-1 font-medium text-teal-600">
                                <Check className="size-3.5" aria-hidden />
                                Completed
                              </span>
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 border-slate-200 text-slate-700"
                              onClick={openUploadedContract}
                            >
                              <Eye className="size-4" aria-hidden />
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={deleteFile}
                              className="size-8 shrink-0 text-slate-500 hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete invoice"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <button
                        type="button"
                        onClick={onBrowse}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        <Plus className="size-4" aria-hidden />
                        Upload another
                      </button>
                    </>
                  )}
                </div>

                {/* Review form */}
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {isParsing ? (
                      <motion.div
                        key="parsing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm"
                      >
                        <div className="flex flex-col items-center justify-center gap-4 py-8">
                          <div className="size-12 animate-pulse rounded-full bg-teal-100" />
                          <p className="text-sm font-medium text-slate-700">
                            Parsing invoice with AI...
                          </p>
                          <p className="text-xs text-slate-500">
                            This usually takes a few seconds.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {formData && (
                          <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3 flex items-center gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100">
                              <Check className="size-4 text-teal-600" />
                            </div>
                            <p className="text-sm font-medium text-teal-800">
                              Invoice Parsed Successfully! Please check the
                              information below.
                            </p>
                          </div>
                        )}

                        <Card className="border border-slate-100 bg-white shadow-sm">
                          <CardContent className="space-y-4 p-6">
                            {/* Contractor Name */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Contractor Name
                              </label>
                              {formData ? (
                                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                                  <Avatar className="size-10 shrink-0 overflow-hidden rounded-full border border-slate-100">
                                    <AvatarImage
                                      src={formData.contractorImage}
                                      alt={formData.contractorName}
                                      className="object-cover"
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                      AA
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-foreground">
                                      {formData.contractorName}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                      {formData.contractorCountry}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 shrink-0 text-slate-500 hover:text-red-600"
                                    aria-label="Remove contractor"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                  <Input
                                    placeholder="Search"
                                    className="pl-9"
                                    disabled
                                  />
                                </div>
                              )}
                            </div>

                            {/* Invoice Number */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Invoice Number
                              </label>
                              <Input
                                value={formData?.invoiceNumber ?? ""}
                                readOnly={!!formData}
                                placeholder="e.g. INV-2025-847"
                                className={cn(
                                  formData && "bg-slate-50/50"
                                )}
                              />
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Date
                              </label>
                              <div className="relative">
                                <CalendarIcon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <Input
                                  value={formData?.date ?? ""}
                                  readOnly={!!formData}
                                  placeholder="MM/DD/YYYY"
                                  className={cn(
                                    "pr-9",
                                    formData && "bg-slate-50/50"
                                  )}
                                />
                              </div>
                            </div>

                            {/* Tax Form */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Tax Form
                              </label>
                              <Input
                                value={formData?.taxForm ?? ""}
                                readOnly={!!formData}
                                placeholder="e.g. W-8BEN"
                                className={cn(
                                  formData && "bg-slate-50/50"
                                )}
                              />
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Amount
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                  $
                                </span>
                                <Input
                                  value={formData?.amount ?? ""}
                                  readOnly={!!formData}
                                  placeholder="0.00"
                                  className={cn(
                                    "pl-7",
                                    formData && "bg-slate-50/50"
                                  )}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <MethodAndSchedule
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                scheduleRecommendation={scheduleRecommendation}
                setScheduleRecommendation={setScheduleRecommendation}
                initialSendAmount={
                  formData?.amount
                    ? parseFloat(String(formData.amount).replace(/,/g, "")) || undefined
                    : undefined
                }
                initialReceiveCurrency={formData?.contractorCurrency}
              />
            )}

            {currentStep === 3 && (
              <div className="relative grid gap-8 lg:grid-cols-[1fr_340px]">
                {/* Processing overlay */}
                {paymentStatus === "processing" && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-50/90">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-10 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                      <p className="text-sm font-medium text-slate-700">Processing...</p>
                    </div>
                  </div>
                )}

                {/* Center: Payment form (Card) or SWIFT Wire Transfer */}
                <div className="space-y-6">
                  {useSwiftTransfer ? (
                    /* SWIFT Wire Transfer form */
                    <Card className="border border-slate-100 bg-white shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="size-5 text-teal-600" aria-hidden />
                          <h3 className="text-base font-semibold text-foreground">SWIFT Wire Transfer</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-6">
                          Complete the details below to send payment via SWIFT. This method works best for this country.
                        </p>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Payment reference</label>
                            <Input
                              value={swiftReference}
                              onChange={(e) => setSwiftReference(e.target.value)}
                              placeholder="e.g. INV-2025-847"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Beneficiary bank</label>
                            <Input
                              value={swiftBankName}
                              onChange={(e) => setSwiftBankName(e.target.value)}
                              placeholder="Bank name"
                              className="w-full"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">SWIFT / BIC code</label>
                              <Input
                                value={swiftBic}
                                onChange={(e) => setSwiftBic(e.target.value)}
                                placeholder="e.g. HDFCINBB"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Account number</label>
                              <Input
                                value={swiftAccountNumber}
                                onChange={(e) => setSwiftAccountNumber(e.target.value)}
                                placeholder="****8845"
                              />
                            </div>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Amount</span>
                              <span className="font-medium text-foreground">
                                ${paymentAmountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Transfer fee</span>
                              <span className="font-medium text-foreground">${transferFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                              <span className="font-medium text-foreground">Total to send</span>
                              <span className="font-semibold text-foreground">
                                ${totalCostNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setUseSwiftTransfer(false);
                              setCurrentStep(2);
                            }}
                            className="border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={handleConfirmSwiftTransfer}
                            disabled={paymentStatus === "processing"}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {paymentStatus === "processing" ? "Sending via SWIFT..." : "Confirm Swift Transfer"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                  <Card className="border border-slate-100 bg-white shadow-sm">
                    <CardContent className="p-6">
                      {/* Tabs */}
                      <div className="flex border-b border-slate-200 mb-4">
                        <button
                          type="button"
                          onClick={() => setCardType("credit")}
                          className={cn(
                            "pb-3 px-1 text-sm font-medium border-b-2 -mb-px transition-colors",
                            cardType === "credit"
                              ? "border-teal-500 text-teal-600"
                              : "border-transparent text-slate-600 hover:text-slate-800"
                          )}
                        >
                          Credit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardType("debit")}
                          className={cn(
                            "pb-3 px-1 ml-6 text-sm font-medium border-b-2 -mb-px transition-colors",
                            cardType === "debit"
                              ? "border-teal-500 text-teal-600"
                              : "border-transparent text-slate-600 hover:text-slate-800"
                          )}
                        >
                          Debit Card
                        </button>
                      </div>

                      {/* Card brand icons */}
                      <div className="flex items-center gap-3 mb-6">
                        {["Discover", "Visa", "Mastercard", "Amex"].map((brand) => (
                          <div
                            key={brand}
                            className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                          >
                            {brand}
                          </div>
                        ))}
                      </div>

                      {/* Form */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Card Number</label>
                          <Input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card number"
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">First Name</label>
                            <Input
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="First name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Last Name</label>
                            <Input
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Last name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Exp Date</label>
                            <Input
                              value={expDate}
                              onChange={(e) => setExpDate(e.target.value)}
                              placeholder="mm/yy"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">CVV</label>
                            <Input
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              placeholder="CVV"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSendPayment}
                          disabled={paymentStatus === "processing"}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {paymentStatus === "processing" ? "Sending..." : "Send Payment"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  )}
                </div>

                {/* Right: Compliance Checks + Cost Breakdown */}
                <div className="space-y-4">
                  <Card className="border border-slate-100 bg-white shadow-sm">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Compliance Checks</h3>
                      <ul className="space-y-3">
                        {[
                          "Contractor Identify Verified (KYC Passed)",
                          "Indian Purpose Code : P0802 (Software Consultancy) applied by AI",
                          "W-8BEN Tax Form Valid (Exp: 2029)",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white mt-0.5">
                              <Check className="size-3" aria-hidden />
                            </div>
                            <span className="text-sm text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-100 bg-white shadow-sm">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Cost Breakdown</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Amount</dt>
                          <dd className="font-medium text-foreground">
                            ${paymentAmountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Exchange Rate</dt>
                          <dd className="font-medium text-foreground">83.95 INR</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-600">Transfer Rate</dt>
                          <dd className="font-medium text-foreground">${transferFee.toFixed(2)}</dd>
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
                            ${totalCostNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </dd>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <>
                {paymentStatus === "failed" ? (
                  /* Failure View */
                  <div className="max-w-lg mx-auto space-y-6">
                    <div className="flex flex-col items-center">
                      <div className="relative flex items-center justify-center">
                        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-8">
                          <CreditCard className="size-12 text-red-400" aria-hidden />
                          <FileWarning className="absolute -right-2 -top-2 size-8 text-red-500" aria-hidden />
                        </div>
                        <AlertTriangle className="absolute right-4 top-4 size-6 text-red-500" aria-hidden />
                      </div>
                      <h2 className="mt-6 text-2xl font-bold text-foreground">Payment Failed!</h2>
                      <p className="mt-2 text-sm text-red-600">
                        {`Payout of $${paymentAmountNum.toLocaleString("en-US")} failed to ${formData?.contractorName ?? "Aligned Assets"}`}
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 flex items-start gap-2">
                      <Info className="size-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden />
                      <p className="text-sm text-emerald-800">
                        AI suggest trying SWIFT wire transfer, works best for this country.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-200"
                        onClick={() => setCurrentStep(3)}
                      >
                        Retry Payment
                      </Button>
                      <Button
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handlePayWithSwift}
                      >
                        Pay with Swift
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Success View */
                  <div className="max-w-lg mx-auto space-y-6">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="flex size-20 items-center justify-center rounded-full bg-teal-500 text-white"
                      >
                        <Check className="size-10" strokeWidth={2.5} aria-hidden />
                      </motion.div>
                      <h2 className="mt-6 text-2xl font-bold text-foreground">
                        Payment Sent Successfully!
                      </h2>
                    </div>
                    <Card className="border border-slate-100 bg-white shadow-sm">
                      <CardContent className="p-6 space-y-3">
                        {paymentViaSwift && (
                          <div className="flex justify-between text-sm rounded-md bg-teal-50 px-3 py-2 -mx-1">
                            <span className="text-slate-600">Transfer method</span>
                            <span className="font-medium text-teal-700">SWIFT wire transfer</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Transaction ID</span>
                          <span className="font-medium text-foreground">
                            #{paymentViaSwift ? "SWIFT-2025-8475" : "TXN-2025-8475"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Amount</span>
                          <span className="font-medium text-foreground">
                            ${paymentAmountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Receipt</span>
                          <span className="font-medium text-foreground">
                            {formData?.contractorName ?? "Aligned Assets"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Date</span>
                          <span className="font-medium text-foreground">
                            {formData?.date ?? "11/28/2025"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="rounded-lg border border-teal-200 bg-teal-50/80 px-4 py-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-teal-800">Make Payment</p>
                      <Button
                        size="sm"
                        className="bg-teal-600 text-white hover:bg-teal-700 shrink-0"
                        onClick={() => {
                          setCurrentStep(1);
                          setSendPaymentAttempts(0);
                          setUseSwiftTransfer(false);
                          setPaymentViaSwift(false);
                        }}
                      >
                        New payment
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-slate-200"
                      onClick={() => {}}
                    >
                      <Download className="size-4 mr-2" aria-hidden />
                      Download Receipt
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Bottom actions (hidden on step 3 and 4; step 3 has its own actions, step 4 is completion) */}
            {currentStep !== 3 && currentStep !== 4 && (
              <div className="mt-8 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                >
                  Back
                </Button>
                <Button
                  onClick={() =>
                    setCurrentStep((s) => Math.min(4, s + 1))
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {currentStep === 1
                    ? "Continue to Verification"
                    : currentStep === 2
                      ? "Proceed to Payment Compliance"
                      : "Continue"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View uploaded invoice summary (when no file to open, e.g. Contract from dashboard) */}
      <AnimatePresence>
        {viewSummaryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setViewSummaryOpen(false)}
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
              aria-labelledby="view-upload-title"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border border-slate-200 bg-white shadow-xl">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <FileText className="size-5 text-slate-600" aria-hidden />
                    <h2 id="view-upload-title" className="text-base font-semibold text-foreground">
                      Uploaded invoice
                    </h2>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {uploadedFile?.name ?? "Invoice"} — {uploadedFile?.size ?? "—"}
                  </p>
                  {formData && (
                    <dl className="mt-4 space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-600">Contractor</dt>
                        <dd className="font-medium text-foreground">{formData.contractorName}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-600">Invoice #</dt>
                        <dd className="font-medium text-foreground">{formData.invoiceNumber}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-600">Date</dt>
                        <dd className="font-medium text-foreground">{formData.date}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-600">Amount</dt>
                        <dd className="font-medium text-foreground">$ {formData.amount}</dd>
                      </div>
                    </dl>
                  )}
                  <p className="mt-3 text-xs text-slate-500">
                    No file to preview. Use the summary above to verify what was uploaded, or upload a file to view the original document.
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200"
                      onClick={() => setViewSummaryOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
