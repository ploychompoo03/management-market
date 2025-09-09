// src/pages/SalesHistory.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const mockData = [
  { id: 1, date: "2025-07-17", invoice: "#INV-00123", total: 75,  payment: "เงินสด"   },
  { id: 2, date: "2025-07-17", invoice: "#INV-00122", total: 350, payment: "พร้อมเพย์" },
];

const THB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", { style: "currency", currency: "THB" });

export default function SalesHistory() {
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");
  const [payment, setPayment] = useState("");
  const [sales] = useState(mockData);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const matchQ =
        !q ||
        s.invoice.toLowerCase().includes(q.toLowerCase()) ||
        String(s.id).includes(q);
      const matchDate = !date || s.date === date;
      const matchPayment = !payment || s.payment === payment;
      return matchQ && matchDate && matchPayment;
    });
  }, [q, date, payment, sales]);

  const resetFilters = () => {
    setQ("");
    setDate("");
    setPayment("");
  };

  const th = "px-4 py-3 font-semibold";
  const td = "px-4 py-3";

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">ประวัติการขาย</h1>
        <p className="text-sm text-gray-600 mt-1">
          พบทั้งหมด {filtered.length} รายการ
        </p>
      </header>

      {/* Search Card */}
      <form
        className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 mb-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาเลขที่ใบเสร็จ หรือหมายเลขลำดับ"
            className="h-11 px-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 px-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="h-11 px-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">ชำระเงิน</option>
            <option value="เงินสด">เงินสด</option>
            <option value="พร้อมเพย์">พร้อมเพย์</option>
          </select>

          <div className="flex gap-2">
            <button
              className="h-11 px-5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 w-full sm:w-auto"
              type="submit"
            >
              ค้นหา
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="h-11 px-5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 w-full sm:w-auto"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#C80036] text-white">
                <th className={`${th} text-left`}>ลำดับ</th>
                <th className={`${th} text-left`}>วันที่</th>
                <th className={`${th} text-left`}>เลขที่ใบเสร็จ</th>
                <th className={`${th} text-right`}>ยอดรวม</th>
                <th className={`${th} text-left`}>ช่องทางชำระ</th>
                <th className={`${th} text-left`}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100/70 transition-colors"
                >
                  <td className={td}>{i + 1}</td>
                  <td className={td}>{s.date}</td>
                  <td className={td}>{s.invoice}</td>
                  <td className={`${td} text-right`}>{THB(s.total)}</td>
                  <td className={td}>{s.payment}</td>
                  <td className={td}>
                    <Link
                      to={`/dashboard/saleshistory/${s.id}`}
                      className="px-3 py-1 inline-block rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
