import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  FileSearch, 
  Download, 
  Filter, 
  HelpCircle, 
  ShieldAlert, 
  FileCheck 
} from 'lucide-react';
import { CATALOG_AUDIT_REPORT, CatalogAuditItem } from '../data/auditReportData';
import { SupportedLanguage } from '../types/valve';

interface CatalogAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const CatalogAuditModal: React.FC<CatalogAuditModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredItems = CATALOG_AUDIT_REPORT.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'spec') return item.errorType.includes('Thông số kỹ thuật');
    if (filterType === 'spelling') return item.errorType.includes('Chính tả');
    if (filterType === 'critical') return item.severity.includes('Critical');
    return true;
  });

  const handleExportAudit = () => {
    const jsonStr = JSON.stringify(CATALOG_AUDIT_REPORT, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UTD_Catalogue_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {lang === 'vi' ? 'BÁO CÁO RÀ SOÁT LỖI CHÍNH TẢ & THÔNG SỐ KỸ THUẬT CATALOGUE UTD' : 'UTD CATALOGUE TECHNICAL AUDIT & RECTIFICATION REPORT'}
                </h2>
                <span className="bg-amber-950 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-700">
                  {CATALOG_AUDIT_REPORT.length} {lang === 'vi' ? 'Đề Xuất' : 'Proposals'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'vi' 
                  ? 'Phân tích đối chiếu từ ấn bản Catalogue UTD gốc: phát hiện lỗi in ấn, lỗi thuật ngữ và đề xuất thay đổi chuẩn hóa' 
                  : 'Comparative technical audit of printed catalogue: print errors, terminology inconsistencies, and standard engineering rectifications'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400 font-bold flex items-center gap-1 font-mono">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'vi' ? 'Lọc theo:' : 'Filter by:'}
            </span>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {lang === 'vi' ? `Tất cả (${CATALOG_AUDIT_REPORT.length})` : `All (${CATALOG_AUDIT_REPORT.length})`}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('spec')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === 'spec' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {lang === 'vi' ? 'Lỗi Thông Số Kỹ Thuật (Derating / Áp lực)' : 'Technical Specs & Derating'}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('spelling')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === 'spelling' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {lang === 'vi' ? 'Lỗi Chính Tả & Từ Vựng Tiếng Anh' : 'Spelling & Terminology'}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('critical')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {lang === 'vi' ? 'Mức Độ Nghiêm Trọng Cao' : 'Critical Severity'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportAudit}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'vi' ? 'Xuất Báo Cáo JSON' : 'Export JSON Report'}</span>
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
                  <th className="p-3 w-16 text-center">{lang === 'vi' ? 'Trang PDF' : 'PDF Page'}</th>
                  <th className="p-3 w-48">{lang === 'vi' ? 'Từ / Thông Số Gốc Trong Bản In' : 'Original Print Text / Spec'}</th>
                  <th className="p-3 w-36">{lang === 'vi' ? 'Loại Lỗi' : 'Error Type'}</th>
                  <th className="p-3 w-56 text-emerald-400">{lang === 'vi' ? 'Đề Xuất Hiệu Đính Chuẩn Xác' : 'Rectified Standard Value'}</th>
                  <th className="p-3">{lang === 'vi' ? 'Giải Thích Chi Tiết & Tác Động Kỹ Thuật' : 'Technical Justification & Impact'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredItems.map((item, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-blue-950/20 transition-colors ${
                      idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'
                    }`}
                  >
                    <td className="p-3 text-center font-mono font-bold text-amber-400">
                      P.{item.page}
                    </td>
                    <td className="p-3 font-mono text-rose-300 font-semibold">
                      {item.originalText}
                    </td>
                    <td className="p-3 font-medium">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.errorType.includes('Thông số') 
                          ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        {item.errorType}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-300">
                      {item.correctedText}
                    </td>
                    <td className="p-3 text-slate-300 leading-relaxed">
                      {item.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {lang === 'vi' 
              ? 'Toàn bộ các đề xuất trên đã được hệ thống website tự động hiệu đính chuẩn xác trong cơ sở dữ liệu hiển thị.' 
              : 'All rectified specifications above have been automatically updated into the live website database.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg"
          >
            {lang === 'vi' ? 'Đóng Báo Cáo' : 'Close Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
