import React from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Trash2, 
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { DataIntegrityError, ValidationResult } from '../utils/dataIntegrityEngine';
import { ValveProduct } from '../types/valve';

interface DataIntegrityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: ValidationResult | null;
  onCommitValidOnly: (validProducts: ValveProduct[]) => void;
  fileName: string;
}

export const DataIntegrityReportModal: React.FC<DataIntegrityReportModalProps> = ({
  isOpen,
  onClose,
  validationResult,
  onCommitValidOnly,
  fileName
}) => {
  if (!isOpen || !validationResult) return null;

  const criticalErrors = validationResult.errors.filter(e => e.severity === 'CRITICAL');
  const warnings = validationResult.errors.filter(e => e.severity === 'WARNING');

  const handleDownloadErrorReport = () => {
    let reportText = `BÁO CÁO KIỂM TRA TÍNH TOÀN VẸN DỮ LIỆU FILE IMPORT\n`;
    reportText += `Thời gian: ${new Date().toLocaleString('vi-VN')}\n`;
    reportText += `Tên file: ${fileName}\n`;
    reportText += `Tổng số dòng: ${validationResult.totalRows} | Hợp lệ: ${validationResult.validRowsCount} | Lỗi: ${validationResult.errorCount}\n`;
    reportText += `--------------------------------------------------------------------------------\n\n`;

    validationResult.errors.forEach((err, idx) => {
      reportText += `[LỖI #${idx + 1}] - Dòng: ${err.rowNumber} | Mức độ: ${err.severity}\n`;
      reportText += `- Mã sản phẩm: ${err.productCode}\n`;
      reportText += `- Tên sản phẩm: ${err.productName}\n`;
      reportText += `- Phân loại lỗi: ${err.errorTypeVi}\n`;
      reportText += `- Chi tiết: ${err.details}\n`;
      reportText += `- Đề xuất xử lý: ${err.recommendedFix}\n\n`;
    });

    const blob = new Blob(['\uFEFF' + reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_Cao_Loi_Du_Lieu_${fileName.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-rose-500/80 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-wide uppercase font-mono">
                  BẢNG BÁO CÁO LỖI TÍNH TOÀN VẸN DỮ LIỆU TRƯỚC KHI CẬP NHẬT
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-600">
                  {validationResult.errorCount} LỖI PHÁT HIỆN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Kiểm tra file: <strong className="text-amber-400">{fileName}</strong> • Tự động phát hiện trùng lặp mã sản phẩm và định dạng giá thành
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Highlights */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Tổng Số Dòng File:</span>
            <span className="text-base font-bold text-white">{validationResult.totalRows}</span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Dòng Hợp Lệ:</span>
            <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {validationResult.validRowsCount}
            </span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-rose-900/60">
            <span className="text-[10px] text-rose-400 block uppercase font-bold">Lỗi Nghiêm Trọng:</span>
            <span className="text-base font-bold text-rose-400">{criticalErrors.length}</span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-amber-900/60">
            <span className="text-[10px] text-amber-400 block uppercase font-bold">Cảnh Báo Ghi Đè:</span>
            <span className="text-base font-bold text-amber-400">{warnings.length}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold font-mono text-[11px]">
                    <th className="py-2.5 px-3 text-center">Dòng #</th>
                    <th className="py-2.5 px-3">Mã Sản Phẩm</th>
                    <th className="py-2.5 px-3">Tên Sản Phẩm</th>
                    <th className="py-2.5 px-3">Phân Loại Vi Phạm</th>
                    <th className="py-2.5 px-3">Chi Tiết Vi Phạm Dữ Liệu</th>
                    <th className="py-2.5 px-3">Đề Xuất Khắc Phục</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {validationResult.errors.map((err) => (
                    <tr 
                      key={err.id} 
                      className={err.severity === 'CRITICAL' ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'bg-amber-950/15 hover:bg-amber-950/25'}
                    >
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">
                          #{err.rowNumber}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                        {err.productCode}
                      </td>

                      <td className="py-2.5 px-3 font-medium text-white max-w-xs truncate" title={err.productName}>
                        {err.productName}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold ${
                          err.severity === 'CRITICAL' 
                            ? 'bg-rose-950 text-rose-300 border border-rose-700' 
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          {err.errorTypeVi}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-300 leading-relaxed text-[11px]">
                        {err.details}
                      </td>

                      <td className="py-2.5 px-3 text-emerald-300/90 leading-relaxed text-[11px]">
                        {err.recommendedFix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownloadErrorReport}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Báo Cáo Lỗi (.txt)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Hủy Bỏ Import
            </button>

            {validationResult.validRowsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onCommitValidOnly(validationResult.validProducts);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Bỏ Qua Lỗi & Nạp {validationResult.validRowsCount} Sản Phẩm Hợp Lệ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
