// src/pages/Users.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const STORAGE_KEY = "mm_users";

const DEFAULT_USERS = [
  { id: "U001", empName: "ป๊อกแป๊ก", username: "pokpak", role: "แอดมิน", active: true, password: "admin123" },
  { id: "U002", empName: "วันวาว",   username: "wubwow", role: "พนักงานขาย", active: false, password: "sale12345" },
];

export default function Users() {
  const navigate = useNavigate();

  // ✅ Guard: ตรวจสิทธิ์ก่อนแสดงหน้า
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/", { replace: true });
      return;
    }
    let role = "";
    try {
      const auth = JSON.parse(localStorage.getItem("mm_auth") || "{}");
      role = auth?.role || "";
    } catch {}
    if (role !== "แอดมิน") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [confirmId, setConfirmId] = useState(null); // เปิด modal ลบ

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setUsers(JSON.parse(raw));
    else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const save = (next) => {
    setUsers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.empName, u.username, u.role].some((v) =>
        String(v || "").toLowerCase().includes(s)
      )
    );
  }, [users, q]);

  const uById = (id) => users.find((u) => u.id === id);

  const onDelete = (id) => {
    save(users.filter((u) => u.id !== id));
    setConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-4">จัดการผู้ใช้งาน</h1>

        {/* แถบค้นหา + เพิ่มผู้ใช้ */}
        <div className="flex items-center gap-3 mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อพนักงาน/ชื่อผู้ใช้/สิทธิ์"
            className="flex-1 h-11 px-4 rounded-lg border border-black/20 bg-white/80 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Link
            to="/dashboard/users/new"
            className="h-11 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center justify-center"
          >
            เพิ่มผู้ใช้งาน
          </Link>
        </div>

        {/* ตาราง */}
        <div className="rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white/90">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#C80036] text-white">
                <th className="px-4 py-3 text-left">ชื่อพนักงาน</th>
                <th className="px-4 py-3 text-left">ชื่อผู้ใช้</th>
                <th className="px-4 py-3 text-left">สิทธิ์การใช้งาน</th>
                <th className="px-4 py-3 text-left">สถานะ</th>
                <th className="px-4 py-3 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-3">{u.empName}</td>
                  <td className="px-4 py-3 font-semibold">{u.username}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    {u.active ? (
                      <span className="inline-block rounded px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold">
                        เปิดใช้งาน
                      </span>
                    ) : (
                      <span className="inline-block rounded px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold">
                        ปิดใช้งาน
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/users/${u.id}/edit`)}
                        className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-500 text-black font-semibold"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => setConfirmId(u.id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    ไม่พบผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal ยืนยันลบ */}
        {confirmId && (
          <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
            <div className="bg-white rounded-2xl w-[min(520px,92vw)] p-6 shadow-lg">
              <div className="text-center">
                <div className="text-lg font-extrabold">คุณต้องการลบข้อมูลผู้ใช้งาน</div>
                <div className="text-lg font-extrabold mt-1">
                  {uById(confirmId)?.username} ใช่หรือไม่
                </div>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    onClick={() => onDelete(confirmId)}
                    className="px-6 h-10 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
                  >
                    ลบ
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-6 h-10 rounded-lg bg-gray-300 text-black hover:bg-gray-400 font-semibold"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
