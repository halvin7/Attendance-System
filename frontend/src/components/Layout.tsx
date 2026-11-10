import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CalendarClock, LayoutDashboard, LogOut, Users } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-red-500 text-black" : "text-slate-600 hover:bg-slate-100"}`;
  return (
    <div className="min-h-screen md:flex">
      <aside className="w-full border-b bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="rounded-lg bg-red-500 p-2 text-white">
            <CalendarClock size={20} />
          </div>
          <div>
            <p className="font-bold">Work Attendance</p>
            <p className="text-xs text-slate-500">WFH Attendance System</p>
          </div>
        </div>
        <nav className="flex gap-2 md:flex-col">
          {user?.role === "HRD" && (
            <NavLink to="/employees" className={linkClass}>
              <Users size={18} />
              Karyawan
            </NavLink>
          )}
          {user?.role === "HRD" && (
            <NavLink to="/monitoring" className={linkClass}>
              <CalendarClock size={18} />
              Monitoring Absensi
            </NavLink>
          )}
        </nav>
        <div className="mt-8 hidden border-t pt-4 md:block">
          <p className="text-sm font-semibold">{user?.fullName}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <p className="text-sm text-slate-500">Employee Attendance</p>
            <p className="font-semibold">Workspace</p>
          </div>
          <button
            className="mt-4 flex items-center gap-2 text-sm text-slate-500 hover:text-red-600"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
