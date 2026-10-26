import React, { useState } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building, 
  Hash, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { CompanyContactInfo, SupportedLanguage } from '../types/valve';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: CompanyContactInfo;
  onSave: (updated: CompanyContactInfo) => void;
  lang: SupportedLanguage;
}

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose,
  contactInfo,
  onSave,
  lang,
}) => {
  const [formData, setFormData] = useState<CompanyContactInfo>({ ...contactInfo });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-amber-500/60 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{lang === 'vi' ? 'QUẢN TRỊ ĐỊA CHỈ KHO HÀNG, HOTLINE & LIÊN HỆ' : 'MANAGE WAREHOUSE, HOTLINE & CONTACT INFO'}</span>
                <span className="text-[10px] font-mono bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  ADMIN LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'vi' 
                  ? 'Chỉnh sửa trực tiếp hệ thống kho 3 miền, số điện thoại tổng đài, email báo giá dự án' 
                  : 'Live editor for regional depots, technical hotline, and project RFQ emails'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {saveSuccess && (
            <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-3 rounded-lg font-bold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'vi' ? 'Đã lưu cập nhật thông tin kho hàng và liên hệ thành công!' : 'Warehouse & contact details updated successfully!'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'vi' ? 'Tên Doanh Nghiệp:' : 'Company Name:'}
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'vi' ? 'Mã Số Thuế (MST):' : 'Tax ID:'}
              </label>
              <input
                type="text"
                value={formData.taxCode}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'vi' ? 'Hotline 24/7 (Kỹ thuật & Dự án):' : '24/7 Technical Hotline:'}
              </label>
              <input
                type="text"
                required
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                {lang === 'vi' ? 'Số Máy Bàn Tổng Đài:' : 'Switchboard Landline:'}
              </label>
              <input
                type="text"
                value={formData.landline}
                onChange={(e) => setFormData({ ...formData, landline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                {lang === 'vi' ? 'Email Nhận Báo Giá Dự Án:' : 'Project RFQ Email:'}
              </label>
              <input
                type="email"
                required
                value={formData.emailProject}
                onChange={(e) => setFormData({ ...formData, emailProject: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'vi' ? 'Email Phòng Kinh Doanh / Đại Lý:' : 'Sales & Agency Email:'}
              </label>
              <input
                type="email"
                value={formData.emailSales}
                onChange={(e) => setFormData({ ...formData, emailSales: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Office & Warehouse Facilities */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {lang === 'vi' ? 'Địa Chỉ Văn Phòng & Kho Hàng UTD:' : 'Office & Warehouse Locations:'}
            </h4>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {lang === 'vi' ? '🏢 1. Trụ Sở Văn Phòng:' : '🏢 1. Corporate Office:'}
              </label>
              <input
                type="text"
                required
                value={formData.headOffice || 'Lầu 6, 231-233 Lê Thánh Tôn, Bến Thành, HCM.'}
                onChange={(e) => setFormData({ ...formData, headOffice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {lang === 'vi' ? '🏭 2. Địa chỉ làm việc và Kho Hàng:' : '🏭 2. Warehouse & Work Facility:'}
              </label>
              <input
                type="text"
                required
                value={formData.workAndWarehouse || '18/2 DT743, An Phú, HCM.'}
                onChange={(e) => setFormData({ ...formData, workAndWarehouse: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          {/* Working hours & Lead time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'vi' ? 'Giờ Làm Việc / Trực Xuất Kho:' : 'Working Hours / Warehouse Dispatch:'}
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {lang === 'vi' ? 'Thời Gian Giao Hàng Cam Kết:' : 'Committed Delivery Lead Time:'}
              </label>
              <input
                type="text"
                value={formData.leadTime}
                onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold"
            >
              {lang === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-black uppercase flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Lưu Cập Nhật Trực Tiếp' : 'Save Live Updates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
