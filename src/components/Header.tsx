import React, { useState } from 'react';
import { 
  Wrench, 
  FileDown, 
  Phone, 
  Menu, 
  X, 
  Layers, 
  FileSpreadsheet, 
  UserCheck, 
  ShieldCheck, 
  BookOpen, 
  UploadCloud, 
  Sparkles, 
  Edit3,
  Sliders,
  Database,
  Cpu,
  Unlock,
  Building2,
  Search,
  Lock,
  LogIn,
  LogOut,
  AlertTriangle,
  Clock,
  Languages,
  Bell
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { UserRole, SupportedLanguage } from '../types/valve';
import { IndustraLogo } from './IndustraLogo';

interface HeaderProps {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdminMode: boolean;
  setIsAdminMode: React.Dispatch<React.SetStateAction<boolean>>;
  rfqCount: number;
  onOpenRfq: () => void;
  onOpenGuide: () => void;
  onOpenCatalogue: () => void;
  onOpenKnowledge: (tab?: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly') => void;
  onOpenHosting: () => void;
  onOpenAudit: () => void;
  onOpenCategoryManager?: () => void;
  onOpenDataStorage?: () => void;
  onOpenCrawler?: () => void;
  isAdminOverride?: boolean;
  onToggleAdminOverride?: () => void;
  onOpenB2BRegistration?: () => void;
  onOpenTaxLookup?: () => void;
  pendingDealersCount?: number;
  onOpenManageDealers?: () => void;
  onOpenInternalLogin?: () => void;
  onOpenPortal?: () => void;
  onOpenMaterialAlert?: () => void;
  onOpenAuditLogs?: () => void;
  pendingChangesCount?: number;
  hasMaterialAlert?: boolean;
  onOpenExportCatalogModal?: () => void;
  onOpenNotificationSettings?: () => void;
  onOpenAiKnowledge?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  userRole,
  setUserRole,
  isAdminMode,
  setIsAdminMode,
  rfqCount,
  onOpenRfq,
  onOpenGuide,
  onOpenCatalogue,
  onOpenKnowledge,
  onOpenHosting,
  onOpenAudit,
  onOpenCategoryManager,
  onOpenDataStorage,
  onOpenCrawler,
  isAdminOverride,
  onToggleAdminOverride,
  onOpenB2BRegistration,
  onOpenTaxLookup,
  pendingDealersCount = 0,
  onOpenManageDealers,
  onOpenInternalLogin,
  onOpenPortal,
  onOpenMaterialAlert,
  onOpenAuditLogs,
  pendingChangesCount = 0,
  hasMaterialAlert = true,
  onOpenExportCatalogModal,
  onOpenNotificationSettings,
  onOpenAiKnowledge,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const roleLabels: Record<UserRole, { label: string; badge: string; discount: string }> = {
    guest: { 
      label: lang === 'vi' ? 'Khách tham quan' : 'Guest Visitor', 
      badge: 'bg-slate-700 text-slate-200',
      discount: '0%' 
    },
    engineer: { 
      label: lang === 'vi' ? 'Kỹ sư Tư vấn M&E' : 'M&E Consultant', 
      badge: 'bg-blue-800 text-blue-100 border border-blue-600',
      discount: 'CAD/3D Full' 
    },
    contractor: { 
      label: lang === 'vi' ? 'Tổng thầu EPC / Đại lý' : 'EPC Contractor', 
      badge: 'bg-amber-600 text-white font-bold',
      discount: lang === 'vi' ? 'Báo Giá Dự Án' : 'Project Quotes' 
    },
    admin: {
      label: lang === 'vi' ? 'Admin (Quản Trị CMS)' : 'Admin (CMS Mode)',
      badge: 'bg-rose-600 text-white font-black animate-pulse',
      discount: lang === 'vi' ? 'Chỉnh Sửa Live' : 'Live Editing'
    }
  };

  const navLinks = [
    { href: '#technical-highlights', label: t.navSpecs },
    { href: '#comparison', label: t.navCompare },
    { href: '#projects-section', label: t.navProjects },
    { href: '#valve-news', label: t.navNews },
    { href: '#clients', label: t.navClients },
    { href: '#rfq-section', label: t.navRfq },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 transition-all">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {lang === 'vi' 
                ? 'Trụ sở: 231-233 Lê Thánh Tôn, Bến Thành • Kho Hàng: 18/2 DT743, An Phú • Hotline: 0932790928' 
                : 'Head Office: 231-233 Le Thanh Ton • Warehouse: 18/2 DT743, An Phu, HCMC • Hotline: 0932790928'}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <button
              type="button"
              onClick={() => onOpenKnowledge('pccc')}
              className="hidden lg:flex items-center gap-1 text-red-400 hover:text-red-300 font-bold"
            >
              <span>{lang === 'vi' ? '🔥 Cẩm Nang PCCC & Khí' : '🔥 Fire & Gas Guide'}</span>
            </button>
            <span className="hidden lg:inline text-slate-600">•</span>
            <button
              type="button"
              onClick={() => onOpenKnowledge('steam')}
              className="hidden lg:flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
            >
              <span>{lang === 'vi' ? '♨️ Sơ Đồ Hệ Steam Lò Hơi' : '♨️ Steam Boiler Loops'}</span>
            </button>
            <span className="hidden lg:inline text-slate-600">•</span>
            <button
              type="button"
              onClick={() => onOpenKnowledge('cross_ref')}
              className="hidden xl:flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold"
            >
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'vi' ? 'Tra Tương Đương Johnson Controls / Spirax' : 'Cross-Ref: JC / Spirax / Bray'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!isAdminMode ? (
              /* PUBLIC VISITORS VIEW: Clean "🔐 Đăng Nhập Nội Bộ" tab only */
              <button
                type="button"
                onClick={onOpenInternalLogin || onOpenManageDealers}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-blue-900/40 to-slate-900 hover:from-amber-500/30 hover:to-blue-900/60 text-amber-300 border border-amber-500/50 hover:border-amber-400 px-3 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95"
                title={lang === 'vi' ? 'Dành riêng cho nhân sự nội bộ Industracorp đăng nhập quản trị website' : 'Industracorp Staff & Admin Portal Login'}
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'vi' ? '🔐 Đăng Nhập Nội Bộ' : '🔐 Staff Login'}</span>
              </button>
            ) : (
              /* INTERNAL STAFF VIEW: Revealed Administrative Tabs */
              <>
                {/* Internal Mode Active Badge & Logout */}
                <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 px-2.5 py-0.5 rounded text-[11px] font-bold shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'vi' ? 'Nội Bộ: Admin' : 'Staff Portal'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(false);
                      setUserRole('guest');
                    }}
                    className="ml-1.5 text-[10px] text-red-400 hover:text-red-300 underline font-mono flex items-center gap-0.5"
                    title={lang === 'vi' ? 'Đăng xuất khỏi chế độ nội bộ' : 'Logout from staff portal'}
                  >
                    <LogOut className="w-2.5 h-2.5" />
                    <span>{lang === 'vi' ? 'Đăng xuất' : 'Logout'}</span>
                  </button>
                </div>

                {/* Centralized Management Portal Quick Access Button - Revealed for Admin */}
                {onOpenPortal && (
                  <button
                    type="button"
                    onClick={onOpenPortal}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500 hover:from-blue-600 hover:to-amber-400 text-white px-2.5 py-1 rounded-lg text-[11px] font-black shadow transition-all active:scale-95"
                    title={lang === 'vi' ? 'Cổng Quản Trị Tập Trung: Kho, Báo giá, Plan, Cấu hình AI Admin' : 'Centralized Management Portal'}
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'vi' ? '🏛️ Cổng Dự Án Tập Trung (Portal)' : '🏛️ Central Portal'}</span>
                  </button>
                )}

                {/* Host Upload & Auto-Migration Button */}
                <button
                  type="button"
                  onClick={onOpenHosting}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white border border-blue-400 px-3 py-1 rounded-lg text-[11px] font-black transition-all shadow-md shadow-blue-950/50 animate-pulse cursor-pointer relative"
                  title={lang === 'vi' ? 'Upload và đồng bộ toàn bộ thay đổi trang web lên Hosting Server 103.75.184.20 (www.industracorp.com)' : 'Upload website to hosting (103.75.184.20)'}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">{lang === 'vi' ? '🚀 Upload Lên Hosting & Website' : '🚀 Deploy to Hosting'}</span>
                  <span className="sm:hidden">🚀 Hosting</span>
                  {pendingChangesCount > 0 ? (
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black animate-bounce shadow">
                      {pendingChangesCount} mới
                    </span>
                  ) : (
                    <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[9px] font-bold hidden md:inline">103.75.184.20</span>
                  )}
                </button>

                {/* Raw Material Fluctuation & Price Batch Update Alert Button */}
                {onOpenMaterialAlert && (
                  <button
                    type="button"
                    onClick={onOpenMaterialAlert}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-500 hover:to-rose-500 text-white border border-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all shadow-md animate-pulse cursor-pointer"
                    title={lang === 'vi' ? 'Cảnh báo biến động vật liệu thô LME (>5% Inox/Gang) & cập nhật giá CSV/API' : 'Raw Material Fluctuation Alert & Batch Price Update'}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
                    <span className="hidden xl:inline">{lang === 'vi' ? '🚨 Cảnh Báo Vật Liệu & Giá' : '🚨 Material Alert'}</span>
                    <span className="xl:hidden">🚨 Giá LME</span>
                    <span className="bg-rose-950 text-rose-200 border border-rose-500 px-1 py-0.2 rounded text-[9px] font-mono font-bold">+14.5%</span>
                  </button>
                )}

                {/* Audit Logs Quick Button */}
                {onOpenAuditLogs && (
                  <button
                    type="button"
                    onClick={onOpenAuditLogs}
                    className="flex items-center gap-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/70 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                    title={lang === 'vi' ? 'Xem nhật ký thay đổi sản phẩm, xóa dự án & cấu hình portal (Audit Logs)' : 'View Audit Logs'}
                  >
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden lg:inline">{lang === 'vi' ? '📋 Audit Logs' : '📋 Logs'}</span>
                    <span className="lg:hidden">Logs</span>
                  </button>
                )}

                {/* Export Translated Catalog CSV (EN/ZH) Button */}
                {onOpenExportCatalogModal && (
                  <button
                    type="button"
                    onClick={onOpenExportCatalogModal}
                    className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/70 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow cursor-pointer active:scale-95"
                    title={lang === 'vi' ? 'Tự động hóa xuất toàn bộ danh mục sang file CSV đã dịch (Anh/Trung) hỗ trợ xuất khẩu' : 'Automated Export Translated Catalog CSV (EN/ZH)'}
                  >
                    <Languages className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden xl:inline">{lang === 'vi' ? '🌐 Xuất CSV Anh/Trung' : '🌐 Export CSV (EN/ZH)'}</span>
                    <span className="xl:hidden">CSV EN/ZH</span>
                  </button>
                )}

                {/* Automated Notification Settings (Email & Telegram) Button */}
                {onOpenNotificationSettings && (
                  <button
                    type="button"
                    onClick={onOpenNotificationSettings}
                    className="flex items-center gap-1.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-500/70 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow cursor-pointer active:scale-95"
                    title={lang === 'vi' ? 'Cấu hình thông báo tự động (Email & Telegram) khi có khách đăng ký B2B hoặc báo giá khẩn' : 'Automated Notifications Settings (Email & Telegram)'}
                  >
                    <Bell className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                    <span className="hidden xl:inline">{lang === 'vi' ? '🔔 Thông Báo Telegram/Email' : '🔔 Telegram/Email Alerts'}</span>
                    <span className="xl:hidden">Alerts</span>
                  </button>
                )}

                {/* Background Crawler Button */}
                {onOpenCrawler && (
                  <button
                    type="button"
                    onClick={onOpenCrawler}
                    className="flex items-center gap-1 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-600/60 px-2 py-0.5 rounded text-[11px] font-bold transition-colors"
                    title={lang === 'vi' ? 'Quét tự động specs từ VYC, Shield, JMV, Johnson Controls, Tyco' : 'Auto-crawl specs from VYC, Shield, JMV, Johnson Controls, Tyco'}
                  >
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden lg:inline">{lang === 'vi' ? 'Crawler 5 Hãng' : 'Crawler 5 Brands'}</span>
                    <span className="lg:hidden">Crawler</span>
                  </button>
                )}

                {/* Hosting Data Storage & Sync Center Button */}
                {onOpenDataStorage && (
                  <button
                    type="button"
                    onClick={onOpenDataStorage}
                    className="flex items-center gap-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-600/60 px-2 py-0.5 rounded text-[11px] font-bold transition-colors"
                    title={lang === 'vi' ? 'Lưu trữ dữ liệu an toàn & đồng bộ hosting' : 'Data Storage & Hosting Backup'}
                  >
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden md:inline">{lang === 'vi' ? 'Lưu Trữ & Backup' : 'Storage & Backup'}</span>
                    <span className="md:hidden">Backup</span>
                  </button>
                )}

                {/* Admin Category Manager Button */}
                {onOpenCategoryManager && (
                  <button
                    type="button"
                    onClick={onOpenCategoryManager}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-black bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/70 transition-all shadow"
                    title={lang === 'vi' ? 'Thêm, xóa, sắp xếp lại thứ tự danh mục hàng hóa' : 'Category order & groups manager'}
                  >
                    <Sliders className="w-3 h-3 text-purple-400" />
                    <span>{lang === 'vi' ? 'Quản Lý Danh Mục' : 'Category Manager'}</span>
                  </button>
                )}

                {/* Admin Live In-Place Editor Switch */}
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isAdminMode;
                    setIsAdminMode(nextState);
                    if (nextState) setUserRole('admin');
                    else setUserRole('contractor');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-black transition-all border ${
                    isAdminMode 
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30' 
                      : 'bg-slate-950 text-slate-400 hover:text-amber-400 border-slate-700'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{lang === 'vi' ? (isAdminMode ? 'Admin Editor: BẬT' : 'Admin Sửa Live') : (isAdminMode ? 'Admin: ON' : 'Admin: OFF')}</span>
                </button>

                {/* Admin Override Mode Button */}
                {onToggleAdminOverride && (
                  <button
                    type="button"
                    onClick={onToggleAdminOverride}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-black transition-all border cursor-pointer ${
                      isAdminOverride
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-950 text-slate-400 hover:text-emerald-400 border-slate-700'
                    }`}
                    title={lang === 'vi' ? 'Tạm thời tắt bộ chặn copy, click chuột phải và phím F12' : 'Toggle off copy, right-click, and F12 event listeners'}
                  >
                    <Unlock className="w-3 h-3" />
                    <span>{lang === 'vi' ? (isAdminOverride ? 'Override: BẬT' : 'Override Copy') : (isAdminOverride ? 'Override: ON' : 'Override: OFF')}</span>
                  </button>
                )}

                {/* User Access Level Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  <UserCheck className="w-3 h-3 text-amber-400" />
                  <select
                    aria-label="Cấp độ tài khoản"
                    value={userRole}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setUserRole(r);
                      setIsAdminMode(r === 'admin');
                    }}
                    className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="guest" className="bg-slate-900 text-slate-200">{t.roleGuest}</option>
                    <option value="engineer" className="bg-slate-900 text-slate-200">{t.roleEngineer}</option>
                    <option value="contractor" className="bg-slate-900 text-slate-200">{t.roleContractor}</option>
                    <option value="admin" className="bg-slate-900 text-amber-400 font-bold">{lang === 'vi' ? 'Admin (CMS Sửa Live)' : 'Admin (Live CMS)'}</option>
                  </select>
                  <span className={`text-[10px] px-1 py-0.2 rounded ${roleLabels[userRole].badge}`}>
                    {roleLabels[userRole].discount}
                  </span>
                </div>
              </>
            )}

            {/* Multi-Language Switcher (VI, EN, TH, ZH, PT, UAE/AR - Yêu cầu 4) */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <div className="hidden sm:flex items-center">
                <button
                  type="button"
                  onClick={() => setLang('vi')}
                  className={`px-1.5 py-0.5 text-xs rounded transition-all font-semibold flex items-center gap-1 ${
                    lang === 'vi' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tiếng Việt"
                >
                  <span>🇻🇳</span> <span>VI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-1.5 py-0.5 text-xs rounded transition-all font-semibold flex items-center gap-1 ${
                    lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="English (Technical Translation)"
                >
                  <span>🇺🇸</span> <span>EN</span>
                </button>
              </div>

              {/* Extended Language Select Dropdown for all 6 languages */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                className="bg-transparent text-slate-200 text-xs font-semibold px-1 py-0.5 rounded border-0 focus:outline-none cursor-pointer hover:text-amber-400"
                aria-label="Select Language"
              >
                <option value="vi" className="bg-slate-900 text-slate-200">🇻🇳 VI - Tiếng Việt</option>
                <option value="en" className="bg-slate-900 text-slate-200">🇺🇸 EN - English</option>
                <option value="th" className="bg-slate-900 text-slate-200">🇹🇭 TH - ภาษาไทย (Thái Lan)</option>
                <option value="zh" className="bg-slate-900 text-slate-200">🇨🇳 ZH - 中文 (Trung Quốc)</option>
                <option value="pt" className="bg-slate-900 text-slate-200">🇵🇹 PT - Português (Bồ Đào Nha)</option>
                <option value="ar" className="bg-slate-900 text-slate-200">🇦🇪 AR - العربية (UAE / Trung Đông)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo - Official INDUSTRACORP Gold Crest */}
        <a href="#" className="flex items-center gap-3 group">
          <IndustraLogo size="md" showSubtitle={true} />
          <div className="hidden sm:block border-l border-slate-800 pl-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-widest text-slate-200 font-mono">INDUSTRACORP</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                ISO 9001:2015
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium tracking-wider uppercase line-clamp-1">
              {lang === 'vi' 
                ? 'UTD • JMV-Korea • Johnson Controls • Tyco • Shield UK • VYC-Spain' 
                : 'Authorized Flow Control Solutions & Heavy Valves'}
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors tracking-wide hover:underline underline-offset-8 decoration-amber-500"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => onOpenKnowledge('pccc')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Kho Tri Thức Kỹ Thuật' : 'Knowledge Hub'}</span>
          </button>
          {onOpenAiKnowledge && (
            <button
              type="button"
              onClick={onOpenAiKnowledge}
              className="text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-all flex items-center gap-1.5 bg-gradient-to-r from-cyan-950/90 via-blue-950/90 to-indigo-950/90 hover:from-cyan-900 hover:to-indigo-900 px-3 py-1.5 rounded-lg border border-cyan-500/50 shadow-sm shadow-cyan-950/50 active:scale-95 cursor-pointer"
              title={lang === 'vi' ? 'AI Tự Cập Nhật Tri Thức 12+ Loại Van & Bổ Sung Danh Mục Hệ Thống' : 'AI Valve Knowledge Hub & Catalog Supplements'}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{lang === 'vi' ? '🤖 AI Tri Thức & Bổ Sung Van' : '🤖 AI Valve Hub'}</span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-1 py-0.2 rounded text-[9px] font-mono font-bold">Gemini</span>
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Admin Pending Approvals Badge */}
          {isAdminMode && pendingDealersCount > 0 && onOpenManageDealers && (
            <button
              type="button"
              onClick={onOpenManageDealers}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-black shadow-lg animate-pulse transition-all active:scale-95"
              title="Xem danh sách đại lý B2B đang chờ phê duyệt"
            >
              <span>⏳ {pendingDealersCount} {lang === 'vi' ? 'Đại Lý Chờ Duyệt' : 'Pending Dealers'}</span>
            </button>
          )}

          {/* Centralized Portal CTA Button - Revealed for Admin */}
          {isAdminMode && onOpenPortal && (
            <button
              type="button"
              onClick={onOpenPortal}
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500 hover:from-blue-600 hover:to-amber-400 text-white px-3.5 py-2 rounded-lg text-xs font-black shadow-lg shadow-indigo-500/25 transition-all active:scale-95 border border-amber-400/30"
              title={lang === 'vi' ? 'Cổng Quản Trị Tập Trung (Kho, Báo giá, Kế hoạch, AI Settings, RBAC)' : 'Centralized Enterprise Portal'}
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>{lang === 'vi' ? 'Cổng Quản Trị (Portal)' : 'Central Portal'}</span>
            </button>
          )}

          {/* Register B2B Dealer Button */}
          {onOpenB2BRegistration && (
            <button
              type="button"
              onClick={onOpenB2BRegistration}
              className="flex items-center gap-1.5 bg-blue-950/90 hover:bg-blue-900 text-blue-200 border border-blue-500/60 hover:border-blue-400 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
              title={lang === 'vi' ? 'Đăng ký đại lý B2B nhận chiết khấu và quyền xuất bảng báo giá PDF' : 'Register as B2B Dealer to unlock PDF quotation'}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">{lang === 'vi' ? 'Đăng Ký Đại Lý B2B' : 'B2B Partner'}</span>
              <span className="md:hidden">Đại Lý</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900/98 border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-200 hover:text-amber-400 py-1.5 border-b border-slate-800/60"
              >
                {link.label}
              </a>
            ))}
            {onOpenB2BRegistration && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenB2BRegistration();
                }}
                className="text-left text-sm font-bold text-blue-300 py-1.5 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>{lang === 'vi' ? 'Đăng Ký Đại Lý B2B (Duyệt Lấy Báo Giá)' : 'B2B Partner Registration'}</span>
              </button>
            )}
            {isAdminMode && onOpenPortal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="text-left text-sm font-black text-amber-300 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 px-3 rounded-lg border border-amber-500/40 shadow"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{lang === 'vi' ? '🏛️ Cổng Quản Trị Tập Trung (Portal)' : '🏛️ Central Portal'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenKnowledge('pccc');
              }}
              className="text-left text-sm font-bold text-amber-400 py-1.5 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Kho Tri Thức Kỹ Thuật (PCCC, Steam, Đối Ứng Hãng)' : 'Knowledge Hub (Fire, Steam, Cross-Ref)'}</span>
            </button>
            {onOpenAiKnowledge && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiKnowledge();
                }}
                className="text-left text-sm font-bold text-cyan-300 py-1.5 flex items-center gap-2 bg-cyan-950/40 px-2 rounded-lg border border-cyan-500/30"
              >
                <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{lang === 'vi' ? '🤖 AI Tri Thức & Bổ Sung 12+ Loại Van (Gemini)' : '🤖 AI Valve Knowledge Hub (Gemini)'}</span>
              </button>
            )}
            {isAdminMode ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHosting();
                  }}
                  className="text-left text-sm font-bold text-amber-300 py-1.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'vi' ? '🚀 Upload Hosting & Tên Miền' : '🚀 Deploy Hosting & Domain'}</span>
                  </div>
                  {pendingChangesCount > 0 && (
                    <span className="bg-rose-500 text-white px-2 py-0.2 rounded-full text-[10px] font-mono font-bold animate-pulse">
                      {pendingChangesCount} thay đổi mới
                    </span>
                  )}
                </button>
                {onOpenMaterialAlert && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenMaterialAlert();
                    }}
                    className="text-left text-sm font-bold text-rose-300 py-1.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>{lang === 'vi' ? '🚨 Cảnh Báo Vật Liệu & Bảng Giá' : '🚨 Material Alert & Pricing'}</span>
                    </div>
                    <span className="bg-rose-950 text-rose-200 border border-rose-500 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                      +14.5% LME
                    </span>
                  </button>
                )}
                {onOpenAuditLogs && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuditLogs();
                    }}
                    className="text-left text-sm font-bold text-indigo-300 py-1.5 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>{lang === 'vi' ? '📋 Nhật Ký Hoạt Động (Audit Logs)' : '📋 Audit Logs'}</span>
                  </button>
                )}
                {onOpenExportCatalogModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenExportCatalogModal();
                    }}
                    className="text-left text-sm font-bold text-emerald-300 py-1.5 flex items-center gap-2"
                  >
                    <Languages className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'vi' ? '🌐 Xuất Danh Mục CSV Đã Dịch (Anh/Trung)' : '🌐 Export Translated CSV (EN/ZH)'}</span>
                  </button>
                )}
                {onOpenNotificationSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenNotificationSettings();
                    }}
                    className="text-left text-sm font-bold text-sky-300 py-1.5 flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4 text-sky-400" />
                    <span>{lang === 'vi' ? '🔔 Cấu Hình Thông Báo (Email & Telegram)' : '🔔 Alerts Settings (Email & Telegram)'}</span>
                  </button>
                )}
                {onOpenDataStorage && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDataStorage();
                    }}
                    className="text-left text-sm font-bold text-amber-300 py-1.5 flex items-center gap-2"
                  >
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'vi' ? '💾 Lưu Trữ & Backup Dữ Liệu' : '💾 Storage & Backup'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminMode(false);
                    setUserRole('guest');
                  }}
                  className="text-left text-sm font-bold text-red-400 py-1.5 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>{lang === 'vi' ? '🚪 Đăng Xuất Quản Trị Nội Bộ' : '🚪 Staff Logout'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenInternalLogin) onOpenInternalLogin();
                  else if (onOpenManageDealers) onOpenManageDealers();
                }}
                className="text-left text-sm font-bold text-amber-300 py-2 flex items-center gap-2 bg-amber-950/40 px-3 rounded-lg border border-amber-600/50 mt-1"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>{lang === 'vi' ? '🔐 Đăng Nhập Nội Bộ (Nhân Sự)' : '🔐 Staff / Admin Login'}</span>
              </button>
            )}

            {/* Mobile Language Switcher */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                {lang === 'vi' ? 'Ngôn Ngữ Website:' : 'Website Language:'}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { code: 'vi', label: '🇻🇳 Tiếng Việt' },
                  { code: 'en', label: '🇺🇸 English' },
                  { code: 'th', label: '🇹🇭 ภาษาไทย' },
                  { code: 'zh', label: '🇨🇳 中文' },
                  { code: 'pt', label: '🇵🇹 Português' },
                  { code: 'ar', label: '🇦🇪 UAE / العربية' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLang(item.code as SupportedLanguage);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-left transition-all ${
                      lang === item.code
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
