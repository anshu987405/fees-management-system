import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, CreditCard, FileSpreadsheet, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Receipt, Settings, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { cn } from "../lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: GraduationCap },
  { to: "/fees", label: "Fees", icon: Receipt },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function DashboardLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("feespro_theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("feespro_theme", dark ? "dark" : "light");
  }, [dark]);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white/95 px-4 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
          <FileSpreadsheet size={22} />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight">FeesPro</p>
          <p className="text-xs font-medium text-slate-500">Academy finance suite</p>
        </div>
      </div>
      <nav className="space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900",
                isActive && "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-100"
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold">{admin?.name}</p>
        <p className="truncate text-xs text-slate-500">{admin?.email}</p>
        <button className="btn-secondary mt-3 w-full justify-start" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen lg:flex">
      <div className="hidden lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="relative h-full">{sidebar}</div>
        </div>
      )}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
          <button className="btn-secondary px-3 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-500">Admin Panel</p>
            <p className="text-lg font-extrabold tracking-tight">Student Fees Management</p>
          </div>
          <button className="btn-secondary px-3" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
