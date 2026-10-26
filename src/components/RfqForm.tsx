import React, { useState, useEffect } from 'react';
import { 
  Send, 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Trash2, 
  Building, 
  Phone, 
  Mail, 
  Hash, 
  FileCode, 
  Clock, 
  HelpCircle,
  Search,
  Lock,
  KeyRound,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Bell
} from 'lucide-react';
import { RfqItem, RfqFormData, SupportedLanguage } from '../types/valve';
import { TRANSLATIONS } from '../data/translations';
import { lookupVietnamTaxCode, TaxLookupResult, normalizeTaxCode } from '../utils/taxLookupEngine';
import { checkIsApprovedDealer, getCurrentSession, UserSession } from '../utils/authEngine';
import { portalStorage } from '../services/portalStorage';
import { notificationService } from '../services/notificationService';

interface RfqFormProps {
  lang: SupportedLanguage;
  rfqItems: RfqItem[];
  onRemoveItem: (valveId: string) => void;
  onUpdateQuantity: (valveId: string, quantity: number) => void;
  onOpenPdfPreview: (formData: RfqFormData) => void;
  onOpenIntegrationGuide: () => void;
  isApprovedMember?: boolean;
  onOpenAuthModal?: () => void;
  onOpenB2BRegistration?: (taxCode?: string, companyName?: string) => void;
  onOpenTaxLookup?: (taxCode?: string) => void;
}

export const RfqForm: React.FC<RfqFormProps> = ({
  lang,
  rfqItems,
  onRemoveItem,
  onUpdateQuantity,
  onOpenPdfPreview,
  onOpenIntegrationGuide,
  isApprovedMember = false,
  onOpenAuthModal,
  onOpenB2BRegistration,
  onOpenTaxLookup,
}) => {
  const t = TRANSLATIONS[lang];

  const [formData, setFormData] = useState<RfqFormData>({
    companyName: '',
    taxCode: '',
    contactPerson: '',
    rolePosition: '',
    phone: '',
    email: '',
    projectName: '',
    deliveryLocation: 'Hà Nội / Miền Bắc',
    valveRequirements: '',
    fileName: '',
    urgency: 'standard',
    notes: '',
  });

  const [taxLookupLoading, setTaxLookupLoading] = useState(false);
  const [taxLookupResult, setTaxLookupResult] = useState<TaxLookupResult | null>(null);

  // Auto tax lookup when user types 10-13 digits
  const handleTaxCodeChange = async (val: string) => {
    setFormData(prev => ({ ...prev, taxCode: val }));
    const cleaned = val.replace(/[^0-9-]/g, '').trim();
    if (cleaned.length >= 10) {
      setTaxLookupLoading(true);
      try {
        const res = await lookupVietnamTaxCode(cleaned);
        if (res) {
          setTaxLookupResult(res);
          setFormData(prev => ({
            ...prev,
            companyName: res.companyName,
            deliveryLocation: res.address || prev.deliveryLocation
          }));
        } else {
          setTaxLookupResult(null);
        }
      } finally {
        setTaxLookupLoading(false);
      }
    } else {
      setTaxLookupResult(null);
    }
  };

  // Check member session & approval status
  const session = getCurrentSession();
  const portalUser = portalStorage.getCurrentUser();
  const dealerCheck = checkIsApprovedDealer({
    email: session?.email || formData.email,
    taxCode: session?.taxCode || formData.taxCode,
    companyName: session?.companyName || formData.companyName
  });

  const isUserApproved = Boolean(
    isApprovedMember ||
    session?.isApprovedMember ||
    session?.userType === 'admin' ||
    dealerCheck.isApproved ||
    (portalUser && portalUser.role !== 'GUEST')
  );

  const isPendingApproval = !isUserApproved && (
    dealerCheck.status === 'pending' || 
    (session && session.userType === 'member' && !session.isApprovedMember)
  );

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockFileName, setMockFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMockFileName(file.name);
      setFormData((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketNum = `UTD-RFQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const valveItemsText = rfqItems.length > 0 
      ? rfqItems.map((item, idx) => `${idx + 1}. ${item.valve.name} (${item.valve.code}) - Cỡ: ${item.selectedDn} - Số lượng: ${item.quantity} cái`).join('\n')
      : 'Khách hàng yêu cầu tư vấn danh mục thiết bị theo hồ sơ dự án.';
    
    const emailSubject = encodeURIComponent(`[Yêu Cầu Báo Giá RFQ] ${formData.companyName || 'Khách Hàng'} - Dự Án: ${formData.projectName || 'Công Trình'}`);
    const emailBody = encodeURIComponent(
`Kính gửi Ban Giám Đốc & Bộ Phận Kỹ Thuật Industracorp,

Hệ thống nhận được Yêu Cầu Báo Giá Dự Án (RFQ Form) từ website:
--------------------------------------------------
- Mã hồ sơ (Ticket): ${ticketNum}
- Công ty / Đơn vị: ${formData.companyName}
- Mã số thuế: ${formData.taxCode || 'N/A'}
- Người liên hệ: ${formData.contactPerson} (${formData.rolePosition || 'Kỹ sư / Phụ trách'})
- Số điện thoại: ${formData.phone}
- Email nhận báo giá: ${formData.email}
- Tên dự án: ${formData.projectName || 'Dự án công nghiệp'}
- Địa điểm công trình: ${formData.deliveryLocation}
- Mức độ khẩn cấp: ${formData.urgency}
- Yêu cầu kỹ thuật & Ghi chú: ${formData.notes || 'Yêu cầu bảng giá dự án có dấu đỏ và chứng chỉ CO/CQ'}

DANH MỤC VAN YÊU CẦU:
${valveItemsText}

--------------------------------------------------
Nội dung tự động gửi tới: info@industracorp.com, trong.luu@industracorp.com`
    );

    // 1. Auto-dispatch via Backend API proxy to both emails
    try {
      await fetch('/api/rfq/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketNum,
          companyName: formData.companyName,
          taxCode: formData.taxCode,
          contactPerson: formData.contactPerson,
          rolePosition: formData.rolePosition,
          phone: formData.phone,
          email: formData.email,
          projectName: formData.projectName,
          deliveryLocation: formData.deliveryLocation,
          urgency: formData.urgency,
          notes: formData.notes,
          items: rfqItems.map(i => ({
            name: i.valve.name,
            code: i.valve.code,
            sizeDn: i.selectedDn,
            quantity: i.quantity
          }))
        })
      });
    } catch (err) {
      console.warn('API send email error, proceeding with client fallback:', err);
    }

    // 2. Automated Multi-Channel Alert: Real-time Email & Telegram push alert to Admin
    notificationService.notifyUrgentRfq({
      ticketNum,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      rolePosition: formData.rolePosition,
      phone: formData.phone,
      email: formData.email,
      projectName: formData.projectName,
      deliveryLocation: formData.deliveryLocation,
      urgency: formData.urgency,
      notes: formData.notes,
      items: rfqItems.map(i => ({
        name: i.valve.name,
        code: i.valve.code,
        sizeDn: i.selectedDn,
        quantity: i.quantity
      }))
    }).catch(err => console.warn('RFQ Telegram/Email alert error:', err));

    // 3. Synchronize to Portal Storage Quotations
    try {
      const estimatedSubtotal = rfqItems.reduce((sum, item) => sum + (1250000 * item.quantity), 0);
      const totalEstimated = estimatedSubtotal > 0 ? estimatedSubtotal : 25000000;
      portalStorage.createQuotation({
        customerName: formData.contactPerson || 'Khách Hàng Trực Tuyến',
        customerCompany: formData.companyName || 'Công Ty Đối Tác',
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: rfqItems.map((item, idx) => ({
          id: `item-${idx + 1}`,
          sku: item.valve.code,
          name: item.valve.name,
          specs: `${item.selectedDn} - Tiêu chuẩn công nghiệp`,
          quantity: item.quantity,
          unitPriceVnd: 1250000,
          discountPercent: 10,
          subtotalVnd: item.quantity * 1250000 * 0.9
        })),
        subtotalVnd: totalEstimated,
        discountVnd: totalEstimated * 0.1,
        vatRatePercent: 8,
        vatAmountVnd: totalEstimated * 0.9 * 0.08,
        totalVnd: totalEstimated * 0.9 * 1.08,
        status: 'SENT',
        createdByUserId: 'usr-guest-rfq',
        createdByUserName: formData.contactPerson || 'Khách Hàng',
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString()
      });
    } catch (err) {
      console.warn('Portal storage sync notice:', err);
    }

    // 4. Fallback client-side mailto trigger
    try {
      window.location.href = `mailto:info@industracorp.com,trong.luu@industracorp.com?subject=${emailSubject}&body=${emailBody}`;
    } catch {
      // Ignore navigation block
    }

    setSubmittedTicket(ticketNum);
    setIsSubmitting(false);
  };

  return (
    <section id="rfq-section" className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono uppercase mb-3">
            B2B REQUEST FOR QUOTATION
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.rfqTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {lang === 'vi' 
              ? 'Hệ thống tự động tiếp nhận và chuyển tiếp hồ sơ vật tư dự án đến ban giám đốc & chuyên viên kỹ thuật: ' 
              : 'The automated system receives and dispatches project procurement packages to technical leads: '}
            <strong className="text-amber-400 font-mono">info@industracorp.com</strong>, <strong className="text-amber-400 font-mono">trong.luu@industracorp.com</strong>
          </p>
        </div>

        {submittedTicket ? (
          /* Submission Success State */
          <div className="max-w-2xl mx-auto bg-slate-900 border border-emerald-500/50 rounded-2xl p-8 sm:p-10 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {lang === 'vi' ? 'Đã Chuyển Hồ Sơ Báo Giá Thành Công!' : 'Quotation Request Dispatched!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              {lang === 'vi' 
                ? `Mã hồ sơ yêu cầu của quý khách là ` 
                : `Your project RFQ ticket code is `}
              <strong className="text-amber-400 font-mono text-base">{submittedTicket}</strong>
            </p>
            <div className="my-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 text-left space-y-1.5 font-mono">
              <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lang === 'vi' ? '✓ Đã kích hoạt thông báo tự động đa kênh tới Quản Trị Viên:' : '✓ Automated multi-channel notification dispatched to Admins:'}</span>
              </p>
              <p>• Email Tiếp Nhận: <strong className="text-white">info@industracorp.com</strong> & <strong className="text-white">trong.luu@industracorp.com</strong></p>
              <p>• Telegram Alert Bot: <strong className="text-sky-300">@industracorp_alert_bot (Hotline Kỹ Thuật 24/7)</strong></p>
              <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                {lang === 'vi' 
                  ? `Đội ngũ kỹ thuật sẽ liên hệ SĐT: ${formData.phone} trong vòng 15-30 phút để xác nhận cấu hình van và gửi bảng giá dự án.` 
                  : `Engineering team will follow up via phone: ${formData.phone} within 15-30 minutes.`}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onOpenPdfPreview(formData)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{t.exportPdfBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmittedTicket(null);
                  setFormData({
                    companyName: '',
                    taxCode: '',
                    contactPerson: '',
                    rolePosition: '',
                    phone: '',
                    email: '',
                    projectName: '',
                    deliveryLocation: 'Hà Nội',
                    valveRequirements: '',
                    fileName: '',
                    urgency: 'standard',
                    notes: '',
                  });
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-lg text-xs font-bold"
              >
                {lang === 'vi' ? 'Gửi Yêu Cầu Khác' : 'Submit Another RFQ'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Selected Valve Items List / Cart in RFQ */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
                    {t.rfqSelectedList}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  {rfqItems.length} {t.rfqItemCountSuffix}
                </span>
              </div>

              {/* B2B Gated Verification: Only approved members/dealers can see itemized catalog list */}
              {!isUserApproved ? (
                <div className="p-6 text-center bg-slate-950 rounded-xl border border-amber-500/40 space-y-3 shadow-inner">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-white">
                    {t.rfqGatedTitle}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t.rfqGatedDesc}
                  </p>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-lg text-xs flex items-center justify-center gap-2 mx-auto shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{t.rfqGatedBtn}</span>
                    </button>
                  )}
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    {t.rfqGatedNotice}
                  </p>
                </div>
              ) : rfqItems.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-dashed border-slate-800">
                  <p className="text-xs text-slate-400">
                    {lang === 'vi'
                      ? 'Chưa có sản phẩm nào trong danh mục. Hãy bấm "+ Thêm vào RFQ" ở mục Danh Mục Sản Phẩm phía trên.'
                      : 'Your RFQ list is empty. Click "+ Add to RFQ" on any valve above to include it in this inquiry.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/60 p-2 rounded border border-emerald-700/60 font-mono">
                    <span className="flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t.rfqTier1Verified}
                    </span>
                  </div>
                  {rfqItems.map((item) => (
                    <div
                      key={item.valve.id}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] font-bold text-amber-400">
                          {item.valve.code}
                        </span>
                        <h4 className="font-bold text-white truncate text-xs">
                          {lang === 'vi' ? item.valve.name : item.valve.nameEn}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {item.selectedDn} • {item.valve.pressure}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Quantity input */}
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
                          <span className="text-[10px] text-slate-400 mr-1">SL:</span>
                          <input
                            type="number"
                            min="1"
                            max="9999"
                            aria-label={`Số lượng cho van ${item.valve.name}`}
                            value={item.quantity}
                            onChange={(e) => onUpdateQuantity(item.valve.id, parseInt(e.target.value) || 1)}
                            className="w-12 bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.valve.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title={lang === 'vi' ? 'Xóa khỏi danh sách' : 'Remove from list'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Member-Gated Quotation Action: Remove open PDF export, only approved members can retrieve quotes */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                {isUserApproved ? (
                  /* Case 1: Member logged in and approved by Admin (or Admin/Staff) */
                  <div className="bg-emerald-950/60 border border-emerald-600/60 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Thành Viên Đã Được Admin Duyệt</span>
                      </span>
                      <span className="text-[10px] bg-emerald-900/80 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                        {session?.displayName || dealerCheck.member?.fullName || 'Đã Xác Thực'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenPdfPreview(formData)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2.5 rounded-lg text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                    >
                      <FileText className="w-4 h-4 text-slate-950" />
                      <span>{lang === 'vi' ? 'Lấy Báo Giá Chính Thức (Tải / Xem Chi Tiết)' : 'Retrieve Official Quotation (View Details)'}</span>
                    </button>
                    <p className="text-[10px] text-emerald-300/90 text-center font-mono">
                      ✓ Đã mở khóa giá chiết khấu cho danh sách {rfqItems.length} thiết bị đã chọn.
                    </p>
                  </div>
                ) : isPendingApproval ? (
                  /* Case 2: Member registered but pending Admin approval */
                  <div className="bg-amber-950/50 border border-amber-600/50 rounded-xl p-3.5 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xs">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Tài Khoản Thành Viên Đang Chờ Admin Phê Duyệt</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Chính sách bảo mật: Hồ sơ đang được Ban Quản Trị xem xét. Chỉ sau khi được <strong>Admin duyệt hoặc đồng ý</strong> mới được lấy báo giá.
                    </p>
                    <button
                      type="button"
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-500 border border-slate-700 py-2.5 rounded-lg text-xs font-bold cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Đang Chờ Admin Duyệt Để Lấy Báo Giá</span>
                    </button>
                    <p className="text-[10px] text-slate-400">
                      Cần duyệt khẩn? Vui lòng liên hệ Hotline: <span className="text-amber-400 font-mono font-bold">0932.790.928</span>
                    </p>
                  </div>
                ) : (
                  /* Case 3: Guest - Not logged in (Removed PDF Export, strict member login required) */
                  <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Khóa Lấy Báo Giá (Bỏ Xuất Báo Giá Vãng Lai)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Theo quy định: <strong>Đã bỏ xuất báo giá sang PDF</strong> cho khách vãng lai. Chỉ sau khi <strong>đăng nhập thành viên (đã được Admin duyệt hoặc đồng ý)</strong> mới được lấy báo giá.
                    </p>
                    {onOpenAuthModal && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2.5 rounded-lg text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                      >
                        <KeyRound className="w-4 h-4 text-slate-950" />
                        <span>{lang === 'vi' ? 'Đăng Nhập Thành Viên Để Lấy Báo Giá' : 'Member Login to Get Quotation'}</span>
                      </button>
                    )}
                    {onOpenB2BRegistration && (
                      <button
                        type="button"
                        onClick={() => onOpenB2BRegistration(formData.taxCode, formData.companyName)}
                        className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/40 py-2 rounded-lg text-[11px] font-bold transition-all"
                      >
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'vi' ? 'Chưa có tài khoản? Đăng ký đại lý B2B để Admin duyệt' : 'Register B2B Member (Awaiting Approval)'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Webhook and Integration Guide Info Callout */}
              <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-blue-200 font-bold block">
                    {lang === 'vi' ? 'Tự động gửi về Email / Google Sheets:' : 'Automatic Email & Sheet Sync:'}
                  </span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {lang === 'vi'
                      ? 'Form được thiết kế sẵn sàng kết nối webhook Formspree hoặc Google Sheets để nhận email báo giá tức thì.'
                      : 'Ready for integration with Formspree, EmailJS or Google Sheets webhooks.'}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenIntegrationGuide}
                    className="text-[11px] font-bold text-amber-400 hover:underline mt-1 block"
                  >
                    {lang === 'vi' ? '→ Xem hướng dẫn cấu hình chi tiết' : '→ View integration instructions'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: RFQ Form Fields */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tax Code - WITH DEDICATED TRA CỨU MST BUTTON & OFFICIAL GDT MATCHING */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-amber-400" />
                        {t.rfqTaxLabel}
                      </span>
                      {taxLookupLoading && (
                        <span className="text-[10px] text-amber-400 font-mono animate-pulse">
                          {t.rfqTaxLookingUp}
                        </span>
                      )}
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        required
                        placeholder="VD: 0309143035"
                        value={formData.taxCode}
                        onChange={(e) => handleTaxCodeChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono font-bold"
                      />
                      {/* Dedicated Tra Cứu MST Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.taxCode && formData.taxCode.trim().length >= 8) {
                            handleTaxCodeChange(formData.taxCode);
                          } else if (onOpenTaxLookup) {
                            onOpenTaxLookup(formData.taxCode);
                          }
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/50 hover:border-amber-400 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all active:scale-95 shadow-sm"
                        title={lang === 'vi' ? 'Đối chiếu dữ liệu với Tổng Cục Thuế Việt Nam' : 'Cross-check with Vietnam Tax Registry'}
                      >
                        <Search className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">{lang === 'vi' ? 'Tra Cứu MST' : 'Lookup MST'}</span>
                        <span className="sm:hidden">{lang === 'vi' ? 'Tra Cứu' : 'Lookup'}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{t.rfqTaxHelp}</span>
                      {onOpenTaxLookup && (
                        <button
                          type="button"
                          onClick={() => onOpenTaxLookup(formData.taxCode)}
                          className="text-amber-400 hover:underline font-medium"
                        >
                          {lang === 'vi' ? 'Mở cổng tra cứu chi tiết →' : 'Detailed lookup modal →'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-400" />
                      {t.rfqCompanyLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'vi' ? 'Tự động điền theo Mã số thuế hoặc nhập tay' : 'e.g. ABC Mechanical EPC Corp'}
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Tax Lookup Success Banner with Official GDT Match */}
                {taxLookupResult && (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-600/70 rounded-xl text-xs text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono animate-fade-in shadow-md">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-white font-bold">{taxLookupResult.companyName}</strong>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-900 border border-emerald-600 text-[10px] text-emerald-200">
                            ✓ Khớp Tổng Cục Thuế (gdt.gov.vn)
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-300 block mt-0.5">{taxLookupResult.address}</span>
                      </div>
                    </div>

                    {onOpenB2BRegistration && (
                      <button
                        type="button"
                        onClick={() => onOpenB2BRegistration(taxLookupResult.taxCode, taxLookupResult.companyName)}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black shrink-0 flex items-center gap-1 self-start sm:self-center transition-all shadow"
                      >
                        <span>🏢 Đăng ký đại lý B2B</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contact Person - Mandatory */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t.rfqContactPersonLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'vi' ? 'VD: Kỹ sư Vũ Hải Đăng' : 'e.g. John Doe'}
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Phone - Mandatory */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {t.rfqPhoneLabel}
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email - Mandatory */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      {t.rfqEmailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="duan@congty.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  {/* Project Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t.rfqProjectLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'vi' ? 'VD: Nhà máy Lọc Hóa Dầu Vũng Rô' : 'e.g. Petrochemical Expansion'}
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Urgency selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {lang === 'vi' ? 'Mức độ khẩn cấp của báo giá:' : 'Quote Urgency Level:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className={`border rounded-lg p-2 text-center cursor-pointer transition-all ${
                      formData.urgency === 'standard' ? 'bg-blue-950/80 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="standard"
                        checked={formData.urgency === 'standard'}
                        onChange={() => setFormData({ ...formData, urgency: 'standard' })}
                        className="sr-only"
                      />
                      <span className="text-xs font-bold block">{lang === 'vi' ? 'Tiêu chuẩn (24h)' : 'Standard (24h)'}</span>
                    </label>

                    <label className={`border rounded-lg p-2 text-center cursor-pointer transition-all ${
                      formData.urgency === 'urgent' ? 'bg-amber-950/80 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="urgent"
                        checked={formData.urgency === 'urgent'}
                        onChange={() => setFormData({ ...formData, urgency: 'urgent' })}
                        className="sr-only"
                      />
                      <span className="text-xs font-bold block text-amber-300">{lang === 'vi' ? 'Gấp trong 30p' : 'Urgent (30 mins)'}</span>
                    </label>

                    <label className={`border rounded-lg p-2 text-center cursor-pointer transition-all ${
                      formData.urgency === 'tender' ? 'bg-purple-950/80 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="tender"
                        checked={formData.urgency === 'tender'}
                        onChange={() => setFormData({ ...formData, urgency: 'tender' })}
                        className="sr-only"
                      />
                      <span className="text-xs font-bold block">{lang === 'vi' ? 'Hồ sơ đấu thầu' : 'Tender BOQ'}</span>
                    </label>
                  </div>
                </div>

                {/* File Attachment for BOQ / Excel / PDF */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                      {lang === 'vi' ? 'Đính kèm File Danh Mục Vật Tư Dự Án (Excel / PDF)' : 'Attach Bill of Materials (Excel / PDF)'}
                    </span>
                    <span className="text-[11px] text-slate-400">Max 25MB</span>
                  </label>

                  <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-xl p-3 text-center transition-colors bg-slate-950">
                    <input
                      type="file"
                      id="boq-upload"
                      accept=".xlsx,.xls,.pdf,.csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {mockFileName ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-mono font-bold">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        <span>{mockFileName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMockFileName(null);
                            setFormData((prev) => ({ ...prev, fileName: '' }));
                          }}
                          className="ml-2 text-slate-400 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <UploadCloud className="w-4 h-4 text-slate-400" />
                        <span>{lang === 'vi' ? 'Bấm để chọn file Excel/PDF từ máy tính của bạn' : 'Click to select project file from your computer'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'vi' ? 'Yêu cầu kỹ thuật bổ sung (Mác thép, Tiêu chuẩn bích, Hãng actuator)' : 'Additional Technical Requirements'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={lang === 'vi' ? 'VD: Cần mặt bích tiêu chuẩn JIS 10K cho hệ thống nước chiller, yêu cầu cấp chứng nhận CO CQ Phòng Thương Mại...' : 'e.g. DIN PN16 flanges, complete with Mill Test Cert 3.1...'}
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
                    className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        {lang === 'vi' ? 'Đang gửi hồ sơ kỹ thuật...' : 'Processing submission...'}
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>{t.submitRfqBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
