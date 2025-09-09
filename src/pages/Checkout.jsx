// src/pages/Checkout.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const cashRef = useRef(null);

  // รับ payload จาก sessionStorage (CartPage เซฟไว้ก่อน navigate)
  const { items, vatRate } = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("mm_checkout");
      const p = raw ? JSON.parse(raw) : null;
      return {
        items: Array.isArray(p?.items) ? p.items : [],
        vatRate: Number(p?.vatRate) || 0,
      };
    } catch {
      return { items: [], vatRate: 0 };
    }
  }, []);

  const subTotal = useMemo(
    () => items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
    [items]
  );
  const vat = useMemo(() => +(subTotal * (vatRate / 100)).toFixed(2), [subTotal, vatRate]);
  const grand = useMemo(() => +(subTotal + vat).toFixed(2), [subTotal, vat]);

  const [cash, setCash] = useState("");
  const [method, setMethod] = useState("");
  const [show, setShow] = useState(false);

  const needCash = method === "เงินสด";
  const enoughCash = !needCash || (Number(cash) || 0) >= grand;
  const change = Math.max(0, (Number(cash) || 0) - grand);
  const canSubmit = items.length > 0 && method && enoughCash;

  // โฟกัสช่องเงินสดอัตโนมัติเมื่อเลือก "เงินสด"
  useEffect(() => {
    if (method === "เงินสด") cashRef.current?.focus();
  }, [method]);

  const confirmPay = () => {
    if (!canSubmit) return;
    setShow(true);
    // TODO: บันทึกประวัติ/สต็อกที่นี่
  };

  const closeModal = () => {
    setShow(false);
    sessionStorage.removeItem("mm_checkout");
    navigate("/dashboard/pos");
  };

  // ถ้าไม่มีรายการ กลับ
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF1E6] p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/dashboard/pos")}
            className="mb-4 inline-flex items-center gap-2 text-green-700 hover:text-green-800"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            กลับไป POS
          </button>
          <div className="bg-white p-6 rounded-2xl ring-1 ring-black/5">ไม่พบตะกร้าสินค้า</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-2xl font-extrabold">ชำระเงิน</h1>
        </div>

        {/* ตารางรายการ */}
        <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4">
          <div className="overflow-hidden rounded-xl ring-1 ring-black/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#C80036] text-white">
                  <th className="px-4 py-3 text-left">สินค้า</th>
                  <th className="px-4 py-3 text-center">จำนวน</th>
                  <th className="px-4 py-3 text-center">ราคา</th>
                  <th className="px-4 py-3 text-center">รวม</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3">{it.name}</td>
                    <td className="px-4 py-3 text-center">{it.qty}</td>
                    <td className="px-4 py-3 text-center">{Number(it.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {(Number(it.price) * Number(it.qty)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* สรุปยอด */}
          <div className="mt-4 flex justify-end text-lg font-extrabold leading-8">
            <div className="text-right">
              <div>ยอดรวม : {subTotal.toLocaleString()} บาท</div>
              <div>VAT({vatRate}%) : {vat.toLocaleString()} บาท</div>
              <div>ยอดสุทธิ : {grand.toLocaleString()} บาท</div>
            </div>
          </div>
        </div>

        {/* ฟอร์มจ่าย */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <div className="font-extrabold mb-2">จำนวนเงินที่รับ</div>
            <input
              ref={cashRef}
              type="text"
              inputMode="decimal"
              pattern="\d*([.,]\d{0,2})?"
              placeholder="กรอกจำนวนเงินที่ได้รับ เช่น 100.00"
              value={cash}
              onChange={(e) => {
                // ตัดคอมมา เก็บเป็นสตริง คำนวณเป็นตัวเลขตอนใช้งาน
                setCash(e.target.value.replace(/,/g, ""));
              }}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (!Number.isNaN(n)) setCash(n.toFixed(2));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  e.preventDefault();
                  confirmPay();
                }
              }}
              className="w-full h-11 px-3 rounded-lg border border-black/20 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {needCash && !enoughCash && (
              <div className="mt-1 text-sm text-red-600">เงินสดไม่พอสำหรับยอดสุทธิ</div>
            )}
            {needCash && Number(cash) > 0 && (
              <div className="mt-1 text-sm text-gray-600">
                เงินทอนโดยประมาณ: {change.toLocaleString()} บาท
              </div>
            )}
          </div>

          <div>
            <div className="font-extrabold mb-2">วิธีชำระเงิน</div>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-black/20 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">เลือกวิธีชำระเงิน</option>
              <option value="เงินสด">เงินสด</option>
              <option value="โอนเงิน">โอนเงิน</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={confirmPay}
              disabled={!canSubmit}
              className="px-5 h-11 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              ยืนยันชำระเงิน
            </button>
          </div>
        </div>
      </div>

      {/* Modal สำเร็จ */}
      {show && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[min(520px,92vw)] text-center shadow-lg">
            <div className="text-lg font-extrabold mb-2">ผลการทำรายการ</div>
            <div className="mx-auto my-3 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">✓</div>
            <div className="font-semibold">ชำระเงินสำเร็จ</div>
            {method === "เงินสด" && <div className="mt-1">เงินทอน : {change.toLocaleString()} บาท</div>}
            <div className="mt-4">
              <button onClick={closeModal} className="px-6 h-10 rounded-lg bg-green-600 text-white hover:bg-green-700">
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
