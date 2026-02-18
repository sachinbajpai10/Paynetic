"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const PAYMENT_STEPS = [
  {
    id: 1,
    title: "Upload & Review Invoice",
    subtitle: "Scan your invoice and check for any mistakes",
  },
  {
    id: 2,
    title: "Method and Schedule",
    subtitle: "Choose how and when to pay.",
  },
  {
    id: 3,
    title: "Review and Compliance",
    subtitle: "Review all details before you send payment.",
  },
  {
    id: 4,
    title: "Complete",
    subtitle: undefined,
  },
] as const;

interface PaymentStepperProps {
  currentStep: number;
  className?: string;
}

export function PaymentStepper({ currentStep, className }: PaymentStepperProps) {
  return (
    <nav
      className={cn("flex flex-col", className)}
      aria-label="Payment steps"
    >
      {PAYMENT_STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isFuture = currentStep < step.id;
        const isLast = index === PAYMENT_STEPS.length - 1;

        return (
          <div key={step.id} className="flex">
            {/* Left: number circle + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  isCompleted &&
                    "border-teal-500 bg-teal-500 text-white",
                  isCurrent &&
                    "border-teal-500 bg-teal-500 text-white",
                  isFuture &&
                    "border-slate-200 bg-white text-slate-500"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="size-4 shrink-0" aria-hidden />
                ) : (
                  step.id
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mt-1 w-0.5 h-8",
                    isCompleted ? "bg-teal-500" : "bg-slate-300"
                  )}
                  aria-hidden
                />
              )}
            </div>

            {/* Right: label — pt-2 aligns first line of text with circle center */}
            <div className="ml-3 pt-2 pb-6">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-teal-600 dark:text-teal-400",
                  isCompleted && "text-foreground",
                  isFuture && "text-slate-600"
                )}
              >
                {step.title}
              </p>
              {step.subtitle && (
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    isCurrent
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-slate-500"
                  )}
                >
                  {step.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
