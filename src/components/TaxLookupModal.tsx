import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  MapPin, 
  Calendar, 
  Landmark,
  Briefcase
} from 'lucide-react';
import { lookupVietnamTaxCode, TaxLookupResult, normalizeTaxCode, isValidVietnamTaxCodeFormat, VERIFIED_VIETNAM_ENTERPRISES } from '../utils/taxLookupEngine';
import { SupportedLanguage } from '../types/valve';

interface TaxLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  initialTaxCode?: string;
  onApplyToRfq?: (result: TaxLookupResult) => void;
  onApplyToB2B?: (result: TaxLookupResult) => void;
}

export const TaxLookupModal: React.FC<TaxLookupModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTaxCode = '',
  onApplyToRfq,
  onApplyToB2B
}) => {
  const [searchInput, setSearchInput] = useState(initialTaxCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaxLookupResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (taxCodeToSearch?: string) => {
    const query = normalizeTaxCode(taxCodeToSearch !== undefined ? taxCodeToSearch : searchInput);
    if (!query) {
      setErrorMessage(lang === 'vi' ? 'Vui lòng nhập Mã Số Thuế doanh nghiệp (10 hoặc 13 chữ số).' : 'Please enter an enterprise Tax ID (10 or 13 digits).');
      return;
    }
    if (query.length < 8) {
      setErrorMessage(lang === 'vi' ? 'Mã số thuế doanh nghiệp phải có tối thiểu 10 chữ số (theo quy định Tổng Cục Thuế).' : 'Tax ID must be at least 10 digits as per Vietnam Tax Regulation.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const res = await lookupVietnamTaxCode(query);
      if (res) {
        setResult(res);
      } else {
        setResult(null);
        setErrorMessage(
          lang === 'vi' 
            ? `Không tìm thấy thông tin cho MST "${query}". Vui lòng kiểm tra lại tính chính xác trên Cổng thông tin Tổng Cục Thuế gdt.gov.vn.` 
            : `No corporate records found for Tax ID "${query}". Please check gdt.gov.vn.`
        );
      }
    } catch {
      setErrorMessage(lang === 'vi' ? 'Lỗi kết nối khi tra cứu. Vui lòng thử lại sau.' : 'Network error during lookup. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleCompanies = [
    { code: '0309143035', name: 'UTD / Industracorp' },
    { code: '0317899988', name: 'Vinaflow M&E' },
    { code: '0108998877', name: 'M&E Toàn Cầu' },
    { code: '0300481023', name: 'PVE Dầu Khí' },
    { code: '0900189284', name: 'Hòa Phát' },
    { code: '0303443233', name: 'Coteccons' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  {lang === 'vi' ? 'Tra Cứu Mã Số Thuế Doanh Nghiệp' : 'Vietnam Enterprise Tax ID Lookup'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  gdt.gov.vn
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'vi' 
                  ? 'Đối chiếu dữ liệu thời gian thực theo Cơ sở dữ liệu Tổng Cục Thuế Việt Nam' 
                  : 'Real-time cross-check against General Department of Taxation of Vietnam'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 bg-slate-950/50 border-b border-slate-800/80 space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            {lang === 'vi' ? 'Nhập Mã Số Thuế doanh nghiệp / nhà thầu cần kiểm tra:' : 'Enter corporate Tax Code to verify:'}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={lang === 'vi' ? 'Nhập 10 hoặc 13 chữ số (VD: 0309143035)' : 'e.g. 0309143035'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider font-bold"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'vi' ? 'Đang Tra Cứu...' : 'Searching...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'vi' ? 'Tra Cứu MST' : 'Search Tax ID'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Sample MST tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 font-medium">
              {lang === 'vi' ? 'MST mẫu kiểm tra nhanh:' : 'Sample Tax IDs:'}
            </span>
            {sampleCompanies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setSearchInput(c.code);
                  handleSearch(c.code);
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/60 transition-all"
              >
                {c.code} ({c.name})
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-600/70 rounded-xl text-xs text-rose-300 flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Content Body: Result Display */}
        <div className="p-6 overflow-y-auto space-y-4">
          {result ? (
            <div className="space-y-4 animate-fade-in">
              {/* Top Verified Seal Banner */}
              <div className="p-4 bg-emerald-950/70 border border-emerald-500/80 rounded-2xl flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide font-mono">
                        {lang === 'vi' ? 'ĐÃ ĐỐI CHIẾU TRÙNG KHỚP VỚI TỔNG CỤC THUẾ' : '100% MATCH WITH GDT DATABASE'}
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-900 border border-emerald-600 text-[10px] font-black text-emerald-200">
                        HỢP LỆ
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium mt-0.5">
                      {result.statusText}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(`${result.companyName}\nMST: ${result.taxCode}\nĐịa chỉ: ${result.address}`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Sao chép toàn bộ thông tin"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (lang === 'vi' ? 'Đã sao chép' : 'Copied') : (lang === 'vi' ? 'Sao chép' : 'Copy')}</span>
                </button>
              </div>

              {/* Detailed Business Profile Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-xs text-slate-300">
                {/* Company Name */}
                <div className="border-b border-slate-800/80 pb-3">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                    {lang === 'vi' ? 'Tên Doanh Nghiệp (Đăng Ký Thuế Chính Thức):' : 'Official Registered Corporate Name:'}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug tracking-wide">
                    {result.companyName}
                  </h4>
                  {result.internationalName && (
                    <p className="text-xs text-slate-400 italic mt-0.5">
                      {result.internationalName}
                    </p>
                  )}
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-semibold">
                      {lang === 'vi' ? 'Mã Số Thuế (MST):' : 'Tax Code (MST):'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/60">
                        {result.taxCode}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-semibold">
                      {lang === 'vi' ? 'Cơ Quan Thuế Quản Lý:' : 'Supervising Tax Authority:'}
                    </span>
                    <span className="text-xs text-white font-medium flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      {result.taxAuthority || 'Cục Thuế địa phương'}
                    </span>
                  </div>

                  {result.representative && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 block font-semibold">
                        {lang === 'vi' ? 'Người Đại Diện Pháp Luật:' : 'Legal Representative:'}
                      </span>
                      <span className="text-xs text-white font-bold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {result.representative}
                      </span>
                    </div>
                  )}

                  {result.foundingDate && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 block font-semibold">
                        {lang === 'vi' ? 'Ngày Bắt Đầu Hoạt Động / Cấp MST:' : 'Established Date:'}
                      </span>
                      <span className="text-xs text-slate-200 font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {result.foundingDate}
                      </span>
                    </div>
                  )}
                </div>

                {/* Registered Address */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    {lang === 'vi' ? 'Địa Chỉ Trụ Sở Đăng Ký Kinh Doanh:' : 'Registered Headquarters Address:'}
                  </span>
                  <div className="flex items-start gap-2 text-white">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{result.address}</span>
                  </div>
                </div>

                {/* Industry */}
                {result.industry && (
                  <div className="space-y-1 pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block font-semibold">
                      {lang === 'vi' ? 'Ngành Nghề Hoạt Động Chính:' : 'Main Business Line:'}
                    </span>
                    <div className="flex items-start gap-2 text-slate-300">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{result.industry}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for User Convenience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {onApplyToRfq && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyToRfq(result);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{lang === 'vi' ? 'Áp Dụng Vào Form Báo Giá RFQ' : 'Apply to RFQ Form'}</span>
                  </button>
                )}

                {onApplyToB2B && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyToB2B(result);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                  >
                    <Building2 className="w-4 h-4 text-slate-950" />
                    <span>{lang === 'vi' ? 'Đăng Ký Đại Lý B2B Với MST Này' : 'Register B2B Dealer with this MST'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : !hasSearched ? (
            /* Empty initial state */
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-dashed border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">
                {lang === 'vi' ? 'Tra cứu thông tin pháp lý doanh nghiệp' : 'Look up official corporate legal records'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {lang === 'vi'
                  ? 'Nhập Mã Số Thuế 10 số (hoặc 13 số chi nhánh) để tự động trích xuất tên công ty, địa chỉ trụ sở theo Giấy phép ĐKKD và đối chiếu cơ quan thuế quản lý.'
                  : 'Enter 10-digit Tax Code to auto-extract company name, headquarters address, and tax office verification.'}
              </p>
            </div>
          ) : null}

          {/* Official Verification Notice */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-300 font-bold block">
                {lang === 'vi' ? 'Tiêu chuẩn đối chiếu Tổng Cục Thuế Việt Nam:' : 'Vietnam Tax Authority Compliance:'}
              </strong>
              {lang === 'vi'
                ? 'Thông tin được đối chiếu với cơ sở dữ liệu quốc gia về người nộp thuế. Giúp khách hàng và nhà thầu tránh sai sót thông tin xuất hóa đơn GTGT điện tử (e-Invoice) và đăng ký đại lý B2B chính hãng.'
                : 'Data is reconciled with the National Tax Registry, ensuring zero mistakes in electronic VAT invoice issuance and authorized B2B partnership.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
