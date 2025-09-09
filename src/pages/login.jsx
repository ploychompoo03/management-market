import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_KEY = "mm_auth";
const USERS_KEY = "mm_users";

//  fallback แอดมิน (เผื่อยังไม่มีข้อมูลใน mm_users)
const FALLBACK_ADMIN = {
  username: "admin",
  password: "12345678",
  role: "แอดมิน",
  active: true,
};

//  fallback ผู้ใช้ทั่วไป
const FALLBACK_USER = {
  username: "user",
  password: "12345678",
  role: "พนักงานขาย",
  active: true,
};

export default function Login() {
  const [email, setEmail] = useState(""); // ใช้เป็น username ก็ได้
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // อ่านผู้ใช้จาก localStorage
    const raw = localStorage.getItem(USERS_KEY);
    const list = raw ? JSON.parse(raw) : [];

    // หา user จาก username (หรือจะเทียบ email field ก็ปรับได้)
    const user = list.find((u) => u.username === email && u.password === password);

    // เคสเจอใน mm_users
    if (user) {
      if (user.active === false) {
        alert("บัญชีนี้ถูกปิดใช้งาน");
        return;
      }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ id: user.id, username: user.username, role: user.role })
      );
      // แอดมิน → users, ทั่วไป → dashboard
      navigate(user.role === "แอดมิน" ? "/dashboard/users" : "/dashboard");
      return;
    }

    // Fallback admin
    if (
      (email === "ploy@example.com" && password === "12345678") ||
      (email === FALLBACK_ADMIN.username && password === FALLBACK_ADMIN.password)
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ username: "admin", role: "แอดมิน" })
      );
      navigate("/dashboard/users");
      return;
    }

    //  Fallback ผู้ใช้ทั่วไป
    if (
      (email === "user@example.com" && password === FALLBACK_USER.password) ||
      (email === FALLBACK_USER.username && password === FALLBACK_USER.password)
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ username: "user", role: "พนักงานขาย" })
      );
      navigate("/dashboard");
      return;
    }

    alert("อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT: form area (cream background) */}
      <div className="bg-[#FFF3E3] flex items-center justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0b1b3b] mb-8">
            ลงชื่อเข้าใช้ระบบ
          </h1>

          {/* Username */}
          <div className="relative mb-5">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0b1b3b]/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username หรือ Email"
              className="w-full pl-12 pr-4 py-4 rounded-full border border-[#0b1b3b]/15 bg-white/90 text-[#0b1b3b] placeholder-[#0b1b3b]/60 focus:outline-none focus:ring-2 focus:ring-[#0b1b3b] focus:border-transparent"
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-8">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0b1b3b]/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 rounded-full border border-[#0b1b3b]/15 bg-white/90 text-[#0b1b3b] placeholder-[#0b1b3b]/60 focus:outline-none focus:ring-2 focus:ring-[#0b1b3b] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#0b1b3b] text-white text-xl font-semibold hover:brightness-110 transition"
          >
            ลงชื่อเข้าใช้
          </button>
        </form>
      </div>

      {/* RIGHT: branding */}
      <div className="bg-[#F56E74] flex items-center justify-center px-6 py-10">
        <div className="text-center">
          <img src="/path/to/logo.png" alt="Logo ระฆังทอง" className="mx-auto w-72 mb-6" />
          <div className="font-extrabold tracking-wider text-[56px] md:text-[72px] text-[#D9C44A] mb-4">
            ระฆังทอง
          </div>
          <div className="text-white/90 tracking-[0.5em] text-[22px] md:text-[26px]">
            GROCERY&nbsp;STORE
          </div>
        </div>
      </div>
    </div>
  );
}
