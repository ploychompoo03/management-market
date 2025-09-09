// src/pages/ProductsList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const STORAGE_KEY = "mm_products";

const DEFAULT_PRODUCTS = [
  { id: "P001", name: "น้ำดื่ม 600 ml",   category: "เครื่องดื่ม",  barcode: "88562435921",  price: 10, stock: 120 },
  { id: "P002", name: "โค้ก 1.25 ลิตร",   category: "เครื่องดื่ม",  barcode: "885195912312", price: 35, stock: 30  },
  { id: "P003", name: "น้ำปลาแท้ 700 ml",  category: "เครื่องปรุง",  barcode: "885123456789", price: 48, stock: 45  },
  { id: "P004", name: "ผงซักฟอก 900 g",   category: "ของใช้ในบ้าน", barcode: "885998877665", price: 45, stock: 85  },
  { id: "P005", name: "น้ำส้ม 250 ml",     category: "เครื่องดื่ม",  barcode: "8851111222333",price: 20, stock: 20  },
  { id: "P006", name: "บะหมี่กึ่งสำเร็จรูป",category: "อาหารแห้ง", barcode: "885222333444", price: 50, stock: 12  },
  { id: "P007", name: "นมกล่อง UHT",      category: "เครื่องดื่ม",  barcode: "885333344455", price: 30, stock: 15  },
  { id: "P008", name: "แชมพู 300 ml",      category: "ของใช้ส่วนตัว", barcode: "885555666777", price: 18, stock: 75  },
  { id: "P009", name: "ยาสีฟัน 150 กรัม",  category: "ของใช้ส่วนตัว", barcode: "8856666777888",price: 22, stock: 39  },
  { id: "P010", name: "ทิชชู่เช็ดหน้า 20 แผ่น", category: "ของใช้ในบ้าน", barcode: "8857777888999",price: 35, stock: 25  },
];

function useProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setProducts(JSON.parse(raw));
    else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    }
  }, []);
  const save = (list) => {
    setProducts(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };
  return { products, save };
}

// ไอคอนเล็ก (SVG) แบบ inline – ไม่ต้องลงไลบรารี
const Icon = {
  Edit: (p) => (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 ${p.className||""}`} fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm2.92 2.83H5v-.92l8.06-8.06.92.92L5.92 20.08ZM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82Z"/>
    </svg>
  ),
  Document: (p) => (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 ${p.className||""}`} fill="currentColor">
      <path d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5z"/>
    </svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 ${p.className||""}`} fill="currentColor">
      <path d="M6 7h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3-5h6l1 2h4v2H2V4h4l1-2Z"/>
    </svg>
  ),
  ChevronRight: (p) => (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 ${p.className||""}`} fill="currentColor">
      <path d="M9 6l6 6-6 6V6Z"/>
    </svg>
  ),
};

export default function ProductsList() {
  const { products, save } = useProducts();
  const [q, setQ] = useState("");
  const [confirmId, setConfirmId] = useState(null); // ✅ state สำหรับ popup ลบ
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      [p.id, p.name, p.category, p.barcode].some((v) =>
        String(v || "").toLowerCase().includes(s)
      )
    );
  }, [q, products]);

  const productById = (id) => products.find((p) => p.id === id);

  const requestDelete = (id) => setConfirmId(id); // เปิด popup
  const confirmDelete = () => {
    if (!confirmId) return;
    save(products.filter((p) => p.id !== confirmId));
    setConfirmId(null);
  };

  const onView = (p) => {
    navigate(`/dashboard/products/${p.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-4">การจัดการสินค้า</h1>

        {/* แถวค้นหา + ปุ่มเพิ่ม */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหาชื่อสินค้า/แสกนบาร์โค้ด/รหัสบาร์โค้ด"
              className="w-full h-11 px-4 rounded-lg border border-black/20 bg-white/80 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Link
            to="/dashboard/products/new"
            className="h-11 px-6 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center justify-center"
          >
            + เพิ่มสินค้า
          </Link>
        </div>

        {/* ตาราง */}
        <div className="rounded-2xl border border-black/20 bg-white/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/5">
              <tr className="text-left">
                <th className="px-4 py-3">รหัสสินค้า</th>
                <th className="px-4 py-3">ชื่อสินค้า</th>
                <th className="px-4 py-3">หมวดหมู่</th>
                <th className="px-4 py-3">รหัสบาร์โค้ด</th>
                <th className="px-4 py-3 text-right">ราคาขาย</th>
                <th className="px-4 py-3 text-right">คงเหลือ</th>
                <th className="px-4 py-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-black/10">
                  <td className="px-4 py-3 font-medium">{p.id}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.barcode}</td>
                  <td className="px-4 py-3 text-right">{Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(p)}
                        className="p-1.5 rounded hover:bg-black/5"
                        title="ดูรายละเอียดสินค้า"
                      >
                        <Icon.Document />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/products/new?edit=${p.id}`)}
                        className="p-1.5 rounded hover:bg-black/5"
                        title="แก้ไข"
                      >
                        <Icon.Edit />
                      </button>
                      <button
                        onClick={() => requestDelete(p.id)}  // ✅ เปิด popup ยืนยัน
                        className="p-1.5 rounded hover:bg-black/5 text-red-600"
                        title="ลบ"
                      >
                        <Icon.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    ไม่พบสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* เพจจิเนชัน (ตัวอย่างปุ่มกลาง) */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button className="w-8 h-8 rounded-lg border border-black/30 bg-white/70">1</button>
          <button className="w-8 h-8 rounded-lg border border-black/30 bg-white/70">
            <Icon.ChevronRight />
          </button>
        </div>
      </div>

      {/* ✅ Modal ยืนยันการลบ */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-2xl w-[min(520px,92vw)] p-6 shadow-lg"
          >
            <div className="text-center">
              <div className="text-lg font-extrabold">ต้องการลบสินค้านี้หรือไม่?</div>
              <div className="mt-2 text-gray-700">
                {productById(confirmId)?.name}{" "}
                <span className="text-gray-500">({productById(confirmId)?.id})</span>
              </div>

              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={confirmDelete}
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
  );
}

function genId(list) {
  // ดึงจาก localStorage ด้วย
  const raw = localStorage.getItem("mm_products");
  const all = raw ? JSON.parse(raw) : [];
  const merged = [...all, ...(list || [])]; // รวมทั้ง list ที่ส่งมากับ localStorage

  const nums = merged
    .map((x) => Number(String(x.id).replace(/\D/g, "")))
    .filter((n) => !isNaN(n));

  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return "P" + String(next).padStart(3, "0");
}
