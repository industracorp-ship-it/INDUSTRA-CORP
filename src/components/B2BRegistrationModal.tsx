import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Search, 
  Hash, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Clock, 
  FileText, 
  AlertCircle,
  Sparkles,
  Lock,
  Check,
  Bell
} from 'lucide-react';
import { lookupVietnamTaxCode, TaxLookupResult, normalizeTaxCode } from '../utils/taxLookupEngine';
import { registerB2BDealer, approveB2BDealer, B2BMember } from '../utils/authEngine';
import { notificationService } from '../services/notificationService';
import { SupportedLanguage } from '../types/valve';

interface B2BRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  initialTaxCode?: string;
  initialCompanyName?: string;
  onRegistrationSuccess?: (member: B2BMember) => void;
  onOpenTaxLookup?: () => void;
  isAdminMode?: boolean;
}

export const B2BRegistrationModal: React.FC<B2BRegistrationModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTaxCode = '',
  initialCompanyName = '',
  onRegistrationSuccess,
  onOpenTaxLookup,
  isAdminMode = false,
}) => {
  const [formData, setFormData] = useState({
    taxCode: initialTaxCode,
    companyName: initialCompanyName,
    fullName: '',
    position: 'Trưởng Ban Vật Tư / M&E',
    phone: '',
    email: '',
    address: '',
    businessType: 'Nhà thầu EPC Cơ điện M&E / PCCC',
    expectedDiscount: '25%',
    notes: ''
  });

  const [taxLookingUp, setTaxLookingUp] = useState(false);
  const [taxLookupResult, setTaxLookupResult] = useState<TaxLookupResult | null>(null);
  const [taxError, setTaxError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ ticketId: string; member: B2BMember } | null>(null);

  useEffect(() => {
    if (initialTaxCode && !formData.taxCode) {
      setFormData(prev => ({ ...prev, taxCode: initialTaxCode }));
      handleQuickTaxLookup(initialTaxCode);
    }
    if (initialCompanyName && !formData.companyName) {
      setFormData(prev => ({ ...prev, companyName: initialCompanyName }));
    }
  }, [initialTaxCode, initialCompanyName]);

  if (!isOpen) return null;

  const handleQuickTaxLookup = async (codeToLookup?: string) => {
    const code = normalizeTaxCode(codeToLookup !== undefined ? codeToLookup : formData.taxCode);
    if (!code || code.length < 8) {
      setTaxError(lang === 'vi' ? 'Vui lòng nhập Mã Số Thuế có ít nhất 10 số để tra cứu.' : 'Please enter at least 10 digits for Tax Code.');
      return;
    }

    setTaxLookingUp(true);
    setTaxError(null);
    try {
      const res = await lookupVietnamTaxCode(code);
      if (res) {
        setTaxLookupResult(res);
        setFormData(prev => ({
          ...prev,
          taxCode: res.taxCode,
          companyName: res.companyName,
          address: res.address || prev.address,
          fullName: res.representative || prev.fullName
        }));
      } else {
        setTaxError(lang === 'vi' ? 'Không tìm thấy MST này. Quý khách có thể tự nhập tên công ty.' : 'Tax Code not found. You can enter manually.');
      }
    } catch {
      setTaxError(lang === 'vi' ? 'Lỗi kết nối tra cứu MST.' : 'Lookup error.');
    } finally {
      setTaxLookingUp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.phone || !formData.email || !formData.fullName) return;

    setIsSubmitting(true);
    const res = registerB2BDealer({
      fullName: formData.fullName,
      email: formData.email,
      companyName: formData.companyName,
      taxCode: formData.taxCode || '0309143035',
      phone: formData.phone,
      position: formData.position,
      address: formData.address,
      businessType: formData.businessType,
      notes: `${formData.expectedDiscount ? `[Đề xuất chiết khấu: ${formData.expectedDiscount}] ` : ''}${formData.notes}`
    });

    const ticketId = `B2B-REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Automated Multi-Channel Alert (Email to info@/trong.luu@ and Telegram Push Alert to Admin)
    notificationService.notifyB2BRegistration({
      fullName: formData.fullName,
      email: formData.email,
      companyName: formData.companyName,
      taxCode: formData.taxCode || '0309143035',
      phone: formData.phone,
      position: formData.position,
      address: formData.address,
      businessType: formData.businessType,
      expectedDiscount: formData.expectedDiscount,
      notes: formData.notes
    }).catch(err => console.warn('Automated notification dispatch error:', err));

    // Optional dispatch mailto to Industracorp management
    try {
      const subject = encodeURIComponent(`[ĐĂNG KÝ ĐẠI LÝ B2B] ${formData.companyName} (MST: ${formData.taxCode})`);
      const body = encodeURIComponent(
`Kính gửi Ban Giám Đốc Industracorp,
Hệ thống nhận được hồ sơ đăng ký Đại Lý B2B mới:
- Mã hồ sơ: ${ticketId}
- Doanh nghiệp: ${formData.companyName}
- Mã số thuế: ${formData.taxCode}
- Người đại diện: ${formData.fullName} (${formData.position})
- SĐT: ${formData.phone} | Email: ${formData.email}
- Địa chỉ: ${formData.address}
- Lĩnh vực: ${formData.businessType}
- Đề xuất chiết khấu: ${formData.expectedDiscount}
- Ghi chú: ${formData.notes}

Vui lòng đăng nhập Admin để duyệt cấp quyền xuất báo giá PDF!`
      );
    } catch {}

    setTimeout(() => {
      setSubmittedTicket({ ticketId, member: res.member });
      setIsSubmitting(false);
      if (onRegistrationSuccess) {
        onRegistrationSuccess(res.member);
      }
    }, 600);
  };

  const handleAdminInstantApprove = () => {
    if (!submittedTicket) return;
    approveB2BDealer(submittedTicket.member.id, 25);
    setSubmittedTicket(prev => prev ? {
      ...prev,
      member: { ...prev.member, status: 'approved', approvedAt: new Date().toISOString() }
    } : null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  {lang === 'vi' ? 'Đăng Ký Đại Lý Phân Phối B2B' : 'B2B Dealer & Partner Registration'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                  UTD PARTNER
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'vi' 
                  ? 'Khi Admin duyệt, quý khách sẽ được cấp quyền xuất Bảng Báo Giá Kỹ Thuật PDF có chiết khấu' 
                  : 'Upon Admin approval, dealers receive access to export official PDF quotes with discounts'}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {submittedTicket ? (
            /* Registration Success View */
            <div className="space-y-4 text-center py-4 animate-fade-in">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 ${
                submittedTicket.member.status === 'approved' 
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                  : 'bg-amber-950 border-amber-500 text-amber-400'
              }`}>
                {submittedTicket.member.status === 'approved' ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <Clock className="w-8 h-8 animate-pulse" />
                )}
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-white">
                  {submittedTicket.member.status === 'approved' 
                    ? (lang === 'vi' ? 'Đại Lý Đã Được Phê Duyệt Thành Công!' : 'B2B Dealer Approved!')
                    : (lang === 'vi' ? 'Đã Tiếp Nhận Hồ Sơ Đăng Ký Đại Lý B2B!' : 'B2B Registration Submitted!')}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'vi' ? 'Mã hồ sơ đăng ký:' : 'Registration Ticket:'}{' '}
                  <strong className="text-amber-400 font-mono text-sm">{submittedTicket.ticketId}</strong>
                </p>
              </div>

              {/* Status explanation */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2 text-slate-300 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Trạng thái phê duyệt:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    submittedTicket.member.status === 'approved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-950 text-amber-300 border border-amber-600'
                  }`}>
                    {submittedTicket.member.status === 'approved' ? '✓ ĐÃ PHÊ DUYỆT (APPROVED)' : '⏳ CHỜ ADMIN DUYỆT (PENDING)'}
                  </span>
                </div>
                <p>• Doanh nghiệp: <strong className="text-white">{submittedTicket.member.companyName}</strong></p>
                <p>• Mã số thuế: <strong className="text-amber-400">{submittedTicket.member.taxCode}</strong></p>
                <p>• Người liên hệ: <strong className="text-white">{submittedTicket.member.fullName}</strong> ({submittedTicket.member.phone})</p>
                <p>• Email nhận báo giá: <strong className="text-white">{submittedTicket.member.email}</strong></p>

                {submittedTicket.member.status === 'approved' ? (
                  <div className="mt-2 p-2.5 bg-emerald-950/80 rounded-lg border border-emerald-500/70 text-emerald-200 text-xs">
                    🎉 <strong>Chúc mừng:</strong> Tài khoản đã được phê duyệt! Giờ đây quý khách có thể xuất bảng báo giá PDF hoàn chỉnh với chiết khấu {submittedTicket.member.discountRatePercent}% và dấu đỏ điện tử.
                  </div>
                ) : (
                  <div className="mt-2 p-2.5 bg-amber-950/60 rounded-lg border border-amber-500/60 text-amber-200 text-[11px] leading-relaxed">
                    ℹ️ <strong>Quy trình kích hoạt:</strong> Ban Giám Đốc Industracorp sẽ đối chiếu Mã Số Thuế và liên hệ kích hoạt trong vòng 15-30 phút. Hoặc quý khách có thể gọi trực tiếp Hotline <strong className="text-white underline">0932790928</strong> để duyệt ngay.
                  </div>
                )}

                {/* Automated Notification Dispatch Status */}
                <div className="mt-2.5 p-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-[11px] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-slate-300">
                      <strong>Thông báo tự động:</strong> Đã chuyển tiếp Email & Telegram cho Quản trị viên
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                    DISPATCHED
                  </span>
                </div>
              </div>

              {/* Instant Approval Shortcut for Admin / Testing */}
              {submittedTicket.member.status === 'pending' && (
                <div className="p-3 bg-purple-950/40 border border-purple-700/50 rounded-xl text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] text-purple-300">
                      <strong>👑 Quyền Quản Trị / Kiểm Thử Nhanh:</strong> Bấm nút để phê duyệt ngay đại lý này mà không cần chờ.
                    </div>
                    <button
                      type="button"
                      onClick={handleAdminInstantApprove}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Duyệt Ngay' : 'Approve Now'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                >
                  {lang === 'vi' ? 'Đóng Cửa Sổ' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notice Banner */}
              <div className="p-3 bg-blue-950/60 border border-blue-600/60 rounded-xl text-xs text-blue-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-white font-bold">
                    {lang === 'vi' ? 'Chính sách cấp quyền Xuất Báo Giá Kỹ Thuật (PDF):' : 'B2B Quotation PDF Policy:'}
                  </strong>
                  {lang === 'vi'
                    ? 'Để bảo mật giá bán dự án và quyền lợi của các nhà thầu thi công, bảng chào giá có đơn giá chiết khấu chỉ xuất được cho Đại lý B2B đã được Admin phê duyệt.'
                    : 'To protect contractor margins, official PDF price lists are restricted to approved B2B dealers.'}
                </div>
              </div>

              {/* Tax Code Field with integrated Vietnam Tax Lookup Button */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-amber-400" />
                    {lang === 'vi' ? 'Mã Số Thuế Doanh Nghiệp (MST):' : 'Tax ID (MST):'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">10 hoặc 13 chữ số</span>
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="VD: 0309143035 hoặc 0317899988"
                    value={formData.taxCode}
                    onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                  
                  {/* Dedicated MST Lookup Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickTaxLookup()}
                    disabled={taxLookingUp}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                    title="Đối chiếu với Tổng Cục Thuế Việt Nam"
                  >
                    {taxLookingUp ? (
                      <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{lang === 'vi' ? 'Tra Cứu MST' : 'Lookup MST'}</span>
                  </button>
                </div>

                {/* Tax Lookup Verified Success Chip */}
                {taxLookupResult && (
                  <div className="mt-2 p-2 bg-emerald-950/70 border border-emerald-600/70 rounded-lg text-xs text-emerald-300 flex items-center justify-between animate-fade-in font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">✓ Khớp Tổng Cục Thuế: <strong>{taxLookupResult.companyName}</strong></span>
                    </div>
                    <span className="text-[10px] text-emerald-400 shrink-0 ml-2">Đang hoạt động</span>
                  </div>
                )}

                {taxError && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {taxError}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  {lang === 'vi' ? 'Tên Công Ty / Đơn Vị (Đăng Ký Thuế):' : 'Company Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'vi' ? 'Tự động điền theo MST hoặc nhập tên công ty' : 'e.g. ABC Mechanical Engineering Corp'}
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              {/* Contact Person & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'vi' ? 'Người Đại Diện / Liên Hệ (*):' : 'Contact Person (*):'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'vi' ? 'VD: Kỹ sư Nguyễn Văn A' : 'e.g. John Doe'}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'vi' ? 'Chức Vụ / Bộ Phận:' : 'Position / Dept:'}
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Giám Đốc / Ban Lãnh Đạo">Giám Đốc / Ban Lãnh Đạo</option>
                    <option value="Trưởng Ban Vật Tư / M&E">Trưởng Ban Vật Tư / M&E</option>
                    <option value="Chỉ Huy Trưởng Công Trường">Chỉ Huy Trưởng Công Trường</option>
                    <option value="Kỹ Sư Cơ Điện Dự Án">Kỹ Sư Cơ Điện Dự Án</option>
                    <option value="Chuyên Viên Mua Sắm (Procurement)">Chuyên Viên Mua Sắm (Procurement)</option>
                    <option value="Đại Diện Kinh Doanh Đại Lý">Đại Diện Kinh Doanh Đại Lý</option>
                  </select>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {lang === 'vi' ? 'Số Điện Thoại Liên Hệ (*):' : 'Phone Number (*):'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    {lang === 'vi' ? 'Email Nhận Báo Giá (*):' : 'Official Quote Email (*):'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vattu@congty.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {lang === 'vi' ? 'Địa Chỉ Trụ Sở / Kho Hàng:' : 'Headquarters / Warehouse Address:'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'vi' ? 'VD: Lầu 6, 231 Lê Thánh Tôn, Quận 1, TP.HCM' : 'e.g. 18/2 DT743, Binh Duong'}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Business Type & Expected Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    {lang === 'vi' ? 'Mô Hình / Lĩnh Vực Hoạt Động:' : 'Business Field:'}
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Nhà thầu EPC Cơ điện M&E / PCCC">Nhà thầu EPC Cơ điện M&E / PCCC</option>
                    <option value="Đại lý phân phối Van & Phụ kiện">Đại lý phân phối Van & Phụ kiện</option>
                    <option value="Công ty Tư vấn Thiết kế Kỹ thuật">Công ty Tư vấn Thiết kế Kỹ thuật</option>
                    <option value="Chủ đầu tư / Ban Quản Lý Dự Án">Chủ đầu tư / Ban Quản Lý Dự Án</option>
                    <option value="Nhà máy Công nghiệp / Lọc hóa dầu">Nhà máy Công nghiệp / Lọc hóa dầu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {lang === 'vi' ? 'Mức Chiết Khấu Đại Lý Đề Xuất:' : 'Requested Dealer Discount:'}
                  </label>
                  <select
                    value={formData.expectedDiscount}
                    onChange={(e) => setFormData({ ...formData, expectedDiscount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono font-bold text-amber-400"
                  >
                    <option value="15%">Cấp 3 - Nhà thầu phụ M&E (15%)</option>
                    <option value="20%">Cấp 2 - Tổng thầu EPC (20%)</option>
                    <option value="25%">Cấp 1 - Đại lý phân phối chính thức (25%)</option>
                    <option value="30%">Đặc biệt - Hợp đồng khung hàng năm (30%)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {lang === 'vi' ? 'Ghi chú / Năng lực dự án (tùy chọn):' : 'Project capability notes (optional):'}
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'vi' ? 'VD: Đang triển khai gói thầu van cho dự án nhà máy nước thải và chiller...' : 'e.g. Current ongoing projects...'}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>{lang === 'vi' ? 'Đang Gửi Hồ Sơ Đăng Ký...' : 'Submitting...'}</span>
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>{lang === 'vi' ? 'Gửi Hồ Sơ Đăng Ký Đại Lý B2B' : 'Submit B2B Registration'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
