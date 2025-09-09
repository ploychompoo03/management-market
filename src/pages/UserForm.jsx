import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const STORAGE_KEY = "mm_users";
const ROLE_OPTIONS = ["แอดมิน", "พนักงานขาย"];

export default function UserForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setUsers(raw ? JSON.parse(raw) : []);
  }, []);

  const target = useMemo(() => users.find((u) => u.id === id), [users, id]);

  const [empName, setEmpName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (isEdit && target) {
      setEmpName(target.empName || "");
      setUsername(target.username || "");
      setRole(target.role || ROLE_OPTIONS[0]);
      setPassword(target.password ? "********" : "");
      setActive(!!target.active);
    }
  }, [isEdit, target]);

  const saveUsers = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setUsers(list);
  };

  const genId = () => {
    const nums = users
      .map(u => Number(String(u.id).replace(/\D/g, "")))
      .filter(n => !Number.isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return "U" + String(next).padStart(3, "0");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!empName.trim() || !username.trim()) return;

    if (isEdit && target) {
      // ถ้า password ยังเป็น ******** ให้คงเดิม
      const finalPw = password === "********" ? target.password : password;
      const next = users.map(u =>
        u.id === target.id
          ? { ...u, empName, username, role, password: finalPw, active }
          : u
      );
      saveUsers(next);
    } else {
      const newUser = {
        id: genId(),
        empName,
        username,
        role,
        password,
        active,
      };
      saveUsers([newUser, ...users]);
    }

    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      navigate("/dashboard/users");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-700"
            title="กลับ"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M15 18L9 12l6-6v12Z"/></svg>
          </button>
          <h1 className="text-2xl font-extrabold">
            {isEdit ? "แก้ไขข้อมูลผู้ใช้" : "เพิ่มผู้ใช้งาน"}
          </h1>
        </div>

        {/* Card */}
        <form onSubmit={onSubmit} className="bg-white rounded-2xl ring-1 ring-black/10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">ชื่อพนักงาน</label>
              <input
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="กรอกชื่อพนักงาน"
                className="w-full h-11 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">สิทธิ์การใช้งาน</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isEdit} // ตามภาพ: โหมดแก้ไข disabled
                className="w-full h-11 px-3 border rounded-lg outline-none disabled:bg-gray-100"
              >
                <option value="" disabled>เลือกสิทธิ์การใช้งาน</option>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">ชื่อผู้ใช้</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้"
                className="w-full h-11 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                className="w-full h-11 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>เปิดใช้งาน</span>
              </label>
            </div>
          </div>

          {/* ปุ่ม */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="submit" className="px-5 h-11 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold">
              บันทึก
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/users")}
              className="px-5 h-11 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>

      {/* Modal บันทึกสำเร็จ */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[min(460px,92vw)] text-center shadow-lg">
            <div className="text-lg font-extrabold mb-2">ผลการบันทึกข้อมูล</div>
            <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
              ✓
            </div>
            <div>บันทึกข้อมูลผู้ใช้สำเร็จ</div>
          </div>
        </div>
      )}
    </div>
  );
}
