import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import PaymentForm from "../components/PaymentForm";
import { api } from "../lib/api";

export default function Fees() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/students", { params: { limit: 100 } }).then((res) => setStudents(res.data.data));
  }, []);

  async function submit(values) {
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== "") form.append(key, value);
      });
      await api.post("/payments", form);
      toast.success("Payment recorded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to record payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Fees" description="Record cash, UPI, and online payments with partial-payment support." />
      <div className="panel max-w-3xl p-5">
        <PaymentForm students={students} onSubmit={submit} loading={loading} />
      </div>
    </>
  );
}
