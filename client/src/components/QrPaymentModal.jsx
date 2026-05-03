import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer, Send } from "lucide-react";
import Modal from "./Modal";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/utils";

function cleanPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function buildUpiUri({ upiId, name, amount }) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: Number(amount || 0).toFixed(2),
    cu: "INR"
  });
  return `upi://pay?${params.toString()}`;
}

function publicAppUrl(path, settings) {
  const configured = settings?.publicAppUrl?.trim();
  if (configured) {
    return `${configured.replace(/\/$/, "")}${path}`;
  }

  const apiUrl = new URL(api.defaults.baseURL);
  return `${apiUrl.origin}${path}`;
}

export default function QrPaymentModal({ student, settings, onClose }) {
  const [amount, setAmount] = useState(student?.remainingFees || 0);
  const [qr, setQr] = useState("");
  const upiId = settings?.upiId || "name@upi";
  const paymentProofUrl = publicAppUrl(`/api/payments/public-pay/${student._id}?amount=${encodeURIComponent(amount || 0)}`, settings);
  const isLocalhostLink = paymentProofUrl.includes("//localhost") || paymentProofUrl.includes("//127.0.0.1");

  const upiUri = useMemo(() => buildUpiUri({ upiId, name: student.fullName, amount }), [upiId, student.fullName, amount]);

  useEffect(() => {
    QRCode.toDataURL(paymentProofUrl, {
      margin: 2,
      width: 360,
      color: { dark: "#101828", light: "#ffffff" }
    }).then(setQr);
  }, [paymentProofUrl]);

  function printQr() {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head><title>Payment QR</title></head>
        <body style="font-family:Segoe UI,Arial,sans-serif;text-align:center;padding:24px">
          <h2>${student.fullName}</h2>
          <p>${student.courseName}</p>
          <img src="${qr}" style="width:320px;height:320px" />
          <h3>${formatCurrency(amount)}</h3>
          <p>UPI ID: ${upiId}</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }

  const message = `Fees payment link:\n${paymentProofUrl}\n\nOpen this link to scan QR / pay by UPI and upload payment screenshot for approval.`;
  const whatsappUrl = `https://wa.me/${cleanPhone(student.phone)}?text=${encodeURIComponent(message)}`;

  return (
    <Modal title="Student Payment QR" onClose={onClose}>
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-500">Student</p>
            <p className="text-xl font-extrabold">{student.fullName}</p>
            <p className="text-sm text-slate-500">{student.courseName} - Pending {formatCurrency(student.remainingFees)}</p>
          </div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
            QR Amount
            <input className="input mt-1" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
            UPI ID
            <input className="input mt-1" value={upiId} readOnly />
          </label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
            Student should scan this QR or open this link. It opens the payment page with UPI pay option and screenshot upload form.
          </div>
          {isLocalhostLink && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
              For student phone, open the app with your computer IP address instead of localhost, then generate this QR again.
            </div>
          )}
          {!settings?.publicAppUrl && (
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm font-semibold text-sky-800">
              For any-phone internet access without IP, deploy the app online and set Settings - Public App URL.
            </div>
          )}
          <p className="break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-950">UPI deep link: {upiUri}</p>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="font-bold">Payment and upload link</p>
            <a className="break-all underline" href={paymentProofUrl} target="_blank" rel="noreferrer">{paymentProofUrl}</a>
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            {qr ? <img src={qr} alt="UPI QR" className="h-56 w-56" /> : <div className="h-56 w-56 animate-pulse bg-slate-100" />}
          </div>
          <div className="mt-3 grid gap-2">
            <a className="btn-primary" href={qr} download={`${student.fullName}-payment-upload-link-qr.png`}>
              <Download size={16} /> Download
            </a>
            <button className="btn-secondary" onClick={printQr}>
              <Printer size={16} /> Print
            </button>
            <a className="btn-secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
              <Send size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
