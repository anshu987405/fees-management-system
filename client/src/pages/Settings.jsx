import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import { api } from "../lib/api";

export default function Settings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data.data));
  }, []);

  async function submit(event) {
    event.preventDefault();
    const res = await api.patch("/settings", settings);
    setSettings(res.data.data);
    toast.success("Settings saved");
  }

  if (!settings) return <div className="panel h-80 animate-pulse bg-slate-100" />;

  const fields = [
    ["instituteName", "Institute Name"],
    ["institutePhone", "Institute Phone"],
    ["instituteEmail", "Institute Email"],
    ["upiId", "UPI ID"],
    ["publicAppUrl", "Public App URL"],
    ["address", "Address"]
  ];

  return (
    <>
      <PageHeader title="Settings" description="Manage institute profile, UPI payment identity, and reminder preferences." />
      <form onSubmit={submit} className="panel grid max-w-3xl gap-4 p-5 sm:grid-cols-2">
        {fields.map(([field, label]) => (
          <label key={field} className={`${field === "address" ? "sm:col-span-2" : ""} text-sm font-semibold text-slate-600 dark:text-slate-300`}>
            {label}
            {field === "address" ? (
              <textarea className="input mt-1 min-h-24" value={settings[field] || ""} onChange={(e) => setSettings({ ...settings, [field]: e.target.value })} />
            ) : (
              <input className="input mt-1" value={settings[field] || ""} onChange={(e) => setSettings({ ...settings, [field]: e.target.value })} />
            )}
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={settings.autoWhatsappReminders} onChange={(e) => setSettings({ ...settings, autoWhatsappReminders: e.target.checked })} />
          Auto WhatsApp reminders
        </label>
        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Overdue after days
          <input className="input mt-1" type="number" value={settings.reminderOverdueDays} onChange={(e) => setSettings({ ...settings, reminderOverdueDays: Number(e.target.value) })} />
        </label>
        <div className="sm:col-span-2 flex justify-end">
          <button className="btn-primary">Save Settings</button>
        </div>
      </form>
    </>
  );
}
