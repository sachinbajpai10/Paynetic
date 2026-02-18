export type PaymentStatus = "Overdue" | "Upcoming" | "Pending" | "Completed" | "In Review";

export interface UrgentPayment {
  id: string;
  contractorName: string;
  contractorImage: string;
  status: "Overdue" | "Upcoming";
  dueDate: string;
  amount: number;
  currency: string;
}

export interface ContractorLedgerRow {
  id: string;
  contractorName: string;
  contractorImage: string;
  invoiceDate: string;
  amount: number;
  currency: string;
  country: string;
  status: PaymentStatus;
  /** AI anomaly message; when set, Risk column shows a warning. */
  anomaly?: string;
}

export interface MetricCard {
  label: string;
  value: string | number;
  sublabel?: string;
}

// Professional placeholder photos (realistic faces, consistent per person)
export const urgentPayments: UrgentPayment[] = [
  {
    id: "up-1",
    contractorName: "James Chen",
    contractorImage: "https://i.pravatar.cc/150?u=JamesChen",
    status: "Overdue",
    dueDate: "Feb 8, 2026",
    amount: 4200,
    currency: "USD",
  },
  {
    id: "up-2",
    contractorName: "Maria Santos",
    contractorImage: "https://i.pravatar.cc/150?u=MariaSantos",
    status: "Upcoming",
    dueDate: "Feb 15, 2026",
    amount: 1850,
    currency: "EUR",
  },
  {
    id: "up-3",
    contractorName: "David Okonkwo",
    contractorImage: "https://i.pravatar.cc/150?u=DavidOkonkwo",
    status: "Overdue",
    dueDate: "Feb 5, 2026",
    amount: 3100,
    currency: "GBP",
  },
  {
    id: "up-4",
    contractorName: "Priya Sharma",
    contractorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "Upcoming",
    dueDate: "Feb 18, 2026",
    amount: 2400,
    currency: "USD",
  },
  {
    id: "up-5",
    contractorName: "Lars Mueller",
    contractorImage: "https://i.pravatar.cc/150?u=LarsMueller",
    status: "Overdue",
    dueDate: "Feb 6, 2026",
    amount: 5200,
    currency: "EUR",
  },
  {
    id: "up-6",
    contractorName: "Yuki Tanaka",
    contractorImage: "https://i.pravatar.cc/150?u=YukiTanaka",
    status: "Upcoming",
    dueDate: "Feb 20, 2026",
    amount: 1680,
    currency: "USD",
  },
];

export const contractorLedger: ContractorLedgerRow[] = [
  {
    id: "cl-1",
    contractorName: "James Chen",
    contractorImage: "https://i.pravatar.cc/150?u=JamesChen",
    invoiceDate: "Feb 1, 2026",
    amount: 4200,
    currency: "USD",
    country: "United States",
    status: "Pending",
  },
  {
    id: "cl-2",
    contractorName: "Maria Santos",
    contractorImage: "https://i.pravatar.cc/150?u=MariaSantos",
    invoiceDate: "Feb 3, 2026",
    amount: 1850,
    currency: "EUR",
    country: "Spain",
    status: "In Review",
  },
  {
    id: "cl-3",
    contractorName: "David Okonkwo",
    contractorImage: "https://i.pravatar.cc/150?u=DavidOkonkwo",
    invoiceDate: "Jan 28, 2026",
    amount: 3100,
    currency: "GBP",
    country: "United Kingdom",
    status: "Completed",
  },
  {
    id: "cl-4",
    contractorName: "Priya Sharma",
    contractorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    invoiceDate: "Feb 5, 2026",
    amount: 2400,
    currency: "USD",
    country: "India",
    status: "Pending",
  },
  {
    id: "cl-5",
    contractorName: "Lars Mueller",
    contractorImage: "https://i.pravatar.cc/150?u=LarsMueller",
    invoiceDate: "Feb 7, 2026",
    amount: 5200,
    currency: "EUR",
    country: "Germany",
    status: "Completed",
  },
  {
    id: "cl-6",
    contractorName: "Yuki Tanaka",
    contractorImage: "https://i.pravatar.cc/150?u=YukiTanaka",
    invoiceDate: "Feb 10, 2026",
    amount: 1680,
    currency: "USD",
    country: "Japan",
    status: "Pending",
  },
  {
    id: "cl-7",
    contractorName: "Aligned Assets",
    contractorImage: "https://i.pravatar.cc/150?u=AlignedAssets",
    invoiceDate: "Feb 4, 2026",
    amount: 2500,
    currency: "USD",
    country: "United Kingdom",
    status: "Pending",
    anomaly: "Rate increased by 15% vs last month.",
  },
  {
    id: "cl-8",
    contractorName: "Sofia Rodriguez",
    contractorImage: "https://i.pravatar.cc/150?u=SofiaRodriguez",
    invoiceDate: "Feb 6, 2026",
    amount: 1900,
    currency: "USD",
    country: "Mexico",
    status: "Pending",
  },
  {
    id: "cl-9",
    contractorName: "Marcus Johnson",
    contractorImage: "https://i.pravatar.cc/150?u=MarcusJohnson",
    invoiceDate: "Feb 8, 2026",
    amount: 3300,
    currency: "USD",
    country: "Canada",
    status: "In Review",
  },
  {
    id: "cl-10",
    contractorName: "Elena Petrova",
    contractorImage: "https://i.pravatar.cc/150?u=ElenaPetrova",
    invoiceDate: "Feb 2, 2026",
    amount: 2100,
    currency: "EUR",
    country: "Poland",
    status: "Pending",
  },
  {
    id: "cl-11",
    contractorName: "Wei Zhang",
    contractorImage: "https://i.pravatar.cc/150?u=WeiZhang",
    invoiceDate: "Feb 9, 2026",
    amount: 2800,
    currency: "USD",
    country: "Singapore",
    status: "Pending",
  },
  {
    id: "cl-12",
    contractorName: "Olivia Brown",
    contractorImage: "https://i.pravatar.cc/150?u=OliviaBrown",
    invoiceDate: "Feb 11, 2026",
    amount: 1650,
    currency: "GBP",
    country: "Ireland",
    status: "Pending",
  },
];

export const metricCards: MetricCard[] = [
  { label: "Total Spending", value: "$ 24,000", sublabel: "This month" },
  { label: "Payments Pending", value: 12 },
  { label: "Payment Review", value: 1 },
  { label: "Payments Completed", value: 24 },
];

export const fxInsight = {
  title: "AI is tracking FX for you — save up to $12 by Tuesday.",
  ctaLabel: "Smart Schedule (AI)",
};

// Contractors directory (People Management)
export type ContractorDepartment = "Design" | "Engineering" | "Marketing";
export type ContractorTaxStatus = "Verified" | "Expiring Soon";

export interface ContractorDirectoryEntry {
  id: string;
  name: string;
  avatarUrl: string;
  jobTitle: string;
  department: ContractorDepartment;
  country: string;
  countryFlag: string;
  timezone: string; // IANA e.g. America/New_York
  totalPaid: number; // USD
  taxStatus: ContractorTaxStatus;
  lastActive: string; // e.g. "Feb 1, 2026"
}

export const contractorDirectory: ContractorDirectoryEntry[] = [
  {
    id: "cd-1",
    name: "James Chen",
    avatarUrl: "https://i.pravatar.cc/150?u=JamesChen",
    jobTitle: "Lead Developer",
    department: "Engineering",
    country: "United States",
    countryFlag: "🇺🇸",
    timezone: "America/New_York",
    totalPaid: 45200,
    taxStatus: "Verified",
    lastActive: "Feb 1, 2026",
  },
  {
    id: "cd-2",
    name: "Maria Santos",
    avatarUrl: "https://i.pravatar.cc/150?u=MariaSantos",
    jobTitle: "Senior Designer",
    department: "Design",
    country: "Spain",
    countryFlag: "🇪🇸",
    timezone: "Europe/Madrid",
    totalPaid: 28900,
    taxStatus: "Verified",
    lastActive: "Jan 28, 2026",
  },
  {
    id: "cd-3",
    name: "David Okonkwo",
    avatarUrl: "https://i.pravatar.cc/150?u=DavidOkonkwo",
    jobTitle: "Backend Engineer",
    department: "Engineering",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    timezone: "Europe/London",
    totalPaid: 53100,
    taxStatus: "Expiring Soon",
    lastActive: "Feb 5, 2026",
  },
  {
    id: "cd-4",
    name: "Priya Sharma",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    jobTitle: "Product Designer",
    department: "Design",
    country: "India",
    countryFlag: "🇮🇳",
    timezone: "Asia/Kolkata",
    totalPaid: 32400,
    taxStatus: "Verified",
    lastActive: "Jan 30, 2026",
  },
  {
    id: "cd-5",
    name: "Lars Mueller",
    avatarUrl: "https://i.pravatar.cc/150?u=LarsMueller",
    jobTitle: "DevOps Engineer",
    department: "Engineering",
    country: "Germany",
    countryFlag: "🇩🇪",
    timezone: "Europe/Berlin",
    totalPaid: 61800,
    taxStatus: "Verified",
    lastActive: "Feb 6, 2026",
  },
  {
    id: "cd-6",
    name: "Yuki Tanaka",
    avatarUrl: "https://i.pravatar.cc/150?u=YukiTanaka",
    jobTitle: "UX Researcher",
    department: "Design",
    country: "Japan",
    countryFlag: "🇯🇵",
    timezone: "Asia/Tokyo",
    totalPaid: 38700,
    taxStatus: "Expiring Soon",
    lastActive: "Feb 2, 2026",
  },
  {
    id: "cd-7",
    name: "Sofia Costa",
    avatarUrl: "https://i.pravatar.cc/150?u=SofiaCosta",
    jobTitle: "Content Marketing Lead",
    department: "Marketing",
    country: "Brazil",
    countryFlag: "🇧🇷",
    timezone: "America/Sao_Paulo",
    totalPaid: 22100,
    taxStatus: "Verified",
    lastActive: "Jan 25, 2026",
  },
  {
    id: "cd-8",
    name: "Ahmed Hassan",
    avatarUrl: "https://i.pravatar.cc/150?u=AhmedHassan",
    jobTitle: "Full Stack Developer",
    department: "Engineering",
    country: "Egypt",
    countryFlag: "🇪🇬",
    timezone: "Africa/Cairo",
    totalPaid: 19500,
    taxStatus: "Verified",
    lastActive: "Jan 22, 2026",
  },
  {
    id: "cd-9",
    name: "Elena Kowalski",
    avatarUrl: "https://i.pravatar.cc/150?u=ElenaKowalski",
    jobTitle: "Brand Designer",
    department: "Design",
    country: "Poland",
    countryFlag: "🇵🇱",
    timezone: "Europe/Warsaw",
    totalPaid: 26700,
    taxStatus: "Expiring Soon",
    lastActive: "Feb 4, 2026",
  },
  {
    id: "cd-10",
    name: "Marcus Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=MarcusJohnson",
    jobTitle: "Growth Marketing",
    department: "Marketing",
    country: "Australia",
    countryFlag: "🇦🇺",
    timezone: "Australia/Sydney",
    totalPaid: 41900,
    taxStatus: "Verified",
    lastActive: "Feb 3, 2026",
  },
  {
    id: "cd-11",
    name: "Zara Okonjo",
    avatarUrl: "https://i.pravatar.cc/150?u=ZaraOkonjo",
    jobTitle: "Frontend Engineer",
    department: "Engineering",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    timezone: "Africa/Lagos",
    totalPaid: 28300,
    taxStatus: "Verified",
    lastActive: "Jan 29, 2026",
  },
  {
    id: "cd-12",
    name: "Liam O'Brien",
    avatarUrl: "https://i.pravatar.cc/150?u=LiamOBrien",
    jobTitle: "Demand Gen Manager",
    department: "Marketing",
    country: "Ireland",
    countryFlag: "🇮🇪",
    timezone: "Europe/Dublin",
    totalPaid: 35600,
    taxStatus: "Verified",
    lastActive: "Feb 7, 2026",
  },
];
