import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Filter, 
  Layers, 
  ShieldAlert, 
  Gauge, 
  Droplet, 
  Flame, 
  Wind, 
  Wrench, 
  BookOpen, 
  Activity, 
  Sparkles 
} from 'lucide-react';
import { FilterState, SystemGroup, CategoryItem, SupportedLanguage } from '../types/valve';
import { TRANSLATIONS } from '../data/translations';
import { DEFAULT_CATEGORIES } from '../data/categoryData';
import { translateTechString } from '../utils/engineeringTranslator';
import { SemanticParsedQuery } from '../utils/semanticSearch';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  totalProducts: number;
  lang: SupportedLanguage;
  onOpenKnowledge: (tab?: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly') => void;
  categories?: CategoryItem[];
  isAdminMode?: boolean;
  onOpenCategoryManager?: () => void;
  semanticQuery?: SemanticParsedQuery | null;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  totalMatches,
  totalProducts,
  lang,
  onOpenKnowledge,
  categories = DEFAULT_CATEGORIES,
  isAdminMode = false,
  onOpenCategoryManager,
  semanticQuery,
}) => {
  const t = TRANSLATIONS[lang];

  // 1. System Applications Groups requested by user
  const systemGroups: { value: SystemGroup; label: string; icon: React.ComponentType<{ className?: string }>; countBadge?: string }[] = [
    { value: 'all', label: lang === 'vi' ? 'Tất cả hệ thống' : (lang === 'zh' ? '全部应用管系' : 'All Systems'), icon: Layers },
    { value: 'firefighting', label: lang === 'vi' ? 'Fire Fighting valve (Hệ PCCC)' : (lang === 'zh' ? '消防管网系统 (UL/FM 认证)' : 'Fire Protection Valves'), icon: Flame },
    { value: 'hvac', label: lang === 'vi' ? 'HVAC Valve (Chiller / PICV)' : (lang === 'zh' ? '暖通空调系统 (HVAC Chiller / PICV)' : 'HVAC Chiller & Balancing'), icon: Activity },
    { value: 'water', label: lang === 'vi' ? 'Water System (Hệ Cấp Thoát Nước)' : (lang === 'zh' ? '给排水系统 (市政供水/水务)' : 'Water Utilities & Municipal'), icon: Droplet },
    { value: 'steam', label: lang === 'vi' ? 'Steam valve (Hệ Hơi Nóng)' : (lang === 'zh' ? '蒸汽系统 (高温高压蒸汽)' : 'Industrial Steam Loops'), icon: Gauge },
    { value: 'oilgas', label: lang === 'vi' ? 'Oil&Gas (Hệ Dầu Khí)' : (lang === 'zh' ? '石油天然气系统 (API 6D)' : 'Oil & Gas Pipelines'), icon: Wrench },
    { value: 'gas_cryogenic', label: lang === 'vi' ? 'Gas or Cryogenic (Khí Công Nghiệp)' : (lang === 'zh' ? '工业气体与深冷系统 (Cryogenic)' : 'Industrial Gas & Cryogenic'), icon: Wind },
    { value: 'instrument', label: lang === 'vi' ? 'Instrument (Đo Lường)' : (lang === 'zh' ? '自控仪表与量测系统 (Instrument)' : 'Instrumentation & Sensors'), icon: Sparkles },
  ];

  // 2. Dynamic Categories from props or catalogue default
  const orderedCategories = [
    { value: 'all', label: lang === 'vi' ? 'Tất cả loại van' : (lang === 'zh' ? '全部阀门类型' : 'All Types') },
    ...categories.map((c) => ({
      value: c.value,
      label: lang === 'vi' ? c.label : (lang === 'zh' ? translateTechString(c.label, c.labelEn, 'zh') : c.labelEn),
    })),
  ];

  const authorizedBrandsFilter = [
    { value: 'all', label: lang === 'vi' ? 'Tất cả thương hiệu (All Brands)' : 'All Brands' },
    { value: 'UTD', label: 'UTD Valves (Brand USA - Thái Lan, Đài Loan, Trung Quốc)' },
    { value: 'JMV-Korea', label: 'JMV-Korea (Hàn Quốc)' },
    { value: 'Johnson Controls', label: 'Johnson Controls (Mỹ)' },
    { value: 'Tyco', label: 'Tyco (UL/FM PCCC)' },
    { value: 'Shield Valve UK', label: 'Shield Valve UK (Anh)' },
    { value: 'VYC-Spain', label: 'VYC-Spain (Tây Ban Nha)' },
  ];

  const materials = [
    { value: 'all', label: t.filterAllMaterials },
    { value: 'ss304_316', label: 'Inox 304 / 316 (SS316)' },
    { value: 'ductile_iron', label: 'Gang cầu (GGG50)' },
    { value: 'cast_steel', label: 'Thép đúc (WCB / GS-C25)' },
    { value: 'special_alloy', label: 'Hợp kim đặc biệt / Stellite' },
  ];

  const pressures = [
    { value: 'all', label: t.filterAllPressures },
    { value: 'pn10', label: 'PN10 (10 Bar)' },
    { value: 'pn16', label: 'PN16 (16 Bar / 232 PSI)' },
    { value: 'pn25', label: 'PN25 / ANSI 150 (25 Bar)' },
    { value: 'pn40', label: 'PN40 / ANSI 300 (40 Bar)' },
    { value: 'ansi600', label: 'Class 600 - 2500 (High Pressure)' },
  ];

  const handleReset = () => {
    setFilter({
      search: '',
      category: 'all',
      systemGroup: 'all',
      materialGroup: 'all',
      pressureGroup: 'all',
      sizeCategory: 'all',
      media: 'all',
      brand: 'all',
    });
  };

  const isFiltered = 
    filter.search !== '' ||
    filter.category !== 'all' ||
    filter.systemGroup !== 'all' ||
    filter.materialGroup !== 'all' ||
    filter.pressureGroup !== 'all' ||
    (filter.brand && filter.brand !== 'all');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* 1. System Group Tabs (PCCC, HVAC, Water, Oil&Gas, Steam, Gas/Cryogenic, Instrument) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Layers className="w-4 h-4 text-amber-400" />
            {lang === 'vi' ? 'NHÓM VAN THEO HỆ THỐNG ỨNG DỤNG:' : 'SYSTEM APPLICATION GROUPS:'}
          </span>

          {/* Quick Shortcuts to Knowledge Hub */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenKnowledge('pccc')}
              className="text-[11px] font-bold text-red-300 bg-red-950/70 border border-red-800 hover:bg-red-900 px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
            >
              <Flame className="w-3 h-3 text-red-400" />
              <span>{lang === 'vi' ? 'Cẩm Nang PCCC' : 'Fire Safety Guide'}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenKnowledge('steam')}
              className="text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-800 hover:bg-amber-900 px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
            >
              <Gauge className="w-3 h-3 text-amber-400" />
              <span>{lang === 'vi' ? 'Kỹ Thuật Hệ Steam' : 'Steam Tech Guide'}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenKnowledge('cross_ref')}
              className="text-[11px] font-bold text-blue-300 bg-blue-950/70 border border-blue-800 hover:bg-blue-900 px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>{lang === 'vi' ? 'Tra Tương Đương Quốc Tế' : 'Cross-Ref Matrix'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {systemGroups.map((sys) => {
            const Icon = sys.icon;
            const isSelected = filter.systemGroup === sys.value;
            return (
              <button
                key={sys.value}
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, systemGroup: sys.value }))}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/40 ring-1 ring-blue-400'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{sys.label}</span>
              </button>
            );
          })}
        </div>

        {/* Brand Filter Quick Chips */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase shrink-0 mr-1">
            {lang === 'vi' ? 'THƯƠNG HIỆU:' : 'BRANDS:'}
          </span>
          {authorizedBrandsFilter.map((b) => {
            const isBrandActive = (filter.brand || 'all') === b.value;
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, brand: b.value }))}
                className={`text-[11px] px-2.5 py-1 rounded-md font-bold shrink-0 transition-all flex items-center gap-1 ${
                  isBrandActive
                    ? 'bg-amber-500 text-slate-950 shadow shadow-amber-500/20 font-extrabold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{b.value === 'all' ? (lang === 'vi' ? 'Tất cả' : 'All') : b.value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Multi-Parameter Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-3 border-t border-slate-800">
        {/* Search Keyword */}
        <div className="lg:col-span-3 relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Search className="w-3 h-3 text-slate-400" />
              <span>{lang === 'vi' ? 'Tìm Kiếm Ngữ Nghĩa (Semantic)' : 'Natural Language Search'}</span>
            </label>
            <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-700/60">
              AI NLP
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
              placeholder={lang === 'vi' ? 'VD: van chịu nhiệt 300 độ cho hơi nóng...' : 'e.g. 300C steam valve, ss316 chemical...'}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Ordered Valve Categories Dropdown */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-400 uppercase">
              {lang === 'vi' ? 'Danh mục loại van' : 'Valve Categories'}
            </label>
            {isAdminMode && onOpenCategoryManager && (
              <button
                type="button"
                onClick={onOpenCategoryManager}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-0.5"
                title="Admin: Thêm, xóa hoặc sắp xếp thứ tự 20 danh mục"
              >
                <span>⚙️ Quản lý thứ tự</span>
              </button>
            )}
          </div>
          <select
            value={filter.category}
            onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-medium"
          >
            {orderedCategories.map((c) => (
              <option key={c.value} value={c.value} className="bg-slate-900 text-slate-200">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {lang === 'vi' ? 'Thương hiệu' : 'Brand'}
          </label>
          <select
            value={filter.brand || 'all'}
            onChange={(e) => setFilter((prev) => ({ ...prev, brand: e.target.value }))}
            className="w-full bg-slate-950 border border-amber-500/40 rounded-lg px-2 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
          >
            {authorizedBrandsFilter.map((b) => (
              <option key={b.value} value={b.value} className="bg-slate-900 text-slate-200 font-normal">
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Material Filter */}
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-emerald-400" />
            {lang === 'vi' ? 'Vật liệu' : 'Metallurgy'}
          </label>
          <select
            value={filter.materialGroup}
            onChange={(e) => setFilter((prev) => ({ ...prev, materialGroup: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            {materials.map((m) => (
              <option key={m.value} value={m.value} className="bg-slate-900 text-slate-200">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pressure Rating */}
        <div className="lg:col-span-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-blue-400" />
            {lang === 'vi' ? 'Áp lực' : 'Pressure'}
          </label>
          <select
            value={filter.pressureGroup}
            onChange={(e) => setFilter((prev) => ({ ...prev, pressureGroup: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-1.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
          >
            {pressures.map((p) => (
              <option key={p.value} value={p.value} className="bg-slate-900 text-slate-200">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="lg:col-span-1 flex items-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isFiltered}
            title={t.filterReset}
            className={`w-full py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              isFiltered
                ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-500/30'
                : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="lg:hidden">{t.filterReset}</span>
          </button>
        </div>
      </div>

      {/* AI Semantic Search Interpretation Banner */}
      {semanticQuery && semanticQuery.hasSemanticIntent && (
        <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/50 p-2.5 rounded-xl flex items-center justify-between flex-wrap gap-2 animate-fade-in shadow-inner text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="font-bold text-indigo-300 font-mono">
              {lang === 'vi' ? 'AI Semantic Interpretation:' : 'AI Semantic Interpretation:'}
            </span>
            <span className="text-white font-medium">
              {lang === 'vi' ? semanticQuery.summaryLabelVi : semanticQuery.summaryLabelEn}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/40">
              ✓ {totalMatches} {lang === 'vi' ? 'dòng van phù hợp' : 'valves matched'}
            </span>
            <button
              type="button"
              onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
              className="text-slate-400 hover:text-white text-xs ml-1"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Semantic Query Suggestions when search is empty */}
      {!filter.search && (
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] pt-1">
          <span className="text-slate-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {lang === 'vi' ? 'Gợi ý tìm kiếm tự nhiên:' : 'Semantic prompts:'}
          </span>
          {[
            'van chịu nhiệt 300 độ cho hơi nóng',
            'van inox 316 dùng cho hóa chất',
            'van bướm DN100 chiller',
            'van cổng chữa cháy 300 psi'
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFilter(prev => ({ ...prev, search: prompt }))}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/80 transition-colors font-mono text-[10px]"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      )}

      {/* Filter Status Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {lang === 'vi' ? 'Hiển thị' : 'Showing'}{' '}
            <strong className="text-white font-mono">{totalMatches}</strong> / {totalProducts}{' '}
            {lang === 'vi' ? 'dòng van UTD' : 'valve models'}
          </span>
        </div>

        {isFiltered && (
          <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
            {lang === 'vi' ? 'Đang lọc đa thông số' : 'Active filters'}
          </span>
        )}
      </div>
    </div>
  );
};
