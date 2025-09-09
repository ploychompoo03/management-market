// src/pages/ProductForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "mm_products";

const CATEGORIES = ["เครื่องดื่ม","เครื่องปรุง","อาหารแห้ง","ของใช้ส่วนตัว","ของใช้ในบ้าน"];
const UNITS = ["ขวด","ซอง","กล่อง","ชิ้น","แพ็ค","ถุง"];

export default function ProductForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("edit");

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setProducts(raw ? JSON.parse(raw) : []);
  }, []);

  const editing = useMemo(
    () => products.find((p) => p.id === editId),
    [products, editId]
  );

  const [form, setForm] = useState({
    id: "", name: "", barcode: "", category: "", qty: "", unit: "",
    cost: "", price: "", note: ""
  });
  const [showOK, setShowOK] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        id: editing.id,
        name: editing.name || "",
        barcode: editing.barcode || "",
        category: editing.category || "",
        qty: String(editing.stock ?? ""),
        unit: editing.unit || "",
        cost: String(editing.cost ?? ""),
        price: String(editing.price ?? ""),
        note: editing.note || "",
      });
    }
  }, [editing]);

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const save = () => {
    const payload = {
      id: editing ? editing.id : genId(products),
      name: form.name.trim(),
      barcode: form.barcode.trim(),
      category: form.category,
      stock: Number(form.qty || 0),
      unit: form.unit,
      cost: Number(form.cost || 0),
      price: Number(form.price || 0),
      note: form.note.trim(),
    };
    const next = editing
      ? products.map((p) => (p.id === editing.id ? payload : p))
      : [payload, ...products];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setShowOK(true);
    setTimeout(() => navigate("/dashboard/products"), 900);
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <div className="max-w-4xl mx-auto">
        {/* หัว: ปุ่มย้อนกลับวงกลม + ชื่อหน้า */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-700"
            title="กลับ"
          >
            {/* ลูกศรซ้าย */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M15 18l-6-6 6-6v12Z"/></svg>
          </button>
          <h1 className="text-2xl font-extrabold">{editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h1>
        </div>

        <div className="bg-white/95 rounded-2xl border border-black/10 p-6">
          {/* ฟอร์มตามเลย์เอาต์ในภาพ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">ชื่อสินค้า</label>
              <input
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border px-3"
              />
            </div>
            <div>
              <label className="font-semibold">รหัสบาร์โค้ด</label>
              <input
                value={form.barcode}
                onChange={(e) => onChange("barcode", e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border px-3"
              />
            </div>

            <div>
              <label className="font-semibold">หมวดหมู่</label>
              <select
                value={form.category}
                onChange={(e) => onChange("category", e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border px-3"
              >
                <option value="">— เลือก —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold">จำนวน</label>
                <input
                  type="number"
                  value={form.qty}
                  onChange={(e) => onChange("qty", e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border px-3"
                />
              </div>
              <div>
                <label className="font-semibold">หน่วย</label>
                <select
                  value={form.unit}
                  onChange={(e) => onChange("unit", e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border px-3"
                >
                  <option value="">— เลือก —</option>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold">ราคาต้นทุน</label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => onChange("cost", e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border px-3"
              />
            </div>
            <div>
              <label className="font-semibold">ราคาขาย</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => onChange("price", e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border px-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold">คำอธิบาย</label>
              <textarea
                rows={6}
                value={form.note}
                onChange={(e) => onChange("note", e.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2 resize-y"
              />
            </div>
          </div>

          {/* ปุ่มบันทึก/ยกเลิก */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={save}
              className="min-w-32 h-11 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              บันทึก
            </button>
            <button
              onClick={() => navigate("/dashboard/products")}
              className="min-w-32 h-11 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>

      {/* โมดัลผลการบันทึก */}
      {showOK && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
          <div className="w-[min(480px,92vw)] bg-white rounded-2xl shadow-xl p-6 text-center">
            <h3 className="text-xl font-extrabold mb-2">ผลการบันทึกข้อมูล</h3>
            <div className="mx-auto my-3 w-10 h-10 rounded-full bg-green-100 grid place-items-center">
              <div className="w-5 h-5 rounded-full bg-green-500" />
            </div>
            <p className="text-gray-700">บันทึกข้อมูล{editing ? "แก้ไข" : "เพิ่มสินค้า"}สำเร็จ</p>
          </div>
        </div>
      )}
    </div>
  );
}

function genId(list) {
  const nums = list
    .map((x) => Number(String(x.id).replace(/\D/g, "")))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return "P" + String(next).padStart(3, "0");
}
