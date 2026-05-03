import { api } from "./api";

function cleanPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

export function receiptPageUrl(paymentId) {
  return `${api.defaults.baseURL}/payments/${paymentId}/receipt-page`;
}

export async function whatsappReceiptUrl(paymentId) {
  const res = await api.get(`/payments/${paymentId}/receipt`);
  const { student, whatsappText } = res.data.data;
  return `https://wa.me/${cleanPhone(student.phone)}?text=${encodeURIComponent(whatsappText)}`;
}
