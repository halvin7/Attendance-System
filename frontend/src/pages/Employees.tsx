import { FormEvent, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { api } from "../api";
import type { User } from "../types";

const empty = {
  employeeCode: "",
  fullName: "",
  email: "",
  department: "",
  position: "",
  role: "EMPLOYEE",
  password: "Welcome123!",
};
export default function Employees() {
  const [rows, setRows] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    const { data } = await api.get("/employees");
    setRows(data);
  }
  useEffect(() => {
    load().catch(() => setError("Tidak dapat mengambil data karyawan."));
  }, []);
  const filtered = rows.filter((x) =>
    `${x.fullName} ${x.employeeCode} ${x.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function open(row?: User) {
    setEditing(row?.id || null);
    setForm(row ? { ...row, password: "" } : { ...empty });
    setError("");
    setShow(true);
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) await api.patch(`/employees/${editing}`, form);
      else await api.post("/employees", form);
      setShow(false);
      await load();
    } catch (e: any) {
      setError(e.response?.data?.message || "Gagal menyimpan data.");
    }
  }
  async function deactivate(id: number) {
    if (!confirm("Nonaktifkan karyawan ini?")) return;
    try {
      await api.delete(`/employees/${id}`);
      await load();
    } catch (e: any) {
      setError(e.response?.data?.message || "Gagal menonaktifkan karyawan.");
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Master Karyawan</h1>
        </div>
        <button
          onClick={() => open()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Tambah Karyawan
        </button>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <div className="relative mb-4 max-w-sm">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={17}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, kode, atau email..."
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        {error && <p className="mb-3 text-sm text-red-600">{String(error)}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="py-3">Kode</th>
                <th>Nama</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((x) => (
                <tr key={x.id} className="border-b last:border-0">
                  <td className="py-3">{x.employeeCode}</td>
                  <td>
                    <p className="font-medium">{x.fullName}</p>
                    <p className="text-xs text-slate-400">{x.email}</p>
                  </td>
                  <td>{x.department}</td>
                  <td>{x.role}</td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${x.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {x.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => open(x)}
                      className="mr-3 text-blue-600"
                    >
                      Edit
                    </button>
                    {x.isActive && (
                      <button
                        onClick={() => deactivate(x.id)}
                        className="text-red-600"
                      >
                        Nonaktifkan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              Data tidak ditemukan.
            </p>
          )}
        </div>
      </div>
      {show && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">
              {editing ? "Edit Karyawan" : "Tambah Karyawan"}
            </h2>
            {[
              ["employeeCode", "Employee Code"],
              ["fullName", "Nama Lengkap"],
              ["email", "Email"],
              ["department", "Department"],
              ["position", "Jabatan"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm font-medium">
                {label}
                <input
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </label>
            ))}
            {!editing && (
              <label className="block text-sm font-medium">
                Password awal
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </label>
            )}
            <label className="block text-sm font-medium">
              Role
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HRD">HRD</option>
              </select>
            </label>
            {editing && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                Aktif
              </label>
            )}
            {error && <p className="text-sm text-red-600">{String(error)}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
