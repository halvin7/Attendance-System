import { useEffect, useState } from "react";
import { api, imageUrl } from "../api";
import type { Attendance } from "../types";
export default function Monitoring() {
  const [rows, setRows] = useState<Attendance[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/attendance")
      .then((r) => setRows(r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Gagal memuat absensi."),
      );
  }, []);
  const filtered = rows.filter((r) =>
    `${r.employee?.fullName || ""} ${r.employee?.employeeCode || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoring Absensi</h1>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau kode karyawan..."
          className="mb-4 w-full max-w-sm rounded-lg border px-3 py-2 text-sm"
        />
        {error && <p className="mb-3 text-sm text-red-600">{String(error)}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="py-3">Tanggal</th>
                <th>Karyawan</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Bukti foto</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-3">
                    {new Date(r.attendanceDate).toLocaleDateString("id-ID")}
                  </td>
                  <td>
                    <p className="font-medium">
                      {r.employee?.fullName || `Employee #${r.employeeId}`}
                    </p>
                    <p className="text-xs text-slate-400">
                      {r.employee?.employeeCode}
                    </p>
                  </td>
                  <td>{r.employee?.department || "-"}</td>
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
                        href={imageUrl(r.checkInPhoto)}
                        target="_blank"
                        className="text-blue-600 hover:underline"
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
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              Belum ada history absensi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
