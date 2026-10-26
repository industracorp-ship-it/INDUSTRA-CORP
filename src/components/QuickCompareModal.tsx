import React from 'react';
import { 
  X, 
  Scale, 
  Layers, 
  Gauge, 
  Thermometer, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  FileText,
  ShieldCheck,
  Disc,
  Boxes,
  Activity
} from 'lucide-react';
import { ValveProduct, SupportedLanguage } from '../types/valve';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';

interface QuickCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ValveProduct[];
  lang: SupportedLanguage;
  onRemoveProduct: (productId: string) => void;
  onSelectForRfq?: (product: ValveProduct) => void;
}

export const QuickCompareModal: React.FC<QuickCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  lang,
  onRemoveProduct,
  onSelectForRfq
}) => {
  if (!isOpen) return null;

  // Differences synthesis
  const hasMultipleProducts = products.length >= 2;

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcelComparison = () => {
    const BOM = '\uFEFF';
    const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
  <meta charset="utf-8">
  <style>
    body, table, td, th { font-family: 'Times New Roman', Arial, sans-serif; font-size: 11pt; }
    .th { background-color: #0f172a; color: #fff; font-weight: bold; text-align: center; padding: 6px; }
    .param { background-color: #f1f5f9; font-weight: bold; width: 220px; }
    .cell { border: 0.5px solid #cbd5e1; padding: 6px; }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="${products.length + 1}" style="font-size: 14pt; font-weight: bold; color: #0369a1; text-align: center;">BẢNG SO SÁNH THÔNG SỐ KỸ THUẬT VAN UTD (QUICK COMPARE)</td></tr>
    <tr><td colspan="${products.length + 1}" style="text-align: center; font-style: italic;">Ngày so sánh: ${new Date().toLocaleDateString('vi-VN')}</td></tr>
    <tr><td colspan="${products.length + 1}"></td></tr>
    <tr>
      <th class="th">THÔNG SỐ KỸ THUẬT</th>
      ${products.map(p => `<th class="th">${p.code}</th>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Tên Sản Phẩm</td>
      ${products.map(p => `<td class="cell" style="font-weight: bold;">${p.name}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Vật Liệu Thân (Body)</td>
      ${products.map(p => `<td class="cell">${p.material}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Cấp Áp Suất (Pressure)</td>
      ${products.map(p => `<td class="cell" style="font-weight: bold; color: #b45309;">${p.pressure}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Dải Kích Cỡ (Size DN)</td>
      ${products.map(p => `<td class="cell" style="font-weight: bold; color: #047857;">${p.sizeRange}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Nhiệt Độ Hoạt Động (Temp)</td>
      ${products.map(p => `<td class="cell" style="color: #b91c1c;">${p.tempRange}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Kiểu Kết Nối Mặt Bích</td>
      ${products.map(p => `<td class="cell">${p.connection}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Cấp Độ Kín Khít (Leakage)</td>
      ${products.map(p => `<td class="cell">${p.leakageClass}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Tiêu Chuẩn Thiết Kế</td>
      ${products.map(p => `<td class="cell">${(p.standards || []).join(', ')}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Môi Chất Ứng Dụng</td>
      ${products.map(p => `<td class="cell">${(p.applicableMedia || []).join(', ')}</td>`).join('')}
    </tr>
    <tr>
      <td class="cell param">Giá Tham Khảo (VNĐ)</td>
      ${products.map(p => `<td class="cell" style="font-weight: bold; text-align: right;">${new Intl.NumberFormat('vi-VN').format(p.referencePriceVnd)} VNĐ</td>`).join('')}
    </tr>
  </table>
</body>
</html>
`;
    const blob = new Blob([BOM + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `So_Sanh_${products.map(p => p.code).join('_vs_')}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-amber-500/80 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-wide uppercase font-mono">
                  {lang === 'vi' ? 'BẢNG SO SÁNH THÔNG SỐ KỸ THUẬT CHUYÊN SÂU' : 'DEEP ENGINEERING SPECIFICATION COMPARATOR'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {products.length}/3 {lang === 'vi' ? 'sản phẩm' : 'valves'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'vi' 
                  ? 'So sánh trực quan cạnh nhau về vật liệu, cấp áp lực, nhiệt độ làm việc và tiêu chuẩn công nghiệp.' 
                  : 'Side-by-side technical evaluation of metallurgy, pressure envelope, temperature range, and design standards.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcelComparison}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
              title="Xuất bảng so sánh ra Excel (.xls) font chuẩn tiếng Việt"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất Excel (.xls)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Scale className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">Chưa có sản phẩm nào được chọn để so sánh.</p>
              <p className="text-xs text-slate-500 mt-1">Vui lòng bấm biểu tượng Ghim / So Sánh trên thẻ sản phẩm.</p>
            </div>
          ) : (
            <>
              {/* Product Cards Top Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p, idx) => (
                  <div 
                    key={p.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between relative shadow-lg group hover:border-amber-500/50 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(p.id)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-full bg-slate-800/80 hover:bg-rose-900 text-slate-400 hover:text-white transition-colors"
                      title="Bỏ so sánh sản phẩm này"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="h-32 bg-slate-900 rounded-lg p-2 flex items-center justify-center mb-3 overflow-hidden">
                        <img
                          src={resolveProductImageUrl(p.image)}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {p.code}
                      </span>
                      <h4 className="font-bold text-white text-xs mt-1 leading-snug line-clamp-2">
                        {lang === 'vi' ? p.name : p.nameEn}
                      </h4>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Giá tham khảo:</span>
                      <span className="font-bold text-amber-300">
                        {new Intl.NumberFormat('vi-VN').format(p.referencePriceVnd)} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Side-by-Side Detailed Comparison Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold font-mono">
                        <th className="py-3 px-4 w-1/4">THÔNG SỐ KỸ THUẬT</th>
                        {products.map((p) => (
                          <th key={p.id} className="py-3 px-4 font-bold text-amber-400 border-l border-slate-800">
                            {p.code}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-sans">
                      {/* 1. Body Material */}
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-bold text-sky-400 flex items-center gap-1.5 font-mono">
                          <Layers className="w-3.5 h-3.5 shrink-0" />
                          <span>Vật Liệu Thân (Body)</span>
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 text-slate-200 border-l border-slate-800">
                            {p.material}
                          </td>
                        ))}
                      </tr>

                      {/* 2. Pressure Rating */}
                      <tr className="hover:bg-slate-900/40 bg-slate-900/20">
                        <td className="py-2.5 px-4 font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                          <Gauge className="w-3.5 h-3.5 shrink-0" />
                          <span>Cấp Áp Suất Làm Việc</span>
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 font-bold text-amber-300 font-mono border-l border-slate-800">
                            {p.pressure}
                          </td>
                        ))}
                      </tr>

                      {/* 3. Operating Temperature */}
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-bold text-rose-400 flex items-center gap-1.5 font-mono">
                          <Thermometer className="w-3.5 h-3.5 shrink-0" />
                          <span>Dải Nhiệt Độ Hoạt Động</span>
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 font-mono text-rose-300 border-l border-slate-800">
                            {p.tempRange}
                          </td>
                        ))}
                      </tr>

                      {/* 4. Size Range */}
                      <tr className="hover:bg-slate-900/40 bg-slate-900/20">
                        <td className="py-2.5 px-4 font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                          <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Dải Kích Cỡ Đường Kính</span>
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 font-mono font-bold text-emerald-300 border-l border-slate-800">
                            {p.sizeRange}
                          </td>
                        ))}
                      </tr>

                      {/* 5. Connection Type */}
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-semibold text-slate-400 font-mono">
                          Kiểu Kết Nối Tuyến Ống
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 text-slate-300 border-l border-slate-800">
                            {p.connection}
                          </td>
                        ))}
                      </tr>

                      {/* 6. Leakage Tightness */}
                      <tr className="hover:bg-slate-900/40 bg-slate-900/20">
                        <td className="py-2.5 px-4 font-semibold text-slate-400 font-mono">
                          Cấp Độ Kín Khít & Rò Rỉ
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 font-mono text-emerald-400 border-l border-slate-800">
                            {p.leakageClass}
                          </td>
                        ))}
                      </tr>

                      {/* 7. Standards */}
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-semibold text-slate-400 font-mono">
                          Tiêu Chuẩn Sản Xuất
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 text-slate-300 font-mono text-[11px] border-l border-slate-800">
                            {(p.standards || []).join(' • ')}
                          </td>
                        ))}
                      </tr>

                      {/* 8. Applicable Media */}
                      <tr className="hover:bg-slate-900/40 bg-slate-900/20">
                        <td className="py-2.5 px-4 font-semibold text-slate-400 font-mono">
                          Môi Chất Sử Dụng
                        </td>
                        {products.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 text-slate-300 border-l border-slate-800">
                            {(p.applicableMedia || []).join(', ')}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {products.length >= 2 
              ? '✓ Bảng so sánh trực quan hỗ trợ Kỹ sư & Admin thẩm định kỹ thuật nhanh chóng.' 
              : 'Hãy chọn tối thiểu 2 sản phẩm để kích hoạt so sánh đầy đủ.'}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Đóng Bảng So Sánh
          </button>
        </div>
      </div>
    </div>
  );
};
