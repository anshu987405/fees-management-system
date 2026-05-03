import QRCode from "qrcode";

export function buildUpiUri({ upiId, name, amount }) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: Number(amount || 0).toFixed(2),
    cu: "INR"
  });

  return `upi://pay?${params.toString()}`;
}

export async function buildUpiQrDataUrl(payload) {
  return QRCode.toDataURL(buildUpiUri(payload), {
    margin: 2,
    width: 320,
    color: { dark: "#101828", light: "#ffffff" }
  });
}
