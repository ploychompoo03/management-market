// src/pages/SaleDetail.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RotateCw, FileDown, Trash2 } from "lucide-react"; // เพิ่มไอคอนนะคะอ้วนๆ
import { ArrowLeft } from "lucide-react"; 

const THB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", { style: "currency", currency: "THB" });

// ✅ ตัวอย่างข้อมูลใบเสร็จ (mock)
const SALES = [
  {
    id: 1,
    invoice: "#INV-00123",
    date: "2025-07-17",
    cashier: "วันวาว",
    payment: "เงินสด",
    vatRate: 0,
    items: [
      { name: "น้ำดื่ม 600 ml", qty: 3, price: 15 },
      { name: "บะหมี่กึ่งสำเร็จรูป", qty: 5, price: 6 },
    ],
  },
  {
    id: 2,
    invoice: "#INV-00122",
    date: "2025-07-17",
    cashier: "วันวาว",
    payment: "พร้อมเพย์",
    vatRate: 0,
    items: [
      { name: "ขนมปังแซนด์วิช", qty: 2, price: 35 },
      { name: "นม UHT 200 ml", qty: 6, price: 18 },
    ],
  },
];

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sale = useMemo(
    () => SALES.find((s) => String(s.id) === String(id)),
    [id]
  );

  if (!sale) {
    return (
      <div className="min-h-screen bg-[#FAF1E6] p-6">
        <div className="max-w-3xl mx-auto">
        <button
  onClick={() => navigate(-1)}
  className="mb-4 inline-flex items-center gap-2 text-green-700 hover:text-green-800"
>
  <ArrowLeft size={18} />
  กลับ
</button>
          <div className="bg-white p-6 rounded-2xl ring-1 ring-black/5">
            ไม่พบใบเสร็จ
          </div>
        </div>
      </div>
    );
  }

  const subTotal = sale.items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const vat = Math.round((subTotal * sale.vatRate) * 100) / 100;
  const grand = subTotal + vat;

  const handlePrint = () => window.print();
  const handleDelete = () => {
    if (confirm(`ลบประวัติใบเสร็จ ${sale.invoice} ?`)) {
      alert("ลบข้อมูล (ตัวอย่าง)");
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back button */}
        <div className="flex items-center gap-3 mb-6 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            <span className="text-lg">←</span>
          </button>
          <h1 className="text-2xl font-extrabold">รายละเอียดการขาย</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
          {/* Header info */}
          <div className="text-sm leading-6 mb-4">
            <div>
              หมายเลขใบเสร็จ:{" "}
              <span className="font-semibold">{sale.invoice}</span>
            </div>
            <div>วันที่: {sale.date}</div>
            <div>พนักงาน: {sale.cashier}</div>
          </div>

          {/* Items table */}
          <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#C80036] text-white">
                  <th className="px-4 py-3 text-left">สินค้า</th>
                  <th className="px-4 py-3 text-right">จำนวน</th>
                  <th className="px-4 py-3 text-right">ราคา</th>
                  <th className="px-4 py-3 text-right">รวม</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((it, idx) => (
                  <tr
                    key={idx}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="px-4 py-3">{it.name}</td>
                    <td className="px-4 py-3 text-right">{it.qty}</td>
                    <td className="px-4 py-3 text-right">{THB(it.price)}</td>
                    <td className="px-4 py-3 text-right">
                      {THB(it.qty * it.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div />
            <div className="text-sm">
              <div className="flex justify-between py-0.5">
                <span>ยอดรวม</span>
                <span className="font-semibold">{THB(subTotal)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>VAT({sale.vatRate * 100}%)</span>
                <span className="font-semibold">{THB(vat)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-semibold">ยอดสุทธิ</span>
                <span className="font-bold text-green-700">{THB(grand)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>วิธีการชำระเงิน</span>
                <span className="font-medium">{sale.payment}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
  <button
    onClick={handlePrint}
    className="px-4 h-11 flex items-center gap-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
  >
    <RotateCw size={18} />
    พิมพ์ใบเสร็จซ้ำ
  </button>

  <button
    onClick={handlePrint}
    title="ใช้พิมพ์แล้วเลือก Save as PDF"
    className="px-4 h-11 flex items-center gap-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
  >
    <FileDown size={18} />
    ดาวน์โหลดเป็น PDF
  </button>

  <button
    onClick={handleDelete}
    className="px-4 h-11 flex items-center gap-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
  >
    <Trash2 size={18} />
    ลบประวัติ
  </button>
</div>
        </div>
      </div>
    </div>
  );
}
