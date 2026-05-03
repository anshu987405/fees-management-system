import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

export function statusClass(status) {
  const map = {
    Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Overdue: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    "Verification Pending": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    Rejected: "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
  };
  return map[status] || map.Pending;
}

export function whatsappReminder(student) {
  const phone = String(student.phone || "").replace(/\D/g, "");
  const message = `Hello ${student.fullName}, your pending fees is ₹${student.remainingFees}. Please pay soon.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
