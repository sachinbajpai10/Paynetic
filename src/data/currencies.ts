/**
 * 80+ currencies with simulated exchange rates relative to 1 USD.
 * Used for FX Converter and global payout display.
 */

export interface Currency {
  code: string;
  name: string;
  country: string;
  flag: string;
  rate: number; // units per 1 USD
}

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", country: "United States", flag: "🇺🇸", rate: 1.0 },
  { code: "EUR", name: "Euro", country: "Eurozone", flag: "🇪🇺", rate: 0.92 },
  { code: "GBP", name: "British Pound", country: "United Kingdom", flag: "🇬🇧", rate: 0.79 },
  { code: "INR", name: "Indian Rupee", country: "India", flag: "🇮🇳", rate: 83.75 },
  { code: "JPY", name: "Japanese Yen", country: "Japan", flag: "🇯🇵", rate: 149.5 },
  { code: "AUD", name: "Australian Dollar", country: "Australia", flag: "🇦🇺", rate: 1.53 },
  { code: "CAD", name: "Canadian Dollar", country: "Canada", flag: "🇨🇦", rate: 1.36 },
  { code: "SGD", name: "Singapore Dollar", country: "Singapore", flag: "🇸🇬", rate: 1.34 },
  { code: "MXN", name: "Mexican Peso", country: "Mexico", flag: "🇲🇽", rate: 17.1 },
  { code: "CHF", name: "Swiss Franc", country: "Switzerland", flag: "🇨🇭", rate: 0.88 },
  { code: "HKD", name: "Hong Kong Dollar", country: "Hong Kong", flag: "🇭🇰", rate: 7.82 },
  { code: "CNY", name: "Chinese Yuan", country: "China", flag: "🇨🇳", rate: 7.24 },
  { code: "KRW", name: "South Korean Won", country: "South Korea", flag: "🇰🇷", rate: 1298 },
  { code: "BRL", name: "Brazilian Real", country: "Brazil", flag: "🇧🇷", rate: 4.97 },
  { code: "ZAR", name: "South African Rand", country: "South Africa", flag: "🇿🇦", rate: 18.5 },
  { code: "AED", name: "UAE Dirham", country: "United Arab Emirates", flag: "🇦🇪", rate: 3.67 },
  { code: "SAR", name: "Saudi Riyal", country: "Saudi Arabia", flag: "🇸🇦", rate: 3.75 },
  { code: "PLN", name: "Polish Złoty", country: "Poland", flag: "🇵🇱", rate: 3.97 },
  { code: "THB", name: "Thai Baht", country: "Thailand", flag: "🇹🇭", rate: 35.2 },
  { code: "IDR", name: "Indonesian Rupiah", country: "Indonesia", flag: "🇮🇩", rate: 15680 },
  { code: "MYR", name: "Malaysian Ringgit", country: "Malaysia", flag: "🇲🇾", rate: 4.72 },
  { code: "PHP", name: "Philippine Peso", country: "Philippines", flag: "🇵🇭", rate: 56.2 },
  { code: "CZK", name: "Czech Koruna", country: "Czech Republic", flag: "🇨🇿", rate: 22.8 },
  { code: "SEK", name: "Swedish Krona", country: "Sweden", flag: "🇸🇪", rate: 10.5 },
  { code: "NOK", name: "Norwegian Krone", country: "Norway", flag: "🇳🇴", rate: 10.7 },
  { code: "DKK", name: "Danish Krone", country: "Denmark", flag: "🇩🇰", rate: 6.89 },
  { code: "NZD", name: "New Zealand Dollar", country: "New Zealand", flag: "🇳🇿", rate: 1.64 },
  { code: "ILS", name: "Israeli Shekel", country: "Israel", flag: "🇮🇱", rate: 3.68 },
  { code: "EGP", name: "Egyptian Pound", country: "Egypt", flag: "🇪🇬", rate: 30.9 },
  { code: "NGN", name: "Nigerian Naira", country: "Nigeria", flag: "🇳🇬", rate: 1580 },
  { code: "PKR", name: "Pakistani Rupee", country: "Pakistan", flag: "🇵🇰", rate: 278 },
  { code: "BGN", name: "Bulgarian Lev", country: "Bulgaria", flag: "🇧🇬", rate: 1.8 },
  { code: "RON", name: "Romanian Leu", country: "Romania", flag: "🇷🇴", rate: 4.57 },
  { code: "HUF", name: "Hungarian Forint", country: "Hungary", flag: "🇭🇺", rate: 358 },
  { code: "TRY", name: "Turkish Lira", country: "Turkey", flag: "🇹🇷", rate: 32.1 },
  { code: "COP", name: "Colombian Peso", country: "Colombia", flag: "🇨🇴", rate: 3950 },
  { code: "ARS", name: "Argentine Peso", country: "Argentina", flag: "🇦🇷", rate: 875 },
  { code: "CLP", name: "Chilean Peso", country: "Chile", flag: "🇨🇱", rate: 915 },
  { code: "PEN", name: "Peruvian Sol", country: "Peru", flag: "🇵🇪", rate: 3.72 },
  { code: "VND", name: "Vietnamese Dong", country: "Vietnam", flag: "🇻🇳", rate: 24500 },
  { code: "BDT", name: "Bangladeshi Taka", country: "Bangladesh", flag: "🇧🇩", rate: 110 },
  { code: "LKR", name: "Sri Lankan Rupee", country: "Sri Lanka", flag: "🇱🇰", rate: 325 },
  { code: "NPR", name: "Nepalese Rupee", country: "Nepal", flag: "🇳🇵", rate: 133 },
  { code: "UAH", name: "Ukrainian Hryvnia", country: "Ukraine", flag: "🇺🇦", rate: 37.5 },
  { code: "RUB", name: "Russian Ruble", country: "Russia", flag: "🇷🇺", rate: 92.0 },
  { code: "KES", name: "Kenyan Shilling", country: "Kenya", flag: "🇰🇪", rate: 129 },
  { code: "GHS", name: "Ghanaian Cedi", country: "Ghana", flag: "🇬🇭", rate: 12.5 },
  { code: "MAD", name: "Moroccan Dirham", country: "Morocco", flag: "🇲🇦", rate: 10.0 },
  { code: "TWD", name: "Taiwan Dollar", country: "Taiwan", flag: "🇹🇼", rate: 31.5 },
  { code: "QAR", name: "Qatari Riyal", country: "Qatar", flag: "🇶🇦", rate: 3.64 },
  { code: "KWD", name: "Kuwaiti Dinar", country: "Kuwait", flag: "🇰🇼", rate: 0.31 },
  { code: "BHD", name: "Bahraini Dinar", country: "Bahrain", flag: "🇧🇭", rate: 0.38 },
  { code: "OMR", name: "Omani Rial", country: "Oman", flag: "🇴🇲", rate: 0.38 },
  { code: "JOD", name: "Jordanian Dinar", country: "Jordan", flag: "🇯🇴", rate: 0.71 },
  { code: "LBP", name: "Lebanese Pound", country: "Lebanon", flag: "🇱🇧", rate: 89500 },
  { code: "ISK", name: "Icelandic Króna", country: "Iceland", flag: "🇮🇸", rate: 138 },
  { code: "HRK", name: "Croatian Kuna", country: "Croatia", flag: "🇭🇷", rate: 6.89 },
  { code: "RSD", name: "Serbian Dinar", country: "Serbia", flag: "🇷🇸", rate: 108 },
  { code: "UYU", name: "Uruguayan Peso", country: "Uruguay", flag: "🇺🇾", rate: 38.5 },
  { code: "BOB", name: "Bolivian Boliviano", country: "Bolivia", flag: "🇧🇴", rate: 6.91 },
  { code: "PYG", name: "Paraguayan Guaraní", country: "Paraguay", flag: "🇵🇾", rate: 7280 },
  { code: "GTQ", name: "Guatemalan Quetzal", country: "Guatemala", flag: "🇬🇹", rate: 7.82 },
  { code: "DOP", name: "Dominican Peso", country: "Dominican Republic", flag: "🇩🇴", rate: 56.8 },
  { code: "JMD", name: "Jamaican Dollar", country: "Jamaica", flag: "🇯🇲", rate: 155 },
  { code: "TTD", name: "Trinidad Dollar", country: "Trinidad and Tobago", flag: "🇹🇹", rate: 6.78 },
  { code: "BBD", name: "Barbadian Dollar", country: "Barbados", flag: "🇧🇧", rate: 2.0 },
  { code: "XAF", name: "Central African CFA", country: "CEMAC", flag: "🇲🇱", rate: 602 },
  { code: "XOF", name: "West African CFA", country: "UEMOA", flag: "🇸🇳", rate: 602 },
  { code: "TZS", name: "Tanzanian Shilling", country: "Tanzania", flag: "🇹🇿", rate: 2520 },
  { code: "UGX", name: "Ugandan Shilling", country: "Uganda", flag: "🇺🇬", rate: 3780 },
  { code: "ETB", name: "Ethiopian Birr", country: "Ethiopia", flag: "🇪🇹", rate: 56.5 },
  { code: "MUR", name: "Mauritian Rupee", country: "Mauritius", flag: "🇲🇺", rate: 45.2 },
  { code: "CVE", name: "Cape Verde Escudo", country: "Cape Verde", flag: "🇨🇻", rate: 101 },
  { code: "GEL", name: "Georgian Lari", country: "Georgia", flag: "🇬🇪", rate: 2.68 },
  { code: "AMD", name: "Armenian Dram", country: "Armenia", flag: "🇦🇲", rate: 405 },
  { code: "AZN", name: "Azerbaijani Manat", country: "Azerbaijan", flag: "🇦🇿", rate: 1.7 },
  { code: "KZT", name: "Kazakhstani Tenge", country: "Kazakhstan", flag: "🇰🇿", rate: 449 },
  { code: "UZS", name: "Uzbekistani Som", country: "Uzbekistan", flag: "🇺🇿", rate: 12400 },
  { code: "MMK", name: "Myanmar Kyat", country: "Myanmar", flag: "🇲🇲", rate: 2100 },
  { code: "KHR", name: "Cambodian Riel", country: "Cambodia", flag: "🇰🇭", rate: 4100 },
  { code: "LAK", name: "Lao Kip", country: "Laos", flag: "🇱🇦", rate: 19600 },
  { code: "MNT", name: "Mongolian Tugrik", country: "Mongolia", flag: "🇲🇳", rate: 3430 },
  { code: "BWP", name: "Botswana Pula", country: "Botswana", flag: "🇧🇼", rate: 13.6 },
  { code: "NAD", name: "Namibian Dollar", country: "Namibia", flag: "🇳🇦", rate: 18.5 },
  { code: "MZN", name: "Mozambican Metical", country: "Mozambique", flag: "🇲🇿", rate: 63.8 },
  { code: "ZMW", name: "Zambian Kwacha", country: "Zambia", flag: "🇿🇲", rate: 26.5 },
  { code: "AOA", name: "Angolan Kwanza", country: "Angola", flag: "🇦🇴", rate: 830 },
  { code: "DZD", name: "Algerian Dinar", country: "Algeria", flag: "🇩🇿", rate: 134 },
  { code: "TND", name: "Tunisian Dinar", country: "Tunisia", flag: "🇹🇳", rate: 3.11 },
  { code: "LYD", name: "Libyan Dinar", country: "Libya", flag: "🇱🇾", rate: 4.85 },
  { code: "IQD", name: "Iraqi Dinar", country: "Iraq", flag: "🇮🇶", rate: 1310 },
  { code: "IRR", name: "Iranian Rial", country: "Iran", flag: "🇮🇷", rate: 42000 },
  { code: "AFN", name: "Afghan Afghani", country: "Afghanistan", flag: "🇦🇫", rate: 71.2 },
];

/** Get currency by code (case-insensitive). */
export function getCurrencyByCode(code: string): Currency | undefined {
  const upper = code.toUpperCase();
  return CURRENCIES.find((c) => c.code === upper);
}

/** Convert amount from one currency to another (both rates are per 1 USD). */
export function convertCurrency(
  amount: number,
  fromRate: number,
  toRate: number
): number {
  const inUsd = amount / fromRate;
  return inUsd * toRate;
}
