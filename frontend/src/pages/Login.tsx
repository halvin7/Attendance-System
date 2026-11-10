import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login berhasil.");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Login gagal. Silakan periksa email dan password Anda.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-xl bg-red-500 p-3 text-white">
            <CalendarClock size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Work Attendance</h1>
            <p className="text-sm text-slate-500">WFH Attendance System</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <span className="text-red-500">*</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <span className="text-red-500">*</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {String(error)}
            </p>
          )}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
