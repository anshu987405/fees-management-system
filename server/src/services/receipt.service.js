function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function date(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function receiptText({ payment, student, settings }) {
  return [
    `Fee Receipt - ${settings?.instituteName || "FeesPro Academy"}`,
    `Receipt No: ${payment.receiptNumber}`,
    `Student: ${student.fullName}`,
    `Course: ${student.courseName}`,
    `Amount Paid: ${money(payment.amount)}`,
    `Mode: ${payment.mode}`,
    `Date: ${date(payment.paymentDate)}`,
    `Total Fees: ${money(student.totalFees)}`,
    `Paid Fees: ${money(student.paidFees)}`,
    `Remaining Fees: ${money(student.remainingFees)}`,
    "Thank you."
  ].join("\n");
}

export function receiptHtml({ payment, student, settings }) {
  const institute = settings?.instituteName || "FeesPro Academy";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fee Receipt ${escapeHtml(payment.receiptNumber)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #eef2f7; color: #111827; font-family: "Segoe UI", Arial, sans-serif; }
    .wrap { max-width: 840px; margin: 32px auto; padding: 0 16px; }
    .receipt { background: #fff; border: 1px solid #dbe3ef; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(15,23,42,.12); }
    .top { display: flex; justify-content: space-between; gap: 20px; padding: 28px; background: #064e3b; color: white; }
    .brand { font-size: 28px; font-weight: 800; letter-spacing: -.02em; }
    .muted { color: #d1fae5; font-size: 13px; margin-top: 5px; }
    .pill { display: inline-block; border: 1px solid rgba(255,255,255,.35); border-radius: 999px; padding: 8px 12px; font-weight: 700; }
    .body { padding: 28px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; }
    .label { color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .value { margin-top: 6px; font-size: 16px; font-weight: 750; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th, td { padding: 14px; border-bottom: 1px solid #e5e7eb; text-align: left; }
    th { background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; }
    .total { display: flex; justify-content: flex-end; margin-top: 22px; }
    .summary { width: min(360px, 100%); border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    .row { display: flex; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid #e5e7eb; }
    .row:last-child { border-bottom: 0; background: #ecfdf5; font-weight: 800; }
    .footer { padding: 20px 28px; color: #64748b; font-size: 13px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; gap: 12px; }
    .actions { margin: 16px 0; display: flex; gap: 10px; justify-content: flex-end; }
    button { border: 0; border-radius: 10px; padding: 10px 14px; background: #059669; color: white; font-weight: 800; cursor: pointer; }
    @media print {
      body { background: white; }
      .wrap { margin: 0; max-width: none; padding: 0; }
      .receipt { box-shadow: none; border-radius: 0; }
      .actions { display: none; }
    }
    @media (max-width: 640px) {
      .top, .footer { flex-direction: column; }
      .grid { grid-template-columns: 1fr; }
      .brand { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="actions"><button onclick="window.print()">Print / Save PDF</button></div>
    <section class="receipt">
      <div class="top">
        <div>
          <div class="brand">${escapeHtml(institute)}</div>
          <div class="muted">${escapeHtml(settings?.address || "")}</div>
          <div class="muted">${escapeHtml(settings?.institutePhone || "")} ${escapeHtml(settings?.instituteEmail || "")}</div>
        </div>
        <div>
          <div class="pill">RECEIPT</div>
          <div class="muted">No. ${escapeHtml(payment.receiptNumber)}</div>
        </div>
      </div>
      <div class="body">
        <div class="grid">
          <div class="box"><div class="label">Student</div><div class="value">${escapeHtml(student.fullName)}</div></div>
          <div class="box"><div class="label">Father Name</div><div class="value">${escapeHtml(student.fatherName)}</div></div>
          <div class="box"><div class="label">Course</div><div class="value">${escapeHtml(student.courseName)}</div></div>
          <div class="box"><div class="label">Phone</div><div class="value">${escapeHtml(student.phone)}</div></div>
        </div>
        <table>
          <thead><tr><th>Date</th><th>Payment Mode</th><th>Status</th><th>Amount</th></tr></thead>
          <tbody>
            <tr>
              <td>${date(payment.paymentDate)}</td>
              <td>${escapeHtml(payment.mode)}</td>
              <td>${escapeHtml(payment.status)}</td>
              <td>${money(payment.amount)}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">
          <div class="summary">
            <div class="row"><span>Total Fees</span><strong>${money(student.totalFees)}</strong></div>
            <div class="row"><span>Total Paid</span><strong>${money(student.paidFees)}</strong></div>
            <div class="row"><span>Remaining</span><strong>${money(student.remainingFees)}</strong></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>This is a computer generated fee receipt.</span>
        <strong>Authorized by ${escapeHtml(institute)}</strong>
      </div>
    </section>
  </div>
</body>
</html>`;
}
