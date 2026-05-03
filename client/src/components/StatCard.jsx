import { formatCurrency } from "../lib/utils";

export default function StatCard({ label, value, icon: Icon, money = false, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
    slate: "bg-slate-100 text-slate-700"
  };

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight">{money ? formatCurrency(value) : value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
