// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const MENU = [
  { label: "แดชบอร์ด", path: "/dashboard" },
  { label: "ระบบหน้าร้าน (POS)", path: "/dashboard/pos" },
  { label: "จัดการสต็อกสินค้า", path: "/dashboard/stocks" },
  { label: "จัดหมวดหมู่สินค้า", path: "/dashboard/categories" },
  { label: "ประวัติการขาย", path: "/dashboard/saleshistory" },
  { label: "การจัดการสินค้า", path: "/dashboard/products" },
  { label: "รายงานระบบขายหน้าร้าน", path: "/dashboard/reports" },
  { label: "จัดการผู้ใช้", path: "/dashboard/users", adminOnly: true }, // เฉพาะแอดมิน
  { label: "ตั้งค่าระบบ", path: "/dashboard/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // อ่าน role จาก localStorage
  const { role } = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("mm_auth") || "{}"); }
    catch { return {}; }
  }, []);
  const isAdmin = role === "แอดมิน";

  // กรองเมนู: ซ่อนรายการที่ adminOnly ถ้าไม่ใช่แอดมิน
  const menu = useMemo(
    () => MENU.filter(item => isAdmin || !item.adminOnly),
    [isAdmin]
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("mm_auth"); // ลบสิทธิ์ออกด้วย
    navigate("/"); // กลับไปหน้า Login
  };

  return (
    <aside className="w-64 h-screen sticky top-0 overflow-y-auto bg-[#FF6969] text-white p-5 shadow-xl flex flex-col">
      <nav className="space-y-1">
        {menu.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative block px-4 py-2 rounded-xl transition
                ${isActive ? "bg-white/25 font-semibold shadow-inner" : "hover:bg-white/15 hover:translate-x-0.5"}
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1.5 bg-white rounded-r-full" />
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full block px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition text-left"
        >
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
