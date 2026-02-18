"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PayneticLogoIcon } from "@/components/paynetic-logo";
import { cn } from "@/lib/utils";

const navTabs = [
  { label: "Dashboard", href: "/" },
  { label: "Contractors", href: "/contractors" },
  { label: "Payments", href: "/payments" },
];

export function GlobalNav() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-white",
        "shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      )}
    >
      <div className="flex h-14 items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo with icon */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        >
          <PayneticLogoIcon className="size-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">
            Paynetic
          </span>
        </Link>

        {/* Centered nav tabs */}
        <nav className="flex flex-1 justify-center" aria-label="Main">
          <ul className="flex items-center gap-1">
            {navTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA + User */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Button
            size="default"
            className={cn(
              "bg-primary text-primary-foreground shadow-sm",
              "hover:bg-primary/90 font-medium rounded-lg"
            )}
            asChild
          >
            <Link href="/payments">
              <Plus className="size-4 shrink-0" aria-hidden />
              <span>New Invoice +</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-2 py-1.5 sm:gap-3 sm:px-3">
            <Avatar className="size-8 sm:size-9 overflow-hidden rounded-full border border-border bg-muted">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=SarahDoe"
                alt="Sarah Doe"
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                SD
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-medium text-foreground">
                Sarah Doe
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Rochester, NY
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
