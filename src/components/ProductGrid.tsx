import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Layers, 
  Check, 
  Plus, 
  ShieldCheck, 
  Gauge, 
  Thermometer, 
  Link2, 
  Box, 
  CircleDot, 
  Disc, 
  ArrowDownUp, 
  Activity, 
  GitCommit, 
  Sparkles, 
  Wind, 
  Flame, 
  Wrench, 
  Edit3, 
  Globe,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  Clock,
  Pin
} from 'lucide-react';
import { ValveProduct, UserRole, SupportedLanguage } from '../types/valve';
import { TRANSLATIONS } from '../data/translations';
import { translateTechString } from '../utils/engineeringTranslator';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';
import { QuickCompareFloatingPanel } from './QuickCompareFloatingPanel';
import { QuickCompareModal } from './QuickCompareModal';

interface ProductGridProps {
  products: ValveProduct[];
  lang: SupportedLanguage;
  userRole: UserRole;
  isAdminMode: boolean;
  onOpenSpecs: (product: ValveProduct) => void;
  onToggleRfq: (product: ValveProduct) => void;
  onEditProductByAdmin?: (product: ValveProduct) => void;
  onAddNewProduct?: () => void;
  onOpenKnowledgeTopic?: (tab: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly') => void;
  rfqItemIds: string[];
}

interface ProductCardProps {
  valve: ValveProduct;
  lang: SupportedLanguage;
  userRole: UserRole;
  isAdminMode: boolean;
  isInRfq: boolean;
  isPinned: boolean;
  onTogglePin: (product: ValveProduct) => void;
  onOpenSpecs: (product: ValveProduct) => void;
  onToggleRfq: (product: ValveProduct) => void;
  onEditProductByAdmin?: (product: ValveProduct) => void;
  onOpenLightbox: (product: ValveProduct, initialIdx: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  valve,
  lang,
  userRole,
  isAdminMode,
  isInRfq,
  isPinned,
  onTogglePin,
  onOpenSpecs,
  onToggleRfq,
  onEditProductByAdmin,
  onOpenLightbox
}) => {
  const t = TRANSLATIONS[lang];
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const hoverIntervalRef = useRef<any>(null);

  const images = (valve.images && valve.images.length > 0) ? valve.images : [valve.image];

  // Mouse hover auto-slides images every 3 seconds (Yêu cầu 1)
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (images.length > 1) {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
    setCurrentImgIndex(0);
  };

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-slate-900/90 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/30 group relative ${
        valve.isHighPerformance 
          ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' 
          : 'border-slate-800 hover:border-slate-700/90'
      }`}
    >
      {/* Admin In-Place Edit Floating Button */}
      {isAdminMode && onEditProductByAdmin && (
        <button
          type="button"
          onClick={() => onEditProductByAdmin(valve)}
          className="absolute top-2 left-2 z-30 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xl shadow-amber-500/40 border border-amber-300 animate-pulse"
          title={lang === 'vi' ? 'Admin sửa nội dung & chỉnh ảnh Studio' : (lang === 'zh' ? '管理员编辑参数与图片' : 'Admin edit specs & studio image')}
        >
          <Edit3 className="w-3 h-3" />
          <span>{lang === 'vi' ? '✏️ Sửa Admin' : (lang === 'zh' ? '✏️ 管理员编辑' : '✏️ Admin Edit')}</span>
        </button>
      )}

      {/* Quick Compare Pin Toggle Button (Yêu cầu 1) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(valve);
        }}
        className={`absolute ${isAdminMode && onEditProductByAdmin ? 'top-10' : 'top-2'} left-2 z-30 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-md transition-all ${
          isPinned
            ? 'bg-amber-500 text-slate-950 font-black border border-amber-300 ring-2 ring-amber-400/50'
            : 'bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-400/60'
        }`}
        title={isPinned ? (lang === 'vi' ? 'Bỏ ghim so sánh nhanh' : (lang === 'zh' ? '取消固定对比' : 'Unpin comparison')) : (lang === 'vi' ? 'Ghim để so sánh nhanh (tối đa 3 van)' : (lang === 'zh' ? '固定以快速对比(最多3款)' : 'Pin to compare (max 3 valves)'))}
      >
        <Pin className={`w-3 h-3 ${isPinned ? 'fill-current rotate-45 text-slate-950' : 'text-amber-400'}`} />
        <span>{isPinned ? (lang === 'vi' ? 'Đã Ghim' : (lang === 'zh' ? '已固定' : 'Pinned')) : (lang === 'vi' ? 'Ghim So Sánh' : (lang === 'zh' ? '快速对比' : 'Quick Compare'))}</span>
      </button>

      {/* Top Image & Badge Box (Click to enlarge / Lightbox) */}
      <div 
        onClick={() => onOpenLightbox(valve, currentImgIndex)}
        className="relative aspect-4/3 bg-slate-950 overflow-hidden border-b border-slate-800 flex items-center justify-center p-2 cursor-pointer group/img"
        title={lang === 'vi' ? 'Click để phóng to ảnh chất lượng cao' : (lang === 'zh' ? '点击查看高清大图' : 'Click to view full-size photo')}
      >
        <img
          src={resolveProductImageUrl(images[currentImgIndex] || valve.image)}
          alt={lang === 'vi' ? valve.name : translateTechString(valve.name, valve.nameEn, lang)}
          className="max-w-full max-h-full object-contain group-hover/img:scale-105 transition-transform duration-500 filter brightness-95 contrast-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70 pointer-events-none" />

        {/* Status / Feature Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {valve.badge && (
            <span className={`font-extrabold text-[10px] px-2 py-0.5 rounded shadow uppercase tracking-wider ${
              valve.isHighPerformance 
                ? 'bg-emerald-500 text-slate-950' 
                : 'bg-amber-500 text-slate-950'
            }`}>
              {lang === 'vi' ? valve.badge : translateTechString(valve.badge, undefined, lang)}
            </span>
          )}
          <span className="bg-slate-950/90 backdrop-blur-md text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
            {lang === 'vi' ? valve.systemGroupLabel : translateTechString(valve.systemGroupLabel, valve.categoryLabelEn, lang)}
          </span>
          {valve.isCustomized && (
            <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/50 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span>{lang === 'vi' ? 'Khóa Admin' : (lang === 'zh' ? '管理员锁定' : 'Admin Locked')}</span>
            </span>
          )}
        </div>

        {/* Model Code & Brand Pill */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1 pointer-events-none">
          <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950/90 border border-blue-700/60 px-2.5 py-0.5 rounded shadow">
            {valve.code}
          </span>
          <span className="text-[10px] font-bold text-amber-300 bg-slate-950/90 border border-amber-500/40 px-2.5 py-0.5 rounded shadow flex items-center gap-1">
            <span>
              {valve.brand === 'VYC-Spain' ? '🇪🇸' :
               valve.brand === 'Shield Valve UK' ? '🇬🇧' :
               valve.brand === 'JMV-Korea' ? '🇰🇷' :
               valve.brand === 'Johnson Controls' ? '🇺🇸' :
               valve.brand === 'Tyco' ? '🇺🇸' : '🇺🇸'}
            </span>
            <span>{valve.brand || 'UTD'}</span>
          </span>
        </div>

        {/* 3s Auto-Slide Indicator & Multi-image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-11 left-0 right-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
            {images.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`transition-all duration-300 rounded-full shadow ${
                  dotIdx === currentImgIndex 
                    ? 'w-4 h-1.5 bg-amber-400' 
                    : 'w-1.5 h-1.5 bg-white/60'
                }`}
              />
            ))}
            {isHovered && (
              <span className="ml-1 px-1.5 py-0.2 rounded bg-slate-950/80 border border-amber-500/40 text-[9px] font-mono text-amber-300 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> 3s ({currentImgIndex + 1}/{images.length})
              </span>
            )}
          </div>
        )}

        {/* Lightbox Click Hint Button */}
        <div className="absolute bottom-11 right-3 z-20 opacity-0 group-hover/img:opacity-100 transition-opacity">
          <span className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-1 text-[10px] font-mono shadow-lg">
            <Maximize2 className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'vi' ? 'Phóng to' : 'Enlarge'}</span>
          </span>
        </div>

        {/* Bottom Quick Specs Ribbon on Image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-mono bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800 z-10 pointer-events-none">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Gauge className="w-3 h-3" />
            {valve.pressure}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200">
            {valve.sizeRange}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
            {lang === 'vi' 
              ? valve.name 
              : (lang === 'zh' && valve.nameZh ? valve.nameZh : (lang === 'th' && valve.nameTh ? valve.nameTh : translateTechString(valve.name, valve.nameEn, lang)))}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {lang === 'vi' 
              ? valve.description 
              : (lang === 'zh' && valve.descriptionZh ? valve.descriptionZh : (lang === 'th' && valve.descriptionTh ? valve.descriptionTh : translateTechString(valve.description, valve.descriptionEn, lang)))}
          </p>

          {/* Valve Technical Characteristics Box (Đặc Tính của Van - Bỏ chữ AI Tổng Hợp theo Yêu cầu 2) */}
          {valve.characteristics && (
            <div className="mt-3 bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-blue-950/30 border border-amber-500/40 hover:border-amber-400/80 rounded-xl p-3 space-y-2 text-[11px] transition-all shadow-md relative group/char">
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
                <span className="font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {lang === 'vi' ? 'Đặc Tính Kỹ Thuật:' : (lang === 'th' ? 'คุณลักษณะทางเทคนิค:' : (lang === 'zh' ? '技术特性指标:' : (lang === 'pt' ? 'Características Técnicas:' : (lang === 'ar' ? 'المواصفات الفنية التشغيلية:' : 'Technical Characteristics:'))))}
                </span>
                {isAdminMode && onEditProductByAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProductByAdmin(valve);
                    }}
                    className="text-amber-400 hover:text-white bg-amber-500/20 hover:bg-amber-500 px-2 py-0.5 rounded text-[10px] font-bold transition-colors flex items-center gap-1"
                    title={lang === 'vi' ? 'Admin chỉnh sửa đặc tính' : 'Admin edit characteristics'}
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>{lang === 'vi' ? 'Sửa' : 'Edit'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 font-mono text-[10px]">
                <div className="flex items-start gap-1">
                  <span className="text-amber-400 font-bold shrink-0">⏱️ {lang === 'vi' ? 'Tuổi thọ:' : (lang === 'zh' ? '使用寿命:' : 'Lifecycle:')}</span>
                  <span className="text-white font-medium line-clamp-1">
                    {lang === 'vi'
                      ? valve.characteristics.lifecycle
                      : translateTechString(valve.characteristics.lifecycle, valve.characteristics.lifecycleEn, lang)}
                  </span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-sky-400 font-bold shrink-0">🌡️ {lang === 'vi' ? 'Nhiệt độ:' : (lang === 'zh' ? '工作温度:' : 'Temp:')}</span>
                  <span className="text-white font-medium line-clamp-1">
                    {lang === 'vi'
                      ? valve.characteristics.tempLimits
                      : translateTechString(valve.characteristics.tempLimits, valve.characteristics.tempLimitsEn, lang)}
                  </span>
                </div>
                <div className="flex items-start gap-1 sm:col-span-2">
                  <span className="text-emerald-400 font-bold shrink-0">🛡️ {lang === 'vi' ? 'Độ kín:' : (lang === 'zh' ? '密封等级:' : 'Sealing:')}</span>
                  <span className="text-slate-200 line-clamp-1">
                    {lang === 'vi'
                      ? valve.characteristics.sealIntegrity
                      : translateTechString(valve.characteristics.sealIntegrity, valve.characteristics.sealIntegrityEn, lang)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Technical Specs Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">{t.materialLabel}:</span>
              <span className="text-slate-200 font-semibold truncate block" title={lang === 'vi' ? valve.material : translateTechString(valve.material, valve.materialEn, lang)}>
                {lang === 'vi' ? valve.material : translateTechString(valve.material, valve.materialEn, lang)}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">{t.tempLabel}:</span>
              <span className="text-slate-200 font-mono font-semibold truncate block">
                {valve.tempRange}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">{t.connectionLabel}:</span>
              <span className="text-slate-300 truncate block text-[11px]" title={valve.connection}>
                {lang === 'vi' ? valve.connection : translateTechString(valve.connection, undefined, lang)}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Policy & CTA Buttons */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {lang === 'vi' ? 'Chính Sách Giá Dự Án:' : (lang === 'zh' ? '工程项目报价政策:' : 'Project Pricing Policy:')}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-amber-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {lang === 'vi' ? 'Báo Giá Dự Án Theo Khối Lượng' : (lang === 'zh' ? '按采购批量核算项目特惠价' : 'Project Quotation by Volume')}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700/80 shrink-0">
              {lang === 'vi' ? 'Hỗ trợ RFQ 24/7' : (lang === 'zh' ? '24/7 快速询价响应' : '24/7 RFQ Support')}
            </span>
          </div>

          {/* Buttons Action Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpenSpecs(valve)}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.viewSpecsBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleRfq(valve)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-extrabold transition-all active:scale-95 ${
                isInRfq
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {isInRfq ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{t.addedToRfq}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-slate-950" />
                  <span>{t.addRfqBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  lang,
  userRole,
  isAdminMode,
  onOpenSpecs,
  onToggleRfq,
  onEditProductByAdmin,
  onAddNewProduct,
  onOpenKnowledgeTopic,
  rfqItemIds,
}) => {
  const t = TRANSLATIONS[lang];

  // Quick Compare Pinned state & Modal Overlay
  const [pinnedValves, setPinnedValves] = useState<ValveProduct[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleTogglePin = (valve: ValveProduct) => {
    setPinnedValves((prev) => {
      const exists = prev.some((p) => p.id === valve.id);
      if (exists) {
        return prev.filter((p) => p.id !== valve.id);
      }
      if (prev.length >= 3) {
        alert(
          lang === 'vi'
            ? 'Bạn chỉ có thể ghim tối đa 3 sản phẩm để so sánh nhanh cùng lúc! Vui lòng bỏ bớt 1 van trước khi ghim thêm.'
            : 'You can pin up to 3 products for quick compare at a time! Please unpin one first.'
        );
        return prev;
      }
      return [...prev, valve];
    });
  };

  // Lightbox Modal state (Yêu cầu 1: click vào xem được ảnh lớn hơn)
  const [lightboxValve, setLightboxValve] = useState<ValveProduct | null>(null);
  const [lightboxImgIndex, setLightboxImgIndex] = useState(0);

  const lightboxImages = lightboxValve 
    ? ((lightboxValve.images && lightboxValve.images.length > 0) ? lightboxValve.images : [lightboxValve.image])
    : [];

  const handleOpenLightbox = (product: ValveProduct, initialIdx: number = 0) => {
    setLightboxValve(product);
    setLightboxImgIndex(initialIdx);
  };

  return (
    <div>
      {/* Admin Mode Top Action Bar */}
      {isAdminMode && onAddNewProduct && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border-2 border-dashed border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-amber-300 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <strong className="block text-white font-bold">Admin Visual CMS & Studio:</strong>
              <span>{lang === 'vi' ? 'Bạn có thể thêm dòng van mới, upload 1-3 ảnh (tự đổi 3s/hình), chỉnh sửa thông số kỹ thuật và tối ưu SEO.' : 'Add new valve models, upload 1-3 images with 3s hover cycle, customize specs and optimize SEO.'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddNewProduct}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'vi' ? '➕ THÊM SẢN PHẨM MỚI VÀO WEBSITE' : '➕ ADD NEW PRODUCT TO CATALOG'}</span>
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center my-8">
          <Box className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">
            {lang === 'vi' ? 'Không tìm thấy dòng van phù hợp tiêu chí lọc' : 'No valves match selected criteria'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {lang === 'vi' 
              ? 'Vui lòng chọn hệ thống khác hoặc xóa bớt tiêu chí lọc.' 
              : 'Please select another system group or reset your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 my-8">
          {/* Admin Add New Card within Grid */}
          {isAdminMode && onAddNewProduct && (
            <div
              onClick={onAddNewProduct}
              className="bg-slate-900/50 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-amber-500/5 hover:-translate-y-1 group min-h-[380px]"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <h4 className="text-base font-extrabold text-white mb-2">
                {lang === 'vi' ? 'Thêm Sản Phẩm Mới' : 'Add New Product'}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                {lang === 'vi' 
                  ? 'Tự động co giãn hình ảnh 4:3, chỉnh sửa thông số kỹ thuật và tạo nội dung chuẩn SEO chuyên nghiệp.' 
                  : 'Auto 4:3 aspect ratio framing, specification customization, and professional cataloging.'}
              </p>
              <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                {lang === 'vi' ? 'Mở Admin Studio' : 'Open Admin Studio'}
              </span>
            </div>
          )}

          {products.map((valve) => (
            <ProductCard
              key={valve.id}
              valve={valve}
              lang={lang}
              userRole={userRole}
              isAdminMode={isAdminMode}
              isInRfq={rfqItemIds.includes(valve.id)}
              isPinned={pinnedValves.some((p) => p.id === valve.id)}
              onTogglePin={handleTogglePin}
              onOpenSpecs={onOpenSpecs}
              onToggleRfq={onToggleRfq}
              onEditProductByAdmin={onEditProductByAdmin}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>
      )}

      {/* Persistent Floating Quick Compare Panel (Yêu cầu 1) */}
      <QuickCompareFloatingPanel
        pinnedProducts={pinnedValves}
        onRemoveProduct={(id) => setPinnedValves((prev) => prev.filter((p) => p.id !== id))}
        onClearAll={() => setPinnedValves([])}
        lang={lang}
        onOpenSpecs={onOpenSpecs}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      {/* Dedicated Quick Compare Modal Overlay */}
      <QuickCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={pinnedValves}
        lang={lang}
        onRemoveProduct={(id) => {
          setPinnedValves((prev) => prev.filter((p) => p.id !== id));
        }}
      />

      {/* Image Lightbox Full-Size Modal (Yêu cầu 1) */}
      {lightboxValve && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxValve(null)}
        >
          <div 
            className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/40 px-2.5 py-1 rounded">
                  {lightboxValve.code}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {lang === 'vi' ? lightboxValve.name : lightboxValve.nameEn}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lightboxValve.brand || 'UTD'} • {lightboxValve.material} • {lightboxValve.pressure}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLightboxValve(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 bg-slate-950 flex items-center justify-center p-6 min-h-[350px] max-h-[550px] overflow-hidden select-none">
              <img
                src={resolveProductImageUrl(lightboxImages[lightboxImgIndex] || lightboxValve.image)}
                alt={lightboxValve.name}
                className="max-w-full max-h-[500px] object-contain transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                }}
              />

              {lightboxImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setLightboxImgIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 shadow-xl transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxImgIndex((prev) => (prev + 1) % lightboxImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 shadow-xl transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Footer & Thumbnail Strip */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {lightboxImages.length > 1 ? (
                <div className="flex items-center gap-2">
                  {lightboxImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxImgIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all p-1 bg-slate-900 ${
                        idx === lightboxImgIndex 
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20' 
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={resolveProductImageUrl(img)} 
                        alt={`Thumb ${idx + 1}`} 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                  <span className="text-[11px] text-slate-400 font-mono ml-2">
                    {lightboxImgIndex + 1} / {lightboxImages.length}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  {lang === 'vi' ? 'Ảnh kỹ thuật độ phân giải chuẩn' : 'High-resolution technical engineering asset'}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onOpenSpecs(lightboxValve);
                    setLightboxValve(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  {lang === 'vi' ? 'Xem Toàn Bộ Bản Vẽ Specs' : 'View Full Technical Specs'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleRfq(lightboxValve);
                    setLightboxValve(null);
                  }}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
                >
                  {lang === 'vi' ? 'Thêm Vào Yêu Cầu Báo Giá' : 'Add to RFQ Quote'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
