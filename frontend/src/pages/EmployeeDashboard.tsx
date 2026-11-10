import { useEffect, useState } from "react";
import { Camera, CheckCircle2, Clock3 } from "lucide-react";
import { api, imageUrl } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { Attendance } from "../types";
import { toast } from "sonner";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold">{value}</p>
    </div>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Attendance[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const todayRecord = rows.find(
    (r) => r.attendanceDate?.slice(0, 10) === today,
  );

  async function load() {
    const { data } = await api.get("/attendance/me");
    setRows(data);
  }

  useEffect(() => {
    load().catch(() => {
      const message = "Gagal memuat history absensi.";
      setError(message);
      toast.error(message);
    });
  }, []);

  async function checkIn() {
    if (!photo) {
      const message = "Masukkan foto.";
      setError(message);
      toast.error(message);
      return;
    }

    const form = new FormData();
    form.append("photo", photo);

    setBusy(true);
    setError("");

    try {
      await api.post("/attendance/check-in", form);

      const message = "Check In Berhasil.";
      setMessage(message);
      toast.success(message);

      setPhoto(null);
      await load();
    } catch (e: any) {
      const message = e.response?.data?.message || "Check In Gagal.";

      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function checkOut() {
    setBusy(true);
    setError("");

    try {
      await api.post("/attendance/check-out");

      const message = "Check Out Berhasil.";
      setMessage(message);
      toast.success(message);

      await load();
    } catch (e: any) {
      const message = e.response?.data?.message || "Check Out Gagal.";

      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="mt-1 text-2xl font-bold">Halo, {user?.fullName}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Department" value={user?.department || "-"} />
        <Stat
          label="Tanggal"
          value={new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
        />
        <Stat label="Riwayat absensi" value={`${rows.length} hari`} />
      </div>
      <section className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-2">
          <Clock3 className="text-red-500" />
          <h2 className="font-semibold">Absensi hari ini</h2>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Check in</p>
            <p className="mt-1 text-xl font-bold">
              {todayRecord?.checkInAt
                ? new Date(todayRecord.checkInAt).toLocaleTimeString("id-ID")
                : "Belum check in"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Check out</p>
            <p className="mt-1 text-xl font-bold">
              {todayRecord?.checkOutAt
                ? new Date(todayRecord.checkOutAt).toLocaleTimeString("id-ID")
                : "Belum check out"}
            </p>
          </div>
        </div>
        {!todayRecord?.checkInAt ? (
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              Foto bukti bekerja (JPG/PNG/WEBP, maks. 5 MB)
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-slate-600 hover:border-blue-500">
              <Camera size={20} />
              <span>{photo?.name || "Pilih foto dari perangkat"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </label>
            <button
              onClick={checkIn}
              disabled={busy}
              className="mt-4 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? "Menyimpan..." : "Submit Check in"}
            </button>
          </div>
        ) : !todayRecord.checkOutAt ? (
          <button
            onClick={checkOut}
            disabled={busy}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Menyimpan..." : "Check out"}
          </button>
        ) : (
          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            Absensi hari ini sudah lengkap.
          </p>
        )}
        {message && (
          <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {String(error)}
          </p>
        )}
      </section>
      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold">History Absensi</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="py-3">Tanggal</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Bukti</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr className="border-b last:border-0" key={r.id}>
                  <td className="py-3">
                    {new Date(r.attendanceDate).toLocaleDateString("id-ID")}
                  </td>
                  <td>
                    {r.checkInAt
                      ? new Date(r.checkInAt).toLocaleTimeString("id-ID")
                      : "-"}
                  </td>
                  <td>
                    {r.checkOutAt
                      ? new Date(r.checkOutAt).toLocaleTimeString("id-ID")
                      : "-"}
                  </td>
                  <td>
                    {r.checkInPhoto ? (
                      <a
                        className="text-blue-600 hover:underline"
                        href={imageUrl(r.checkInPhoto)}
                        target="_blank"
                      >
                        Lihat foto
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              Belum ada data absensi.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
