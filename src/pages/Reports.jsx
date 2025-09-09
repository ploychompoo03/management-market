// src/pages/Reports.jsx
import { useMemo, useState } from "react";

/** ---------- ตัวอย่างข้อมูล ---------- */
// สินค้า (ไว้ใช้หา category และต้นทุน)
const PRODUCTS = [
  { id: "001", name: "น้ำดื่ม", category: "เครื่องดื่ม", cost: 6, price: 10 },
  { id: "002", name: "โค้ก 1.25 ลิตร", category: "เครื่องดื่ม", cost: 28, price: 35 },
  { id: "003", name: "บะหมี่ซอง", category: "อาหารสำเร็จรูป", cost: 5, price: 7 },
  { id: "004", name: "ผงซักฟอก", category: "ของใช้ในครัวเรือน", cost: 35, price: 45 },
];

// ออเดอร์ขาย (mock)
const ORDERS = [
  {
    id: "INV-0001",
    date: "2025-07-17",
    items: [
      { productId: "001", qty: 30 },
      { productId: "003", qty: 8 },
    ],
  },
  {
    id: "INV-0002",
    date: "2025-07-17",
    items: [
      { productId: "001", qty: 20 },
      { productId: "002", qty: 10 },
    ],
  },
  {
    id: "INV-0003",
    date: "2025-07-16",
    items: [{ productId: "004", qty: 5 }],
  },
];

const THB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", { style: "currency", currency: "THB" });

const categories = ["ทั้งหมด", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

export default function Reports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [cat, setCat] = useState("ทั้งหมด");

  // รวมยอดขายรายสินค้า จากออเดอร์ -> รายงานสต็อก
  const rows = useMemo(() => {
    // เช็กวันที่
    const inRange = (d) => {
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    };

    const qtyByProduct = new Map();
    const ordersInRange = ORDERS.filter((o) => inRange(o.date));

    for (const o of ordersInRange) {
      for (const it of o.items) {
        const prod = PRODUCTS.find((p) => p.id === it.productId);
        if (!prod) continue;
        if (cat !== "ทั้งหมด" && prod.category !== cat) continue;

        const prev = qtyByProduct.get(it.productId) || 0;
        qtyByProduct.set(it.productId, prev + it.qty);
      }
    }

    // แปลงเป็น array ของแถวตาราง
    const result = Array.from(qtyByProduct.entries())
      .map(([pid, qty]) => {
        const prod = PRODUCTS.find((p) => p.id === pid);
        if (!prod) return null; // กัน error
        const total = qty * prod.price;
        const cost = qty * prod.cost;
        const profit = total - cost;
        return {
          id: pid,
          name: prod.name,
          category: prod.category,
          qty,
          total,
          cost,
          profit,
        };
      })
      .filter(Boolean);

    result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  }, [start, end, cat]);

  // สรุป
  const summary = useMemo(() => {
    const totalSales = rows.reduce((s, r) => s + r.total, 0);
    const totalProfit = rows.reduce((s, r) => s + r.profit, 0);

    const orderCount = ORDERS.filter((o) => {
      const inRange =
        (!start || o.date >= start) && (!end || o.date <= end);
      if (!inRange) return false;
      if (cat === "ทั้งหมด") return true;
      return o.items.some((it) => {
        const prod = PRODUCTS.find((p) => p.id === it.productId);
        return prod?.category === cat;
      });
    }).length;

    return { totalSales, orderCount, totalProfit };
  }, [rows, start, end, cat]);

  const resetFilters = () => {
    setStart("");
    setEnd("");
    setCat("ทั้งหมด");
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* ฟิลเตอร์ */}
        <div className="bg-white rounded-2xl ring-1 ring-black/10 p-4">
          <h2 className="font-bold mb-3">ตัวกรองรายงาน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600">วันที่เริ่มต้น</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full h-11 mt-1 px-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">วันที่สิ้นสุด</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full h-11 mt-1 px-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">ประเภทสินค้า</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full h-11 mt-1 px-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ตารางรายงาน */}
        <div className="bg-white rounded-2xl ring-1 ring-black/10 overflow-hidden">
          <div className="px-4 pt-4 pb-2 font-bold">รายงานสต็อก</div>
          <div className="px-4 pb-4">
            <div className="rounded-xl overflow-hidden border border-black/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#C80036] text-white">
                    <th className="px-4 py-3 text-left">รหัสสินค้า</th>
                    <th className="px-4 py-3 text-left">ชื่อสินค้า</th>
                    <th className="px-4 py-3 text-right">จำนวนที่ขาย</th>
                    <th className="px-4 py-3 text-right">ยอดรวม (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-3">{r.id}</td>
                      <td className="px-4 py-3">{r.name}</td>
                      <td className="px-4 py-3 text-right">{r.qty}</td>
                      <td className="px-4 py-3 text-right">{THB(r.total)}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        ไม่พบข้อมูลในช่วงที่เลือก
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* การ์ดสรุป */}
        <div className="bg-white rounded-2xl ring-1 ring-black/10 p-4">
          <div className="font-bold mb-3">รายงานรายได้</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="ยอดขายรวม" value={THB(summary.totalSales)} bg="bg-emerald-100" />
            <StatCard label="จำนวนออร์เดอร์" value={`${summary.orderCount} รายการ`} bg="bg-sky-100" />
            <StatCard label="กำไรสุทธิ" value={THB(summary.totalProfit)} bg="bg-pink-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, bg }) {
  return (
    <div className={`rounded-xl ${bg} p-4 ring-1 ring-black/10`}>
      <div className="text-gray-700">{label}</div>
      <div className="text-xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
