// src/pages/Settings.jsx
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "mm_settings";

const DEFAULTS = {
  shopName: "",
  logo: "",      // dataURL ของโลโก้
  currency: "",
  vat: "",
  language: "",
};

// เปลี่ยนธีมทั้งแอปด้วยการใส่ class บน <html> (ไม่มี theme -> ใช้ light)
function applyTheme(theme) {
  const html = document.documentElement;
  html.classList.remove("theme-light", "theme-dark", "theme-pink");
  const t = theme || "light";
  html.classList.add(`theme-${t}`);
}

export default function Settings() {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  // โหลดค่า + ใช้ธีมที่บันทึกไว้ทันที (ถ้าไม่มี theme จะใช้ light)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const next = { ...DEFAULTS, ...parsed };
        setForm(next);
        applyTheme(next.theme);
      } catch {
        applyTheme(DEFAULTS.theme);
      }
    } else {
      applyTheme(DEFAULTS.theme);
    }
  }, []);

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  // --- Logo upload helpers ---
  const readAsDataURL = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(String(reader.result || ""));
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  // ❗เวอร์ชันไม่จำกัดขนาดรูป (ตัดการเช็ก size ออก)
  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    const dataURL = await readAsDataURL(file);
    setField("logo", dataURL);
  };

  const onPickLogo = async (e) => {
    await handleFiles(e.target.files);
    // clear เพื่อให้เลือกไฟล์เดิมซ้ำได้
    e.target.value = "";
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    await handleFiles(e.dataTransfer?.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const removeLogo = () => setField("logo", "");

  const validate = () => {
    if (
      form.vat !== "" &&
      (isNaN(Number(form.vat)) || Number(form.vat) < 0 || Number(form.vat) > 100)
    ) {
      alert("VAT ต้องเป็นตัวเลขระหว่าง 0 ถึง 100");
      return false;
    }
    return true;
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-4">ตั้งค่าระบบ</h1>

        <form
          onSubmit={onSave}
          className="bg-white rounded-2xl ring-1 ring-black/10 p-5"
        >
          {/* ชื่อร้านค้า */}
          <FieldLabel>ชื่อร้านค้า</FieldLabel>
          <input
            value={form.shopName}
            onChange={(e) => setField("shopName", e.target.value)}
            placeholder="กรอกชื่อร้าน"
            className="w-full h-11 mb-4 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />

          {/* โลโก้ร้านค้า - อัปโหลด/ลากวาง + พรีวิว */}
          <FieldLabel>โลโก้ร้านค้า</FieldLabel>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`mb-4 rounded-xl border-2 border-dashed p-4 flex items-center gap-4 transition
              ${dragOver ? "border-indigo-500 bg-indigo-50/50" : "border-black/20"}
            `}
          >
            <div className="h-16 w-16 rounded-lg bg-white ring-1 ring-black/10 overflow-hidden grid place-items-center">
              {form.logo ? (
                <img
                  src={form.logo}
                  alt="logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-gray-400" fill="currentColor">
                  <path d="M19 13v6H5v-6H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-2Zm-6-1 3.5 3.5-1.42 1.42L13 15.83l-2.09 2.09-1.41-1.42L13 12ZM12 3l4 4h-3v5h-2V7H8l4-4Z" />
                </svg>
              )}
            </div>

            <div className="flex-1">
              <div className="text-sm text-gray-600">
                ลากรูปมาวางที่นี่ หรือกดปุ่มเพื่ออัปโหลด (PNG/JPG)
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-3 h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {form.logo ? "เปลี่ยนโลโก้" : "อัปโหลดโลโก้"}
                </button>
                {form.logo && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="px-3 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    ลบโลโก้
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickLogo}
              />
            </div>
          </div>

          {/* สกุลเงิน */}
          <FieldLabel>สกุลเงิน</FieldLabel>
          <select
            value={form.currency}
            onChange={(e) => setField("currency", e.target.value)}
            className="w-full h-11 mb-4 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">เลือกสกุลเงิน</option>
            <option value="THB-บาท">THB-บาท</option>
          </select>

          {/* VAT (%) */}
          <FieldLabel>Vat(%)</FieldLabel>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.vat}
            onChange={(e) => setField("vat", e.target.value)}
            placeholder="กรอกภาษีรายปี"
            className="w-full h-11 mb-4 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />

          {/* ภาษา */}
          <FieldLabel>ภาษา</FieldLabel>
          <select
            value={form.language}
            onChange={(e) => setField("language", e.target.value)}
            className="w-full h-11 mb-4 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">เลือกภาษา</option>
            <option value="th">ไทย</option>
          </select>

          {/* ปุ่ม */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </button>
          </div>
        </form>
      </div>

      {/* โมดัลบันทึกสำเร็จ */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[min(420px,92vw)] text-center shadow-lg">
            <div className="text-lg font-extrabold mb-2">บันทึกสำเร็จ</div>
            <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
              ✓
            </div>
            <div>บันทึกการตั้งค่าเรียบร้อย</div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children }) {
  return <div className="text-sm font-semibold text-gray-800 mb-1">{children}</div>;
}
