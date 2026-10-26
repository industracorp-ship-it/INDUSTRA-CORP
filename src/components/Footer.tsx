import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Wrench, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileDown,
  Edit3
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { CompanyContactInfo, SupportedLanguage } from '../types/valve';
import { IndustraLogo } from './IndustraLogo';

interface FooterProps {
  lang: SupportedLanguage;
  onOpenCatalogue: () => void;
  contactInfo?: CompanyContactInfo;
  isAdminMode?: boolean;
  onEditContactInfo?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  lang, 
  onOpenCatalogue,
  contactInfo,
  isAdminMode,
  onEditContactInfo,
}) => {
  const t = TRANSLATIONS[lang];
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  // Fallback defaults
  const info: CompanyContactInfo = contactInfo || {
    companyName: 'UTD Industrial Valve Corporation (Industracorp)',
    taxCode: '0309143035',
    hotline: '0932790928',
    landline: '0932.790.928',
    emailSales: 'info@industracorp.com',
    emailProject: 'trong.luu@industracorp.com',
    headOffice: 'Lầu 6, 231-233 Lê Thánh Tôn, Bến Thành, HCM.',
    workAndWarehouse: '18/2 DT743, An Phú, HCM.',
    workingHours: '24/7 Hỗ trợ giải pháp kỹ thuật van UTD & Xuất kho khẩn cấp',
    leadTime: 'Giao hàng 2 - 24 giờ trên toàn quốc'
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribedSuccess(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribedSuccess(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      {/* Newsletter Subscription Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              {t.footerSubscribeTitle}
            </h4>
            <p className="text-xs text-slate-400">
              {t.footerSubscribeDesc}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            {subscribedSuccess ? (
              <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'vi' ? 'Đã kích hoạt gửi cập nhật giá vào email của bạn!' : 'Subscribed to price updates!'}
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder={t.footerSubscribePlaceholder}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.footerSubscribeBtn}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col items-start gap-1">
              <IndustraLogo size="md" showSubtitle={true} />
              <span className="text-[10px] text-amber-400 font-mono font-bold tracking-wider uppercase mt-1">
                INDUSTRACORP VALVE SOLUTIONS
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'vi'
                ? 'INDUSTRACORP - Nhà cung cấp giải pháp van công nghiệp và thiết bị điều khiển dòng chảy hàng đầu. Đại lý & nhà phân phối chính thức các thương hiệu uy tín toàn cầu: UTD Valves, JMV-Korea, Johnson Controls, Tyco, Shield Valve UK, VYC-Spain theo tiêu chuẩn ASME, ISO 9001 và DIN.'
                : 'INDUSTRACORP - Leading industrial valves & flow control distributor. Official partner for UTD Valves, JMV-Korea, Johnson Controls, Tyco, Shield Valve UK, VYC-Spain.'}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onOpenCatalogue}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'vi' ? 'Tải Catalogue Kỹ Thuật (PDF)' : 'PDF Catalogue'}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Văn Phòng & Kho Hàng */}
          <div className="lg:col-span-4 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                {t.footerOfficeTitle}
              </h4>
              {isAdminMode && onEditContactInfo && (
                <button
                  type="button"
                  onClick={onEditContactInfo}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-md border border-amber-300 transition-transform active:scale-95"
                  title="Admin sửa địa chỉ văn phòng, kho hàng và liên hệ"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>✏️ Sửa Kho & Hotline</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="border-l-2 border-amber-500/80 pl-3">
                <strong className="text-slate-200 block font-bold mb-0.5">{t.footerHeadOffice}</strong>
                <span className="text-slate-300 leading-relaxed">{info.headOffice || 'Lầu 6, 231-233 Lê Thánh Tôn, Bến Thành, HCM.'}</span>
              </div>

              <div className="border-l-2 border-emerald-500/80 pl-3">
                <strong className="text-slate-200 block font-bold mb-0.5">{t.footerWarehouse}</strong>
                <span className="text-slate-300 leading-relaxed">{info.workAndWarehouse || '18/2 DT743, An Phú, HCM.'}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Contact & Support */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              {t.footerSupportTitle}
            </h4>

            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-amber-400 font-mono text-base tracking-wide">0932790928</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-mono text-slate-200">Email: <strong className="text-amber-400">info@industracorp.com</strong></span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{info.workingHours || t.footerWorkingHours}</span>
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <p className="text-amber-400 font-bold">
                  🏦 Tax ID: 0309143035
                </p>
                <p className="text-slate-400">
                  Bank Account: <strong className="text-white">309143035</strong> VIB BRANCH DISTRIC 11, LE DAI HANH
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1">
                  {t.footerStandardsTitle}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-slate-900 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded text-slate-300">
                    ISO 9001:2015
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded text-slate-300">
                    ASME B16.34
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded text-slate-300">
                    API 6D
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded text-slate-300">
                    CE 0036
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} UTD Industrial Valve Corporation. {t.footerCopyright}</p>
          <div className="flex items-center gap-4">
            <a href="#products" className="hover:text-amber-400 transition-colors">{t.footerNavProducts}</a>
            <a href="#technical-highlights" className="hover:text-amber-400 transition-colors">{t.footerNavSpecs}</a>
            <a href="#rfq-section" className="hover:text-amber-400 transition-colors">{t.footerNavRfq}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
