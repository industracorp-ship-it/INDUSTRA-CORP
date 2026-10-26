import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Wrench, 
  Building, 
  Lock, 
  UserCheck, 
  AlertCircle, 
  Clock, 
  KeyRound, 
  Building2, 
  CheckCircle2, 
  Search,
  Check,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { RfqItem, RfqFormData, UserRole, SupportedLanguage } from '../types/valve';
import { checkIsApprovedDealer, approveB2BDealer, registerB2BDealer, getB2BMembers, getCurrentSession } from '../utils/authEngine';
import { portalStorage } from '../services/portalStorage';
import { exportQuotationToWord, exportQuotationToExcel } from '../utils/exportDocumentEngine';

interface QuotePdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqItems: RfqItem[];
  formData: RfqFormData;
  userRole: UserRole;
  lang: SupportedLanguage;
  isAdminMode?: boolean;
  onOpenB2BRegistration?: (taxCode?: string, companyName?: string) => void;
  onOpenAuthModal?: () => void;
  onOpenTaxLookup?: (taxCode?: string) => void;
}

export const QuotePdfPreviewModal: React.FC<QuotePdfPreviewModalProps> = ({
  isOpen,
  onClose,
  rfqItems,
  formData,
  userRole,
  lang,
  isAdminMode = false,
  onOpenB2BRegistration,
  onOpenAuthModal,
  onOpenTaxLookup,
}) => {
  const [adminBypassed, setAdminBypassed] = useState(false);

  if (!isOpen) return null;

  // Requirement: Bỏ Xuất Báo giá sang PDF tự do, chỉ sau khi đăng nhập thành viên (đã được admin duyệt hoặc đồng ý) mới được lấy báo giá
  const portalUser = portalStorage.getCurrentUser();
  const isPortalStaff = !!portalUser && portalUser.role !== 'GUEST';
  const isAdmin = userRole === 'admin' || isAdminMode || (portalUser && portalUser.role === 'SUPER_ADMIN');
  const session = getCurrentSession();
  
  // Check if customer or active session is in the approved B2B Dealer list
  const dealerCheck = checkIsApprovedDealer({
    email: session?.email || formData.email,
    taxCode: session?.taxCode || formData.taxCode,
    companyName: session?.companyName || formData.companyName
  });
  const isApprovedMember = Boolean(dealerCheck.isApproved || session?.isApprovedMember || (session?.userType === 'member' && dealerCheck.isApproved));

  // Strict Authorization check: only Admin, Staff, or Admin-approved members can get quote
  const isAuthorizedToExport = isAdmin || isPortalStaff || isApprovedMember;
  const approvedMember = dealerCheck.member;

  const quoteNumber = `TTC-QUO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Calculate discount based on approved member tier or role
  let discountRate = 0.0;
  if (approvedMember && approvedMember.discountRatePercent) {
    discountRate = approvedMember.discountRatePercent / 100;
  } else if (isAdmin || isPortalStaff) {
    discountRate = 0.25;
  } else if (userRole === 'contractor') {
    discountRate = 0.20;
  } else if (userRole === 'engineer') {
    discountRate = 0.15;
  }

  const subTotal = rfqItems.reduce((acc, item) => {
    return acc + (item.valve.referencePriceVnd * item.quantity);
  }, 0);

  const discountAmount = subTotal * discountRate;
  const taxableAmount = subTotal - discountAmount;
  const vatAmount = taxableAmount * 0.08;
  const totalAmount = taxableAmount + vatAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePrint = () => {
    if (!isAuthorizedToExport) return;
    window.print();
  };

  const handleExportWord = () => {
    if (!isAuthorizedToExport) return;
    exportQuotationToWord({
      quoteNumber,
      date: currentDate,
      customerName: formData.contactPerson || session?.displayName || 'Quý Khách Hàng',
      companyName: formData.companyName || session?.companyName || 'Công Ty Đối Tác',
      taxCode: formData.taxCode || session?.taxCode || '',
      phone: formData.phone || '',
      email: formData.email || session?.email || '',
      projectName: formData.projectName || 'Dự Án Công Nghiệp',
      deliveryLocation: formData.deliveryLocation || 'Kho bên mua',
      items: rfqItems.map((item, idx) => ({
        itemIndex: idx + 1,
        code: item.valve.code,
        name: lang === 'vi' ? item.valve.name : item.valve.nameEn,
        sizeDn: item.selectedDn,
        pressure: item.valve.pressure,
        material: item.valve.material,
        origin: item.valve.brand || 'UTD',
        quantity: item.quantity,
        unitPriceVnd: item.valve.referencePriceVnd,
        discountPercent: Math.round(discountRate * 100),
        finalPriceVnd: item.valve.referencePriceVnd * (1 - discountRate),
        totalAmountVnd: item.valve.referencePriceVnd * (1 - discountRate) * item.quantity
      })),
      subTotalVnd: subTotal,
      discountRatePercent: Math.round(discountRate * 100),
      discountVnd: discountAmount,
      taxableAmountVnd: taxableAmount,
      vatRatePercent: 8,
      vatAmountVnd: vatAmount,
      totalVnd: totalAmount,
      notes: formData.notes
    });
  };

  const handleExportExcel = () => {
    if (!isAuthorizedToExport) return;
    exportQuotationToExcel({
      quoteNumber,
      date: currentDate,
      customerName: formData.contactPerson || session?.displayName || 'Quý Khách Hàng',
      companyName: formData.companyName || session?.companyName || 'Công Ty Đối Tác',
      taxCode: formData.taxCode || session?.taxCode || '',
      phone: formData.phone || '',
      email: formData.email || session?.email || '',
      projectName: formData.projectName || 'Dự Án Công Nghiệp',
      deliveryLocation: formData.deliveryLocation || 'Kho bên mua',
      items: rfqItems.map((item, idx) => ({
        itemIndex: idx + 1,
        code: item.valve.code,
        name: lang === 'vi' ? item.valve.name : item.valve.nameEn,
        sizeDn: item.selectedDn,
        pressure: item.valve.pressure,
        material: item.valve.material,
        origin: item.valve.brand || 'UTD',
        quantity: item.quantity,
        unitPriceVnd: item.valve.referencePriceVnd,
        discountPercent: Math.round(discountRate * 100),
        finalPriceVnd: item.valve.referencePriceVnd * (1 - discountRate),
        totalAmountVnd: item.valve.referencePriceVnd * (1 - discountRate) * item.quantity
      })),
      subTotalVnd: subTotal,
      discountRatePercent: Math.round(discountRate * 100),
      discountVnd: discountAmount,
      taxableAmountVnd: taxableAmount,
      vatRatePercent: 8,
      vatAmountVnd: vatAmount,
      totalVnd: totalAmount,
      notes: formData.notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5">
      <div 
        className="relative bg-white text-slate-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 font-mono">
              {lang === 'vi' ? 'HỆ THỐNG LẤY BÁO GIÁ DỰ ÁN - CHỈ THÀNH VIÊN ĐÃ ĐƯỢC ADMIN DUYỆT' : 'OFFICIAL TECHNICAL QUOTATION - APPROVED MEMBERS ONLY'}
            </span>
            <span className="text-xs text-slate-400">
              {lang === 'vi' ? '| Khổ A4 tiêu chuẩn' : '| Standard A4 Format'}
            </span>
            {isAuthorizedToExport ? (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600 font-mono text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isAdmin ? 'QUẢN TRỊ VIÊN' : isPortalStaff ? 'NHÂN VIÊN NỘI BỘ' : 'THÀNH VIÊN ĐÃ DUYỆT'} (-{Math.round(discountRate * 100)}%)
              </span>
            ) : (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-600 font-mono text-[10px] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                KHÓA LẤY BÁO GIÁ (CHƯA ĐƯỢC DUYỆT)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthorizedToExport ? (
              <>
                <button
                  type="button"
                  onClick={handleExportWord}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95"
                  title="Xuất file Word (.doc) chuẩn font tiếng Việt Times New Roman"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xuất Word (.doc)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95"
                  title="Xuất bảng tính Excel (.xls) không lỗi font tiếng Việt"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Xuất Excel (.xls)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-black shadow transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'In / Lưu PDF' : 'Print / PDF'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 bg-slate-800 text-slate-500 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed border border-slate-700"
                title="Chỉ sau khi đăng nhập thành viên (đã được admin duyệt hoặc đồng ý) mới được lấy báo giá"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Khóa Báo Giá (Cần Admin Duyệt)' : 'Quotation Locked'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONDITIONAL BODY: IF NOT ADMIN, STAFF, OR APPROVED MEMBER -> STRICT GATEKEEPER LOCK SCREEN */}
        {!isAuthorizedToExport ? (
          <div className="p-8 sm:p-12 text-center bg-slate-950 text-white space-y-6 overflow-y-auto">
            <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 mx-auto shadow-xl shadow-rose-500/10">
              <Lock className="w-10 h-10" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-bold font-mono uppercase tracking-wider">
                {lang === 'vi' ? 'QUY ĐỊNH BẢO MẬT BÁO GIÁ DỰ ÁN' : 'RESTRICTED QUOTATION ACCESS'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'vi' 
                  ? 'Chỉ Sau Khi Đăng Nhập Thành Viên (Đã Được Admin Duyệt Hoặc Đồng Ý) Mới Được Lấy Báo Giá' 
                  : 'Quotations Restricted to Admin-Approved Members Only'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'vi'
                  ? 'Theo chính sách bảo mật hệ thống: Danh sách van đã chọn ĐÃ BỎ XUẤT BÁO GIÁ SANG PDF CÔNG KHAI. Khách hàng bắt buộc phải đăng nhập tài khoản thành viên (đã được Admin phê duyệt hoặc đồng ý) mới được lấy báo giá dự án.'
                  : 'System Security Notice: Direct public PDF quotation export is removed. You must log in as an Admin-approved member to retrieve project quotations.'}
              </p>
            </div>

            {/* Customer Check Status Box */}
            <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Trạng thái xác thực truy cập:</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-rose-950 text-rose-300 border border-rose-600">
                  🔒 CHƯA ĐĂNG NHẬP / CHƯA XÁC THỰC
                </span>
              </div>

              <p>• Doanh nghiệp: <strong className="text-white">{formData.companyName || 'Khách vãng lai'}</strong></p>
              <p>• Mã số thuế: <strong className="text-amber-400">{formData.taxCode || 'Chưa cung cấp MST'}</strong></p>
              <p>• Người liên hệ: <strong className="text-white">{formData.contactPerson || 'Khách hàng'}</strong> {formData.phone ? `(${formData.phone})` : ''}</p>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                💡 Vui lòng đăng nhập bằng tài khoản <strong>Quản Trị Viên</strong>, tài khoản <strong>Nhân Viên</strong> hoặc tài khoản <strong>Thành Viên Đại Lý B2B</strong> để mở khóa tính năng xuất file PDF.
              </div>
            </div>

            {/* Action Buttons for Login Authentication */}
            <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <KeyRound className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'vi' ? 'Đăng Nhập Admin / Nhân Viên' : 'Admin & Staff Login'}</span>
                </button>
              )}

              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'vi' ? 'Đăng Nhập Thành Viên Đại Lý' : 'Member Login'}</span>
                </button>
              )}

              {onOpenB2BRegistration && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenB2BRegistration(formData.taxCode, formData.companyName);
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>{lang === 'vi' ? 'Đăng Ký Thành Viên' : 'Register Member'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Printable Document Sheet Content - ONLY VISIBLE IF APPROVED B2B DEALER */
          <div className="overflow-y-auto p-6 sm:p-10 space-y-6 text-xs bg-white text-slate-900 font-sans">
            {/* Header of Quotation */}
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aistudio/image_c970573c.png"
                    alt="UTD Industracorp"
                    className="h-11 w-auto object-contain"
                  />
                  <div>
                    <h1 className="text-lg font-black tracking-tight text-slate-900 font-mono">
                      {lang === 'vi' ? 'INDUSTRACORP (UTD VALVES)' : 'INDUSTRACORP (UTD VALVES)'}
                    </h1>
                    <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wide">
                      INDUSTRACORP • FLOW CONTROL & INDUSTRIAL VALVES • ISO 9001:2015 CERTIFIED
                    </p>
                    <p className="text-[9px] text-amber-700 font-bold uppercase tracking-wider">
                      {lang === 'vi' 
                        ? 'Đại lý & Phân phối: UTD Valves • JMV-Korea • Johnson Controls • Tyco • Shield Valve UK • VYC-Spain'
                        : 'Authorized Distributor: UTD Valves • JMV-Korea • Johnson Controls • Tyco • Shield Valve UK • VYC-Spain'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-600 space-y-0.5">
                  <p>📍 {lang === 'vi' ? 'Trụ Sở Văn Phòng: Lầu 6, 231-233 Lê Thánh Tôn, Bến Thành, HCM' : 'Headquarters: 6th Floor, 231-233 Le Thanh Ton, Ben Thanh, HCMC'}</p>
                  <p>🏭 {lang === 'vi' ? 'Địa chỉ làm việc và Kho Hàng: 18/2 DT743, An Phú, HCM' : 'Warehouse & Facility: 18/2 DT743, An Phu, HCMC'}</p>
                  <p>📞 {lang === 'vi' ? 'Hotline Kỹ Thuật:' : 'Technical Hotline:'} 0932790928 | ✉ Email: info@industracorp.com, trong.luu@industracorp.com | 🌐 industracorp.com</p>
                  <p>🏦 {lang === 'vi' ? 'Mã Số Thuế: 0309143035 • Bank Account: 309143035 VIB BRANCH DISTRIC 11, LE DAI HANH' : 'Tax ID: 0309143035 • Bank Account: 309143035 VIB BRANCH DISTRIC 11, LE DAI HANH'}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800 px-3 py-1 rounded text-xs">
                  {quoteNumber}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">{lang === 'vi' ? 'Ngày lập:' : 'Date:'} {currentDate}</p>
                <p className="text-[11px] text-slate-500">{lang === 'vi' ? 'Hiệu lực chào giá: 30 ngày' : 'Validity: 30 days'}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ĐẠI LÝ B2B ĐÃ XÁC THỰC
                </div>
              </div>
            </div>

            {/* Title of Document */}
            <div className="text-center py-2">
              <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-wide uppercase">
                {lang === 'vi' 
                  ? 'BẢNG BÁO GIÁ KỸ THUẬT & DỰ TOÁN CUNG CẤP VAN CÔNG NGHIỆP' 
                  : 'TECHNICAL COMMERCIAL QUOTATION & VALVE SUPPLY ESTIMATE'}
              </h2>
              <p className="text-xs text-slate-500 italic mt-0.5">
                {lang === 'vi' 
                  ? '(Dành riêng cho Đại lý B2B được ủy quyền • Kèm theo Chứng chỉ Xuất xưởng CO, CQ & Bản vẽ Kỹ thuật)' 
                  : '(Authorized B2B Partner Edition • Accompanied by Mill Test Certificate 3.1, CO/CQ & Technical Drawings)'}
              </p>
            </div>

            {/* Customer & Project Details Box */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
              <div className="space-y-1">
                <p><strong className="text-slate-700">{lang === 'vi' ? 'Đơn vị nhận báo giá:' : 'Recipient / Contractor:'}</strong> {formData.companyName || (lang === 'vi' ? 'Quý Đại Lý / Nhà Thầu EPC' : 'Client / Contractor')}</p>
                <p><strong className="text-slate-700">{lang === 'vi' ? 'Người liên hệ:' : 'Contact Person:'}</strong> {formData.contactPerson || (lang === 'vi' ? 'Trưởng Ban Cơ Điện M&E' : 'M&E Project Lead')} {formData.phone ? `(${formData.phone})` : ''}</p>
                <p><strong className="text-slate-700">Email:</strong> {formData.email || 'procurement@client.com'}</p>
              </div>
              <div className="space-y-1">
                <p><strong className="text-slate-700">{lang === 'vi' ? 'Tên công trình/Dự án:' : 'Project Name:'}</strong> {formData.projectName || (lang === 'vi' ? 'Dự Án Đường Ống Kỹ Thuật Công Nghiệp' : 'Industrial Piping Project')}</p>
                <p><strong className="text-slate-700">{lang === 'vi' ? 'Mã Số Thuế:' : 'Tax ID:'}</strong> <span className="font-mono font-bold text-blue-900">{formData.taxCode || '0309143035'}</span></p>
                <p><strong className="text-slate-700">{lang === 'vi' ? 'Địa điểm giao hàng:' : 'Delivery Location:'}</strong> {formData.deliveryLocation || (lang === 'vi' ? 'Kho tổng UTD / Chân công trình' : 'UTD Central Depot / Job Site')}</p>
              </div>
            </div>

            {/* Products & Price Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                    <th className="border border-slate-300 p-2 text-center w-10">{lang === 'vi' ? 'STT' : 'No.'}</th>
                    <th className="border border-slate-300 p-2 text-left">{lang === 'vi' ? 'Tên Hàng Hóa & Quy Cách Kỹ Thuật' : 'Item Description & Technical Specifications'}</th>
                    <th className="border border-slate-300 p-2 text-center">{lang === 'vi' ? 'Mã Hiệu' : 'Model Code'}</th>
                    <th className="border border-slate-300 p-2 text-center">{lang === 'vi' ? 'Tiêu Chuẩn / Áp Lực' : 'Standard / Pressure'}</th>
                    <th className="border border-slate-300 p-2 text-center w-14">{lang === 'vi' ? 'ĐVT' : 'Unit'}</th>
                    <th className="border border-slate-300 p-2 text-center w-14">{lang === 'vi' ? 'SL' : 'Qty'}</th>
                    <th className="border border-slate-300 p-2 text-right">{lang === 'vi' ? 'Đơn Giá (VNĐ)' : 'Unit Price (VND)'}</th>
                    <th className="border border-slate-300 p-2 text-right">{lang === 'vi' ? 'Thành Tiền (VNĐ)' : 'Total (VND)'}</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqItems.map((item, index) => {
                    const lineTotal = item.valve.referencePriceVnd * item.quantity;
                    return (
                      <tr key={item.valve.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center font-mono">{index + 1}</td>
                        <td className="border border-slate-300 p-2">
                          <strong className="block text-slate-900">{lang === 'vi' ? item.valve.name : item.valve.nameEn}</strong>
                          <span className="text-[11px] text-slate-600 block">
                            Size: {item.selectedDn} • {lang === 'vi' ? 'Vật liệu:' : 'Material:'} {lang === 'vi' ? item.valve.material : item.valve.materialEn} • {lang === 'vi' ? 'Kết nối:' : 'Connection:'} {item.valve.connection}
                          </span>
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-slate-800">
                          {item.valve.code}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                          {item.valve.pressure}
                        </td>
                        <td className="border border-slate-300 p-2 text-center">{lang === 'vi' ? 'Bộ' : 'Set'}</td>
                        <td className="border border-slate-300 p-2 text-center font-bold font-mono">
                          {item.quantity}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono">
                          {formatCurrency(item.valve.referencePriceVnd)}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary Calculation */}
            <div className="flex justify-end">
              <div className="w-80 space-y-1.5 text-xs bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'vi' ? 'Tổng giá trị hàng hóa:' : 'Subtotal:'}</span>
                  <span className="font-mono">{formatCurrency(subTotal)}</span>
                </div>

                {discountRate > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                    <span>{lang === 'vi' ? `Chiết khấu đại lý B2B (${Math.round(discountRate * 100)}%):` : `B2B Discount (${Math.round(discountRate * 100)}%):`}</span>
                    <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'vi' ? 'Thuế VAT (8%):' : 'VAT Tax (8%):'}</span>
                  <span className="font-mono">{formatCurrency(vatAmount)}</span>
                </div>

                <div className="flex justify-between border-t border-slate-300 pt-1.5 text-sm font-extrabold text-slate-900">
                  <span>{lang === 'vi' ? 'TỔNG THANH TOÁN:' : 'GRAND TOTAL:'}</span>
                  <span className="font-mono text-blue-900">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Commercial & Technical Terms */}
            <div className="border border-slate-200 rounded-lg p-3.5 space-y-1 text-[11px] text-slate-600 bg-slate-50">
              <h4 className="font-bold text-slate-800 uppercase mb-1">
                {lang === 'vi' ? 'ĐIỀU KHOẢN THƯƠNG MẠI & KỸ THUẬT:' : 'COMMERCIAL & TECHNICAL TERMS:'}
              </h4>
              {lang === 'vi' ? (
                <>
                  <p>1. <strong>Chất lượng & Chứng nhận:</strong> Hàng mới 100%, có đầy đủ Chứng nhận xuất xứ (CO), Chứng nhận chất lượng (CQ) và Biên bản thử nghiệm áp lực xuất xưởng.</p>
                  <p>2. <strong>Bảo hành:</strong> 18 tháng kể từ ngày giao hàng hoặc 12 tháng kể từ ngày nghiệm thu đưa vào sử dụng.</p>
                  <p>3. <strong>Thời gian giao hàng:</strong> Hàng sẵn có tại kho Hà Nội & TP.HCM giao ngay trong 24 giờ kể từ khi xác nhận đơn hàng.</p>
                  <p>4. <strong>Thanh toán đại lý:</strong> Tạm ứng 30% khi ký Hợp đồng, 70% còn lại trước khi bàn giao hàng và phát hành Hóa đơn GTGT điện tử theo MST đã đăng ký.</p>
                </>
              ) : (
                <>
                  <p>1. <strong>Quality & Certifications:</strong> 100% Brand new, accompanied by Certificate of Origin (CO), Certificate of Quality (CQ), and Factory Hydrostatic Test Reports.</p>
                  <p>2. <strong>Warranty:</strong> 18 months from delivery date or 12 months from commissioning date.</p>
                  <p>3. <strong>Delivery Time:</strong> In-stock inventory in Hanoi & HCMC delivered within 24 hours upon purchase order confirmation.</p>
                  <p>4. <strong>Payment Terms:</strong> 30% advance deposit upon contract signing, remaining 70% prior to dispatch and VAT invoice issuance.</p>
                </>
              )}
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 pt-6 text-center text-xs">
              <div>
                <p className="font-bold text-slate-800 uppercase">
                  {lang === 'vi' ? 'ĐẠI DIỆN ĐẠI LÝ B2B / KHÁCH HÀNG' : 'CLIENT / CONTRACTOR REPRESENTATIVE'}
                </p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  {lang === 'vi' ? '(Ký, ghi rõ họ tên và đóng dấu)' : '(Signature, Name & Corporate Seal)'}
                </p>
                <div className="h-20" />
              </div>

              <div>
                <p className="font-bold text-blue-950 uppercase">
                  {lang === 'vi' ? 'ĐẠI DIỆN CÔNG TY TIN THUC CORP' : 'TIN THUC CORP CORPORATE REPRESENTATIVE'}
                </p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  {lang === 'vi' ? '(Giám đốc Khối Dự Án Công Nghiệp)' : '(Industrial Project Director)'}
                </p>
                <div className="h-20 flex items-center justify-center">
                  <div className="border-2 border-red-700/80 rounded-full px-4 py-2 text-red-700 font-serif font-black uppercase text-xs rotate-[-8deg] tracking-wider opacity-90 shadow-sm">
                    {lang === 'vi' ? 'TIN THUC CORP ★ ĐÃ DUYỆT BÁO GIÁ' : 'TIN THUC CORP ★ QUOTATION APPROVED'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
