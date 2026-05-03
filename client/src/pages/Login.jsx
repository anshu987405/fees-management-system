import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CreditCard, LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../store/auth";

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "admin@feespro.local", password: "Admin@12345" });
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(values);
      toast.success("Welcome back");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
            <CreditCard size={26} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">FeesPro Admin</h1>
          <p className="mt-2 text-sm text-slate-500">Secure finance cockpit for student fee operations.</p>
        </div>
        <form onSubmit={submit} className="panel space-y-4 p-6">
          <label className="text-sm font-semibold text-slate-600">
            Email
            <input className="input mt-1" type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />
          </label>
          <label className="text-sm font-semibold text-slate-600">
            Password
            <input className="input mt-1" type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} required />
          </label>
          <button className="btn-primary w-full" disabled={loading}>
            <LockKeyhole size={17} /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
