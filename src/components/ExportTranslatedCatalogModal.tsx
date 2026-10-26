import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Globe, 
  Languages, 
  CheckCircle2, 
  Copy, 
  Search, 
  Sliders, 
  Layers, 
  DollarSign, 
  Sparkles,
  ExternalLink,
  Table,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { ValveProduct, SupportedLanguage } from '../types/valve';
import { 
  ExportLanguageTarget, 
  downloadTranslatedCatalogCsv, 
  generateTranslatedCatalogCsv,
  CsvExportResult
} from '../utils/translatedCsvExporter';
import { getLocalizedProduct } from '../utils/engineeringTranslator';

interface ExportTranslatedCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ValveProduct[];
  lang?: SupportedLanguage;
}

export const ExportTranslatedCatalogModal: React.FC<ExportTranslatedCatalogModalProps> = ({
  isOpen,
  onClose,
  products,
  lang = 'vi'
}) => {
  const [targetLang, setTargetLang] = useState<ExportLanguageTarget>('en');
  const [exchangeRate, setExchangeRate] = useState<number>(25450);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Extract unique categories
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Filter products for preview and export
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Generate live preview data (sample 4 items)
  const previewData = useMemo(() => {
    const sample = filteredProducts.slice(0, 5);
    return sample.map(p => {
      const en = getLocalizedProduct(p, 'en');
      const zh = getLocalizedProduct(p, 'zh');
      const usdPrice = (p.referencePriceVnd / exchangeRate).toFixed(2);
      return {
        id: p.id,
        code: p.code,
        nameVi: p.name,
        nameEn: en.name,
        nameZh: zh.name,
        categoryEn: en.categoryLabel,
        categoryZh: zh.categoryLabel,
        materialEn: en.material,
        materialZh: zh.material,
        pressure: p.pressure,
        sizeRange: p.sizeRange,
        connectionEn: en.connection,
        connectionZh: zh.connection,
        priceUsd: `$${usdPrice}`,
        priceVnd: p.referencePriceVnd.toLocaleString('vi-VN') + ' ₫',
      };
    });
  }, [filteredProducts, exchangeRate]);

  if (!isOpen) return null;

  const handleExecuteExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const result = downloadTranslatedCatalogCsv(filteredProducts, {
          targetLang,
          exchangeRateUsd: exchangeRate,
          includeSpecsSummary: true
        });

        const langName = 
          targetLang === 'en' ? 'Tiếng Anh (EN)' :
          targetLang === 'zh' ? 'Tiếng Trung (ZH - 中文)' :
          targetLang === 'bilingual_en' ? 'Song Ngữ VI - EN' :
          targetLang === 'bilingual_zh' ? 'Song Ngữ VI - ZH' : 'Tam Ngữ VI - EN - ZH';

        setSuccessToast(`✓ Đã tự động xuất thành công ${result.totalProducts} sản phẩm sang file ${result.fileName} (${langName})!`);
        setTimeout(() => setSuccessToast(null), 4500);
      } catch (err) {
        console.error('Export error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  const handleCopyCsvClipboard = () => {
    try {
      const result = generateTranslatedCatalogCsv(filteredProducts, {
        targetLang,
        exchangeRateUsd: exchangeRate,
        includeSpecsSummary: true
      });
      navigator.clipboard.writeText(result.csvContent);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (err) {
      console.warn('Copy CSV error:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-fade-in text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  TỰ ĐỘNG HÓA XUẤT DANH MỤC CSV ĐÃ DỊCH (ANH / TRUNG)
                </h3>
                <span className="text-[10px] bg-blue-950 text-blue-300 font-mono px-2 py-0.5 rounded-full border border-blue-600/40 font-bold">
                  Export Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hỗ trợ xuất khẩu, đấu thầu dự án quốc tế, làm việc với đối tác FDI & nhà thầu EPC nước ngoài
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Toast Notice */}
          {successToast && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-300 font-mono font-bold flex items-center gap-2 animate-bounce-subtle">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* 1. Language Target Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>1. Chọn Định Dạng Ngôn Ngữ Xuất Khẩu Đối Tác:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {/* Option 1: English */}
              <button
                type="button"
                onClick={() => setTargetLang('en')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetLang === 'en'
                    ? 'bg-blue-950/70 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🇬🇧</span>
                  {targetLang === 'en' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <h4 className="text-xs font-extrabold text-white">Tiếng Anh (EN)</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Chuẩn RFQ Quốc tế (ASME / API / DIN). Dành cho thị trường Mỹ, EU, Singapore, Trung Đông.
                </p>
              </button>

              {/* Option 2: Chinese */}
              <button
                type="button"
                onClick={() => setTargetLang('zh')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetLang === 'zh'
                    ? 'bg-rose-950/70 border-rose-500 shadow-lg shadow-rose-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🇨🇳</span>
                  {targetLang === 'zh' && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                </div>
                <h4 className="text-xs font-extrabold text-white">Tiếng Trung (ZH - 中文)</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Chuẩn đối tác Trung Quốc, Đài Loan & tổng thầu EPC nước ngoài. Dịch kỹ thuật sâu.
                </p>
              </button>

              {/* Option 3: Bilingual VI - EN */}
              <button
                type="button"
                onClick={() => setTargetLang('bilingual_en')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetLang === 'bilingual_en'
                    ? 'bg-emerald-950/70 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🇻🇳 🇬🇧</span>
                  {targetLang === 'bilingual_en' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <h4 className="text-xs font-extrabold text-white">Song Ngữ VI - EN</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Cột đối chiếu song song Việt - Anh cho hồ sơ thầu dự án FDI trong nước.
                </p>
              </button>

              {/* Option 4: Bilingual VI - ZH */}
              <button
                type="button"
                onClick={() => setTargetLang('bilingual_zh')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetLang === 'bilingual_zh'
                    ? 'bg-amber-950/70 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🇻🇳 🇨🇳</span>
                  {targetLang === 'bilingual_zh' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <h4 className="text-xs font-extrabold text-white">Song Ngữ VI - ZH</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Cột đối chiếu song song Việt - Trung cho dự án nhà xưởng FDI Trung Quốc / Đài Loan.
                </p>
              </button>

              {/* Option 5: Trilingual Master */}
              <button
                type="button"
                onClick={() => setTargetLang('multilingual_all')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetLang === 'multilingual_all'
                    ? 'bg-purple-950/70 border-purple-500 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🌐 Master</span>
                  {targetLang === 'multilingual_all' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <h4 className="text-xs font-extrabold text-white">Tam Ngữ VI-EN-ZH</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Bảng tổng hợp toàn diện 3 ngôn ngữ cho phòng xuất nhập khẩu & ban dự án.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Configuration & Filters Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Currency Exchange Rate USD/VND */}
            <div>
              <label className="block text-slate-400 mb-1 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tỉ Giá Quy Đổi USD (VND/USD):</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">1 USD = {exchangeRate.toLocaleString()} ₫</span>
              </label>
              <input
                type="number"
                min="1000"
                max="100000"
                step="50"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value) || 25450)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-slate-400 mb-1 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Lọc Phân Loại Van:</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:border-blue-500 focus:outline-none capitalize"
              >
                <option value="all">Tất Cả Danh Mục ({products.length} sản phẩm)</option>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')} ({products.filter(p => p.category === cat).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Keyword Search */}
            <div>
              <label className="block text-slate-400 mb-1 font-bold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Tìm Kiếm Theo Mã / Tên:</span>
              </label>
              <input
                type="text"
                placeholder="VD: BFV, PICV, SS316..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Live Translated Sample Preview Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-blue-400" />
                <span>Bản Xem Trước Dữ Liệu Đã Dịch ({filteredProducts.length} sản phẩm sẽ xuất):</span>
              </span>
              <span className="text-slate-400 text-[11px]">
                Mã hóa chuẩn: <strong className="text-emerald-400">UTF-8 with BOM</strong> (Không lỗi font Excel/Google Sheets)
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <div className="overflow-x-auto max-h-[220px]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-800 font-mono uppercase text-[10px] sticky top-0 z-10">
                    <tr>
                      <th className="py-2 px-3">Mã SKU</th>
                      <th className="py-2 px-3">
                        {targetLang === 'zh' ? '产品名称 (ZH)' : targetLang === 'en' ? 'Product Name (EN)' : 'Tên Sản Phẩm (VI / EN / ZH)'}
                      </th>
                      <th className="py-2 px-3">
                        {targetLang === 'zh' ? '阀体材质 (Material)' : 'Material / Thân'}
                      </th>
                      <th className="py-2 px-3">Áp Lực</th>
                      <th className="py-2 px-3">Size Range</th>
                      <th className="py-2 px-3 text-right">Đơn Giá USD</th>
                      <th className="py-2 px-3 text-right">Đơn Giá VND</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {previewData.map(row => (
                      <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-amber-400">{row.code}</td>
                        <td className="py-2 px-3">
                          {targetLang === 'zh' ? (
                            <span className="font-medium text-slate-200">{row.nameZh}</span>
                          ) : targetLang === 'en' ? (
                            <span className="font-medium text-slate-200">{row.nameEn}</span>
                          ) : targetLang === 'bilingual_zh' ? (
                            <div>
                              <div className="text-slate-200 font-bold">{row.nameVi}</div>
                              <div className="text-slate-400 text-[10px]">{row.nameZh}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-slate-200 font-bold">{row.nameVi}</div>
                              <div className="text-slate-400 text-[10px]">{row.nameEn}</div>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-300">
                          {targetLang === 'zh' ? row.materialZh : row.materialEn}
                        </td>
                        <td className="py-2 px-3 text-slate-400 font-mono">{row.pressure}</td>
                        <td className="py-2 px-3 text-slate-400 font-mono">{row.sizeRange}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">{row.priceUsd}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-400">{row.priceVnd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. Export Specifications & Compliance Callout */}
          <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3.5 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-blue-200 font-bold block">
                Tiêu chuẩn xuất khẩu & tích hợp phần mềm nước ngoài:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                File CSV sau khi xuất được chuẩn hóa theo chuẩn <strong>RFC 4180</strong> với bộ mã ký tự <strong>UTF-8 with BOM</strong>. Có thể nạp trực tiếp vào hệ thống ERP SAP, Oracle NetSuite, phần mềm quản lý thầu Procore, hoặc các sàn thương mại B2B quốc tế (Alibaba, Global Sources, Made-in-China) mà không bị lỗi hiển thị ký tự tiếng Trung hoặc tiếng Việt.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Tổng số dòng xuất khẩu: <strong className="text-white font-mono">{filteredProducts.length}</strong> sản phẩm
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400">
              Định dạng: <strong className="text-amber-400 uppercase font-mono">{targetLang.replace('_', ' ')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCsvClipboard}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Copy className="w-4 h-4 text-blue-400" />
              <span>{copiedToast ? '✓ Đã Copy CSV!' : 'Copy To Clipboard'}</span>
            </button>

            <button
              type="button"
              onClick={handleExecuteExport}
              disabled={isExporting || filteredProducts.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang Tự Động Dịch & Biên Dịch CSV...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>TỰ ĐỘNG HÓA XUẤT FILE CSV ({targetLang === 'zh' ? 'TIẾNG TRUNG' : 'TIẾNG ANH'})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
