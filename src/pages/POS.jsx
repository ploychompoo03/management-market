// src/pages/CartPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCTS = [
  { id: "p001", barcode: "8850001112223", name: "ผัดซีอิ๊วเส้นใหญ่", price: 50 },
  { id: "p002", barcode: "8850001112224", name: "ชาไทยเย็น", price: 35 },
  { id: "p003", barcode: "8850001112225", name: "โค้กกระป๋อง", price: 20 },
  { id: "p004", barcode: "8850001112226", name: "ข้าวกะเพราไข่ดาว", price: 65 },
];

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [hint, setHint] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // อ่านค่า VAT ที่ตั้งไว้ (ถ้าไม่มีเป็น 0)
  const vatRate = useMemo(() => {
    try {
      const raw = localStorage.getItem("mm_settings");
      const v = raw ? JSON.parse(raw)?.vat : 0;
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    } catch {
      return 0;
    }
  }, []);

  const total = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );

  useEffect(() => { inputRef.current?.focus(); }, []);

  const resetCart = () => setItems([]);

  const checkout = () => {
    if (items.length === 0) return;
    // เก็บ payload กันพังเวลารีเฟรช/เปิดตรง
    sessionStorage.setItem("mm_checkout", JSON.stringify({ items, vatRate }));
    navigate("/dashboard/pos/checkout");
  };

  const addItem = (prod, qty = 1) => {
    setItems((cur) => {
      const i = cur.findIndex((x) => x.id === prod.id);
      if (i !== -1) {
        const copy = [...cur];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...cur, { ...prod, qty }];
    });
  };

  const removeItem = (id) => setItems((cur) => cur.filter((x) => x.id !== id));
  const changeQty = (id, d) =>
    setItems((cur) =>
      cur
        .map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x))
        .filter((x) => x.qty > 0)
    );

  const addByQuery = (raw) => {
    const q = raw.trim();
    if (!q) return;
    let prod = PRODUCTS.find((p) => p.barcode === q);
    if (!prod) {
      const lower = q.toLowerCase();
      prod = PRODUCTS.find((p) => p.name.toLowerCase().includes(lower));
    }
    if (prod) {
      addItem(prod, 1);
      setHint(`เพิ่ม "${prod.name}" แล้ว`);
    } else {
      setHint("ไม่พบสินค้า");
    }
    setTimeout(() => setHint(""), 1500);
    setQuery("");
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addByQuery(query); }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 px-4 py-3 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="ค้นหาสินค้าหรือสแกนบาร์โค้ด…"
          className="flex-1 text-sm outline-none placeholder:text-gray-400"
        />
        <button onClick={() => addByQuery(query)} className="p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>

      {hint && <div className="mt-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">{hint}</div>}

      {/* Cart box */}
      <div className="mt-4 bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6">
        <h3 className="font-extrabold text-lg sm:text-xl mb-3">ตะกร้าสินค้า</h3>

        <div className="rounded-lg overflow-hidden ring-1 ring-[#C80036]/20">
          <div className="bg-[#C80036] text-white grid grid-cols-[1fr_110px_110px_130px_80px] px-4 py-2 text-sm font-semibold">
            <div>สินค้า</div><div className="text-center">จำนวน</div><div className="text-center">ราคา</div>
            <div className="text-center">รวม</div><div className="text-center">ลบ</div>
          </div>

          {items.length === 0 ? (
            <div className="h-28 grid place-items-center text-gray-400 bg-white">ไม่มีข้อมูล</div>
          ) : (
            <ul className="bg-white">
              {items.map((it) => (
                <li key={it.id} className="grid grid-cols-[1fr_110px_110px_130px_80px] px-4 py-3 text-sm odd:bg-white even:bg-gray-50">
                  <div>{it.name}</div>
                  <div className="text-center flex items-center justify-center gap-2">
                    <button onClick={() => changeQty(it.id, -1)} className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300">-</button>
                    <span className="w-8 text-center">{it.qty}</span>
                    <button onClick={() => changeQty(it.id, +1)} className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300">+</button>
                  </div>
                  <div className="text-center">฿ {it.price.toLocaleString()}</div>
                  <div className="text-center font-semibold">฿ {(it.price * it.qty).toLocaleString()}</div>
                  <div className="text-center">
                    <button onClick={() => removeItem(it.id)} className="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">ลบ</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Summary + buttons */}
        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-lg sm:text-xl font-extrabold">รวมทั้งหมด : ฿ {total.toLocaleString()}</div>
          <div className="flex gap-3">
            <button onClick={resetCart} disabled={items.length === 0}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 disabled:opacity-50">
              เริ่มต้นใหม่
            </button>
            <button onClick={checkout} disabled={items.length === 0}
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50">
              ชำระเงิน
            </button>
          </div>
        </div>
      </div>

      {/* ชุดปุ่มเพิ่มเร็วสำหรับทดสอบ */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="mb-2 font-semibold">ทดสอบเร็ว:</div>
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map((p) => (
            <button key={p.id} onClick={() => addItem(p)}
              className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              title={`barcode: ${p.barcode}`}>
              + {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
