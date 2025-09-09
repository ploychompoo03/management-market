// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "mm_products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setProducts(raw ? JSON.parse(raw) : []);
  }, []);

  const p = useMemo(() => products.find((x) => String(x.id) === String(id)), [products, id]);

  if (!p) {
    return (
      <div className="min-h-screen bg-[#FAF1E6] p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-green-700 hover:text-green-800"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M15 18L9 12l6-6v12Z"/></svg>
            กลับ
          </button>
          <div className="bg-white rounded-2xl ring-1 ring-black/5 p-6">ไม่พบสินค้า</div>
        </div>
      </div>
    );
  }

  const priceText = `${Number(p.price || 0).toLocaleString()} บาท`;
  const remainText = `${p.stock ?? 0} ${p.unit || ""}`.trim();

  return (
    <div className="min-h-screen bg-[#FAF1E6] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header: ปุ่มย้อนกลับวงกลม + ชื่อหน้า */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-700"
            title="กลับ"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M15 18L9 12l6-6v12Z" />
            </svg>
          </button>
          <h1 className="text-2xl font-extrabold">รายละเอียดสินค้า</h1>
        </div>

        {/* Card: รายละเอียด */}
        <div className="bg-white rounded-2xl ring-1 ring-black/5 p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            <Row label="รหัสสินค้า" value={p.id} />
            <Row label="ชื่อสินค้า" value={p.name} />
            <Row label="หมวดหมู่" value={p.category || "-"} />
            <Row label="รายการขาย" value={priceText} />
            <Row label="จำนวนคงเหลือ" value={remainText} />
            <Row label="หน่วย" value={p.unit || "-"} />
            <Row label="บาร์โค้ด" value={p.barcode || "-"} />
            <Row
              label="คำอธิบาย"
              value={p.note || "—"}
              className="md:col-span-2"
            />
          </dl>

          {/* รูปสินค้า (ถ้ามี p.image) */}
          {p.image && (
            <div className="mt-6 flex justify-center">
              <img
                src={p.image}
                alt={p.name}
                className="w-[280px] h-[200px] object-contain rounded-xl bg-white shadow-sm ring-1 ring-black/5"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** แถวชื่อ-ค่า แบบ “label : value” พร้อมจัดคอลอนให้ตรง */
function Row({ label, value, className = "" }) {
  return (
    <div className={`grid grid-cols-[auto_1fr] items-baseline ${className}`}>
      <div className="text-gray-700 font-semibold">
        <span>{label}</span>
        <span className="mx-2">:</span>
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
