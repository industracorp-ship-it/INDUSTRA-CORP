import React, { useState, useMemo, useRef } from 'react';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Layers, 
  ShieldAlert, 
  Flame, 
  ChevronRight,
  ChevronLeft,
  Clock,
  BookOpen,
  X,
  Send,
  Loader2,
  ArrowUpDown,
  Camera
} from 'lucide-react';
import { ProjectRecord, ProjectIndustry, SupportedLanguage } from '../types/valve';
import { synthesizeProjectFromOrder } from '../utils/aiProjectGenerator';
import { translateTechString } from '../utils/engineeringTranslator';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';
import { ProjectPhotoManagerModal } from './ProjectPhotoManagerModal';

interface ProjectsShowcaseSectionProps {
  projects: ProjectRecord[];
  onAddProject: (project: ProjectRecord) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProject?: (project: ProjectRecord) => void;
  onReorderProjects?: (projects: ProjectRecord[]) => void;
  onOpenAdminTimeline?: () => void;
  lang: SupportedLanguage;
  isAdminMode: boolean;
}

export const ProjectsShowcaseSection: React.FC<ProjectsShowcaseSectionProps> = ({
  projects,
  onAddProject,
  onDeleteProject,
  onUpdateProject,
  onReorderProjects,
  onOpenAdminTimeline,
  lang,
  isAdminMode
}) => {
  const currentYear = new Date().getFullYear();

  // Filters
  const [selectedDecade, setSelectedDecade] = useState<'all' | '2000s' | '2010s' | '2020s'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Horizontal Timeline scroll ref
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Modals
  const [activeProjectForReading, setActiveProjectForReading] = useState<ProjectRecord | null>(null);
  const [isAiGenModalOpen, setIsAiGenModalOpen] = useState<boolean>(false);
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState<boolean>(false);
  const [targetPhotoProjectId, setTargetPhotoProjectId] = useState<string | undefined>(undefined);

  // Admin Project Creator Form state
  const [inputProjectName, setInputProjectName] = useState('');
  const [inputProjectNameEn, setInputProjectNameEn] = useState('');
  const [inputYear, setInputYear] = useState<number>(currentYear);
  const [inputIndustry, setInputIndustry] = useState<ProjectRecord['industry']>('oil_gas');
  const [inputCustomer, setInputCustomer] = useState('');
  const [inputContractor, setInputContractor] = useState('');
  const [inputLocation, setInputLocation] = useState('');
  const [inputContractValue, setInputContractValue] = useState('');
  const [inputSuppliedValves, setInputSuppliedValves] = useState('');
  const [inputSummary, setInputSummary] = useState('');
  const [inputArticleContent, setInputArticleContent] = useState('');
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [inputNotes, setInputNotes] = useState('');
  const [isDraftingWithAi, setIsDraftingWithAi] = useState(false);
  const [genSuccessToast, setGenSuccessToast] = useState<string | null>(null);

  const handleUpdateProjectPhoto = (projectId: string, newImageUrl: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;
    const updated: ProjectRecord = { ...proj, imageUrl: newImageUrl };
    if (onUpdateProject) {
      onUpdateProject(updated);
    }
  };

  // Complete continuous timeline years from 2009 to currentYear
  const timelineYears = useMemo(() => {
    const list: number[] = [];
    for (let yr = 2009; yr <= currentYear; yr++) {
      list.push(yr);
    }
    return list;
  }, [currentYear]);

  // Project count mapping per year
  const projectCountByYear = useMemo(() => {
    const map: Record<number, number> = {};
    projects.forEach(p => {
      map[p.year] = (map[p.year] || 0) + 1;
    });
    return map;
  }, [projects]);

  // Available unique years from 2009 to current for select dropdown
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    projects.forEach(p => yearsSet.add(p.year));
    yearsSet.add(2009);
    yearsSet.add(currentYear);
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [projects, currentYear]);

  // Scroll timeline helper
  const handleScrollTimeline = (direction: 'left' | 'right') => {
    if (timelineScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered projects by decade, year, industry, brand and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Decade Filter
      if (selectedDecade !== 'all') {
        if (selectedDecade === '2000s' && p.year > 2009) return false;
        if (selectedDecade === '2010s' && (p.year < 2010 || p.year > 2019)) return false;
        if (selectedDecade === '2020s' && p.year < 2020) return false;
      }

      // 2. Exact Year Filter
      if (selectedYear !== 'all') {
        if (p.year.toString() !== selectedYear) return false;
      }

      // 3. Industry Filter
      if (selectedIndustry !== 'all') {
        if (p.industry !== selectedIndustry) return false;
      }

      // 4. Brand Filter
      if (selectedBrand !== 'all') {
        if (!p.brandsUsed.includes(selectedBrand)) return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        const matchesClient = p.clientInvestor.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesContractor = p.epcContractor.toLowerCase().includes(q);
        if (!matchesName && !matchesClient && !matchesLoc && !matchesContractor) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedDecade, selectedYear, selectedIndustry, selectedBrand, searchQuery]);

  // 1. Admin Saves and Publishes Project (AI NEVER adds automatically)
  const handleAdminSaveProject = () => {
    if (!inputProjectName.trim()) {
      alert(lang === 'vi' ? 'Vui lòng nhập tên công trình / dự án!' : 'Please enter project name!');
      return;
    }

    const industryLabels: Record<string, { vi: string; en: string }> = {
      oil_gas: { vi: 'Dầu khí & Hóa chất', en: 'Oil & Gas / Petrochemicals' },
      power_energy: { vi: 'Nhiệt điện & Năng lượng', en: 'Power & Energy Plants' },
      steel_metal: { vi: 'Thép & Luyện kim', en: 'Steel & Metallurgical' },
      hvac_bldg: { vi: 'Tòa nhà cao tầng & HVAC Chiller', en: 'Commercial High-Rise & HVAC' },
      data_center: { vi: 'Trung tâm dữ liệu (Data Center)', en: 'High-Tech Data Centers' },
      water_infra: { vi: 'Cấp thoát nước & Môi trường', en: 'Water Supply & Infrastructure' },
      other: { vi: 'Công nghiệp & Sản xuất', en: 'General Industrial' }
    };

    const chosenIndustry = industryLabels[inputIndustry] || industryLabels.oil_gas;

    const newProj: ProjectRecord = {
      id: `proj-${inputYear}-${Date.now().toString(36)}`,
      name: inputProjectName.trim(),
      nameEn: inputProjectNameEn.trim() || inputProjectName.trim(),
      year: Number(inputYear) || currentYear,
      completionDate: `Năm ${inputYear || currentYear}`,
      industry: inputIndustry,
      industryLabel: chosenIndustry.vi,
      industryLabelEn: chosenIndustry.en,
      clientInvestor: inputCustomer.trim() || (lang === 'vi' ? 'Chủ đầu tư dự án' : 'Project Investor'),
      clientInvestorEn: inputCustomer.trim() || 'Project Investor',
      epcContractor: inputContractor.trim() || (lang === 'vi' ? 'Tổng thầu EPC' : 'EPC Contractor'),
      location: inputLocation.trim() || 'Việt Nam',
      contractValueVnd: inputContractValue.trim() || (lang === 'vi' ? 'Gói thầu thiết bị' : 'Equipment Package'),
      brandsUsed: ['UTD', 'VYC-Spain', 'JMV-Korea', 'Shield Valve UK'],
      suppliedValves: [
        {
          brand: 'UTD',
          valveType: inputSuppliedValves.trim() || 'Hệ thống van công nghiệp chuẩn ISO/ASME',
          quantity: 'Gói thầu công trình',
          specs: 'DN15 - DN400'
        }
      ],
      summary: inputSummary.trim() || `Dự án cung cấp van công nghiệp tiêu chuẩn cao cho công trình ${inputProjectName}.`,
      summaryEn: inputSummary.trim() || `Industrial valve supply package for ${inputProjectName}.`,
      articleContent: inputArticleContent.trim() || `Dự án ${inputProjectName} do Quản trị viên (Admin) trực tiếp khởi tạo và đưa vào danh mục Hồ sơ công trình thực hiện từ 2009 đến nay. Toàn bộ chứng chỉ CO/CQ và kết quả thử áp lực xuất xưởng đã được thẩm định nghiệm thu.`,
      articleContentEn: inputArticleContent.trim() || `Project ${inputProjectName} verified and published by system administrator into official track record.`,
      imageUrl: inputImageUrl.trim() || '/uploads/project_refinery_plant.jpg',
      createdAt: new Date().toISOString()
    };

    onAddProject(newProj);
    setIsAiGenModalOpen(false);

    // Reset Form
    setInputProjectName('');
    setInputProjectNameEn('');
    setInputCustomer('');
    setInputContractor('');
    setInputLocation('');
    setInputContractValue('');
    setInputSuppliedValves('');
    setInputSummary('');
    setInputArticleContent('');
    setInputImageUrl('');
    setInputNotes('');

    setGenSuccessToast(
      lang === 'vi'
        ? `✓ Admin đã thêm và xuất bản dự án "${newProj.name}" thành công!`
        : `✓ Admin published project "${newProj.name}" successfully!`
    );
    setTimeout(() => setGenSuccessToast(null), 4000);
  };

  // 2. Optional AI Assistant to help Admin draft text into form inputs (DOES NOT auto-add)
  const handleAiDraftHelper = () => {
    if (!inputProjectName.trim()) {
      alert(lang === 'vi' ? 'Vui lòng nhập tên công trình trước khi yêu cầu gợi ý nháp!' : 'Please enter project name first!');
      return;
    }
    setIsDraftingWithAi(true);

    setTimeout(() => {
      const synthesized = synthesizeProjectFromOrder({
        projectName: inputProjectName,
        customerCompany: inputCustomer,
        location: inputLocation,
        orderNotes: inputNotes,
        year: inputYear
      });

      setInputProjectNameEn(synthesized.nameEn);
      setInputCustomer(synthesized.clientInvestor);
      setInputContractor(synthesized.epcContractor);
      setInputLocation(synthesized.location);
      setInputContractValue(synthesized.contractValueVnd);
      setInputSuppliedValves(synthesized.suppliedValves.map(v => `${v.brand}: ${v.valveType} (${v.quantity})`).join('; '));
      setInputSummary(synthesized.summary);
      setInputArticleContent(synthesized.articleContent);
      setInputImageUrl(synthesized.imageUrl || '/uploads/project_refinery_plant.jpg');
      setIsDraftingWithAi(false);
    }, 600);
  };

  return (
    <section id="projects-section" className="py-16 sm:py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono uppercase mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi' 
                ? `HỒ SƠ CÔNG TRÌNH TỪ 2009 ĐẾN NĂM ${currentYear} (HIỆN TẠI)` 
                : `PROJECT TRACK RECORD 2009 - ${currentYear} (PRESENT)`}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'vi' 
              ? 'Dự Án Đã Thực Hiện (Từ 2009 Đến Hiện Tại)' 
              : 'Completed Projects & References (2009 - Present)'}
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            {lang === 'vi'
              ? 'Bề dày hơn 15 năm cung cấp van công nghiệp, van PCCC và hệ thống điều khiển tự động cho các đại dự án lọc hóa dầu, nhiệt điện, nhà máy sữa, và cao ốc hạng A trên toàn quốc.'
              : 'Over 15 years of proven excellence supplying industrial valves, UL/FM fire systems, and HVAC controls to national refineries, power plants and mega commercial towers.'}
          </p>

          {/* Action Controls: Admin Only (AI never auto adds, projects added strictly by Admin) */}
          {isAdminMode && (
            <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAiGenModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-indigo-950/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 border border-amber-400/40"
                title="Dành riêng cho Quản trị viên thêm dự án vào hồ sơ năng lực"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>
                  {lang === 'vi' 
                    ? '➕ Thêm Dự Án Mới (Dành Cho Admin)' 
                    : '➕ Add New Project (Admin Only)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetPhotoProjectId(undefined);
                  setIsPhotoStudioOpen(true);
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 border border-emerald-400/40"
              >
                <Camera className="w-4 h-4 text-emerald-200" />
                <span>
                  {lang === 'vi' 
                    ? '📷 Studio Ảnh Dự Án (AI Image)' 
                    : '📷 Project Photo Studio (AI)'}
                </span>
              </button>

              {onOpenAdminTimeline && (
                <button
                  type="button"
                  onClick={onOpenAdminTimeline}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 border border-amber-300"
                  title="Mở AdminStudio để kéo thả sắp xếp dòng thời gian & nạp CSV hàng loạt"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>
                    {lang === 'vi' 
                      ? '⚡ Kéo Thả Timeline (Drag & Drop)' 
                      : '⚡ Reorder Timeline (Drag & Drop)'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Success Toast */}
        {genSuccessToast && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950 border border-emerald-500/80 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-between animate-fade-in shadow-lg">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {genSuccessToast}
            </span>
            <span className="text-[11px] font-mono opacity-80">2009 - {currentYear} Live</span>
          </div>
        )}

        {/* Horizontal Interactive Timeline Visual (2009 - Present) & Decade Filters (Yêu cầu 3) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                  {lang === 'vi' ? 'Trục Thời Gian Dự Án Tương Tác (2009 - Hiện Tại)' : (lang === 'zh' ? '交互式工程时间轴 (2009年 - 至今)' : 'Interactive Project Timeline (2009 - Present)')}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'vi' 
                  ? 'Lọc hồ sơ công trình theo thập niên hoặc bấm vào từng mốc năm trên trục thời gian để xem chi tiết.' 
                  : (lang === 'zh' ? '按年代筛选或点击时间轴上的年份节点查看供货案例详情。' : 'Filter case studies by decade or click any year node on the interactive timeline.')}
              </p>
            </div>

            {/* Decade Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedDecade('all');
                  setSelectedYear('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDecade === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'vi' ? `Tất Cả (${projects.length})` : (lang === 'zh' ? `全部案例 (${projects.length})` : `All Decades (${projects.length})`)}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDecade('2000s');
                  setSelectedYear('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDecade === '2000s'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'vi' ? '2000s (2009)' : '2000s (2009)'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDecade('2010s');
                  setSelectedYear('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDecade === '2010s'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'vi' ? 'Thập niên 2010s (2010 - 2019)' : '2010s Decade'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDecade('2020s');
                  setSelectedYear('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDecade === '2020s'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'vi' ? `Thập niên 2020s (2020 - ${currentYear})` : '2020s - Present'}
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track Controls */}
          <div className="relative pt-6 pb-2">
            <button
              type="button"
              onClick={() => handleScrollTimeline('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              title="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleScrollTimeline('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              title="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Scrollable Timeline Track */}
            <div 
              ref={timelineScrollRef}
              className="overflow-x-auto scrollbar-none px-10 py-3 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="relative flex items-center min-w-max gap-8 sm:gap-10">
                {/* Connecting horizontal line */}
                <div className="absolute left-4 right-4 top-4 h-0.5 bg-gradient-to-r from-amber-500/40 via-blue-500/40 to-emerald-500/40 -z-0" />

                {timelineYears.map((yr) => {
                  const count = projectCountByYear[yr] || 0;
                  const isSelected = selectedYear === yr.toString();
                  const isCurrent = yr === currentYear;
                  const isDecadeMatch = 
                    selectedDecade === 'all' ||
                    (selectedDecade === '2000s' && yr <= 2009) ||
                    (selectedDecade === '2010s' && yr >= 2010 && yr <= 2019) ||
                    (selectedDecade === '2020s' && yr >= 2020);

                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        if (selectedYear === yr.toString()) {
                          setSelectedYear('all');
                        } else {
                          setSelectedYear(yr.toString());
                        }
                      }}
                      className={`relative z-10 flex flex-col items-center group transition-all transform ${
                        isDecadeMatch ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                      }`}
                    >
                      {/* Node Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                        isSelected
                          ? 'bg-amber-500 border-white text-slate-950 scale-125 shadow-amber-500/50'
                          : (count > 0 
                              ? (isCurrent 
                                  ? 'bg-emerald-500 border-white text-slate-950 ring-4 ring-emerald-500/30 animate-pulse' 
                                  : 'bg-slate-900 border-amber-400 text-amber-300 hover:border-white hover:scale-110')
                              : 'bg-slate-950 border-slate-700 text-slate-500')
                      }`}>
                        {count > 0 ? (
                          <span className="text-[10px] font-black font-mono">{count}</span>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        )}
                      </div>

                      {/* Year Label */}
                      <span className={`mt-2 font-mono text-xs font-extrabold transition-colors ${
                        isSelected
                          ? 'text-amber-400 font-black scale-110'
                          : (isCurrent 
                              ? 'text-emerald-400' 
                              : (count > 0 ? 'text-slate-200 group-hover:text-amber-300' : 'text-slate-500'))
                      }`}>
                        {yr}
                        {isCurrent && (
                          <span className="block text-[9px] text-emerald-400 font-mono -mt-0.5">Nay</span>
                        )}
                      </span>

                      {/* Milestone badge tooltip */}
                      {count > 0 && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono mt-0.5 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {count} {lang === 'vi' ? 'DA' : 'proj'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Filter Status */}
          {(selectedDecade !== 'all' || selectedYear !== 'all') && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <span className="text-amber-400 font-bold">Đang xem:</span>
                {selectedDecade !== 'all' && (
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                    {selectedDecade === '2000s' ? 'Thập niên 2000s (2009)' : (selectedDecade === '2010s' ? 'Thập niên 2010s' : 'Thập niên 2020s')}
                  </span>
                )}
                {selectedYear !== 'all' && (
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">
                    Năm {selectedYear}
                  </span>
                )}
                <span className="text-slate-400">({filteredProjects.length} dự án phù hợp)</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDecade('all');
                  setSelectedYear('all');
                }}
                className="text-amber-400 hover:text-white font-bold underline text-[11px]"
              >
                {lang === 'vi' ? 'Xóa lọc / Xem tất cả' : 'Reset filters'}
              </button>
            </div>
          )}
        </div>

        {/* Multi-parameter Filter Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'vi' ? 'Tìm theo tên dự án, chủ đầu tư, vị trí...' : 'Search project, investor, location...'}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">
                  {lang === 'vi' ? `Tất cả các năm (2009 - Hiện tại ${currentYear})` : (lang === 'zh' ? `全部年份 (2009 - 至今 ${currentYear})` : `All Years (2009 - Present ${currentYear})`)}
                </option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr.toString()}>
                    {yr === currentYear 
                      ? (lang === 'vi' ? `Năm ${yr} (Hiện Tại - Đang Cấp Hàng)` : (lang === 'zh' ? `${yr} 年度 (进行中 - 持续供货)` : `Year ${yr} (Present - Active Supply)`)) 
                      : (lang === 'vi' ? `Năm ${yr}` : (lang === 'zh' ? `${yr} 年度` : `Year ${yr}`))}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">
                  {lang === 'vi' ? 'Tất cả lĩnh vực (Dầu khí, Điện, HVAC, PCCC...)' : (lang === 'zh' ? '全部工程行业 (石油化工、火电、暖通、消防...)' : 'All Industries (Oil & Gas, Power, HVAC, Fire...)')}
                </option>
                <option value="oil_gas">{lang === 'vi' ? 'Dầu khí & Lọc hóa dầu' : (lang === 'zh' ? '石油天然气与炼油化工' : 'Oil & Gas / Petrochemicals')}</option>
                <option value="power_energy">{lang === 'vi' ? 'Nhiệt điện & Năng lượng' : (lang === 'zh' ? '火力发电与清洁能源' : 'Power Generation')}</option>
                <option value="hvac_bldg">{lang === 'vi' ? 'Tòa nhà cao tầng & HVAC' : (lang === 'zh' ? '高层商业建筑与暖通' : 'Commercial High-Rise & HVAC')}</option>
                <option value="fire_protection">{lang === 'vi' ? 'PCCC & Cứu hỏa UL/FM' : (lang === 'zh' ? 'UL/FM 消防工程与管网' : 'Fire Protection & Safety')}</option>
                <option value="fnb_pharma">{lang === 'vi' ? 'Thực phẩm, Sữa & Dược phẩm' : (lang === 'zh' ? '食品饮料与生物医药' : 'Food, Dairy & Pharma')}</option>
                <option value="heavy_industry">{lang === 'vi' ? 'Công nghiệp nặng & Thép' : (lang === 'zh' ? '重工业冶金与钢铁' : 'Heavy Industry & Steel')}</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">{lang === 'vi' ? 'Tất cả thương hiệu van' : (lang === 'zh' ? '全部阀门品牌' : 'All Valve Brands')}</option>
                <option value="UTD">UTD (Hoa Kỳ / USA)</option>
                <option value="VYC-Spain">VYC Industrial (Tây Ban Nha / Spain)</option>
                <option value="Shield Valve UK">Shield Valve (Vương Quốc Anh / UK)</option>
                <option value="JMV-Korea">JM Valve (Hàn Quốc / Korea)</option>
                <option value="Johnson Controls">Johnson Controls (Hoa Kỳ / USA)</option>
                <option value="Tyco">Tyco Fire Protection (Hoa Kỳ / USA)</option>
              </select>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
            <span>
              {lang === 'vi' ? 'Tìm thấy' : (lang === 'zh' ? '共检索到' : 'Found')}{' '}
              <strong className="text-amber-400 font-mono">{filteredProjects.length}</strong>{' '}
              {lang === 'vi' ? 'dự án công trình' : (lang === 'zh' ? '个重大工程案例' : 'engineered projects')}
            </span>
            {(selectedYear !== 'all' || selectedIndustry !== 'all' || selectedBrand !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedYear('all');
                  setSelectedIndustry('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="text-blue-400 hover:text-blue-300 font-bold"
              >
                {lang === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isOngoing = proj.isOngoing || proj.year >= currentYear;

            return (
              <div
                key={proj.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/40 group"
              >
                <div>
                  {/* Image & Year Badge */}
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={resolveProductImageUrl(proj.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80')}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                    {/* Timeline Year Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-black shadow-lg ${
                        isOngoing
                          ? 'bg-emerald-500 text-slate-950 border border-emerald-300'
                          : 'bg-slate-950/90 text-amber-300 border border-amber-500/50'
                      }`}>
                        {isOngoing ? (lang === 'vi' ? `🔥 ${proj.year} (HIỆN TẠI)` : (lang === 'zh' ? `🔥 ${proj.year} (进行中)` : `🔥 ${proj.year} (PRESENT)`)) : (lang === 'vi' ? `NĂM ${proj.year}` : (lang === 'zh' ? `${proj.year} 年度` : `YEAR ${proj.year}`))}
                      </span>

                      {isOngoing && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      )}
                    </div>

                    {/* Contract Value Pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-950/90 text-blue-300 border border-blue-500/50 shadow">
                        {proj.contractValueVnd}
                      </span>
                    </div>

                    {/* Completion Date bottom overlay */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                      <span className="truncate">{proj.completionDate}</span>
                      <span className="bg-slate-900/90 px-2 py-0.5 rounded text-[10px] text-slate-400">
                        {lang === 'vi' ? proj.industryLabel : proj.industryLabelEn}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {translateTechString(proj.name, proj.nameEn, lang)}
                    </h3>

                    {/* Investor & Location */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          <strong className="text-slate-300">{lang === 'vi' ? 'Chủ đầu tư:' : (lang === 'zh' ? '项目业主:' : 'Owner:')}</strong>{' '}
                          {translateTechString(proj.clientInvestor, proj.clientInvestorEn, lang)}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          <strong className="text-slate-300">{lang === 'vi' ? 'Vị trí:' : (lang === 'zh' ? '项目地点:' : 'Location:')}</strong>{' '}
                          {translateTechString(proj.location, undefined, lang)}
                        </span>
                      </div>
                    </div>

                    {/* Brand Badges */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                      {proj.brandsUsed.map((b) => (
                        <span
                          key={b}
                          className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-300 font-mono"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Summary */}
                    <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {translateTechString(proj.summary, proj.summaryEn, lang)}
                    </p>

                    {/* Supplied Valves Highlight */}
                    {proj.suppliedValves && proj.suppliedValves.length > 0 && (
                      <div className="mt-4 bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>{lang === 'vi' ? 'Chủng loại van cung cấp:' : (lang === 'zh' ? '供应阀门范围:' : 'Supplied Valve Scope:')}</span>
                          <span className="text-[10px] text-amber-400 font-mono font-normal">
                            {proj.suppliedValves.length} {lang === 'vi' ? 'gói thầu' : (lang === 'zh' ? '个标段' : 'packages')}
                          </span>
                        </div>
                        {proj.suppliedValves.slice(0, 2).map((sv, idx) => (
                          <div key={idx} className="text-[11px] text-slate-400 flex items-center justify-between gap-2 border-t border-slate-800/60 pt-1">
                            <span className="truncate text-slate-300">
                              • <span className="font-semibold text-blue-400">[{sv.brand}]</span> {sv.valveType}
                            </span>
                            <span className="text-emerald-400 font-mono font-bold flex-shrink-0">{sv.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveProjectForReading(proj)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 group-hover:underline"
                  >
                    <span>{lang === 'vi' ? 'Đọc bài viết chi tiết' : 'Read Case Study'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {isAdminMode && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setTargetPhotoProjectId(proj.id);
                          setIsPhotoStudioOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-1 transition-colors"
                        title={lang === 'vi' ? 'Đổi ảnh hoặc tạo placeholder bằng AI' : 'Change photo / Generate AI placeholder'}
                      >
                        <Camera className="w-3 h-3 text-amber-400" />
                        <span>{lang === 'vi' ? 'Ảnh AI' : 'Photo AI'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const confirmMsg = lang === 'vi'
                            ? `XÁC NHẬN XÓA DỰ ÁN:\n\nBạn có chắc chắn muốn xóa vĩnh viễn dự án "${proj.name}"?\n\nLưu ý: Dự án sau khi xóa sẽ KHÔNG tự động khôi phục lại khi tải lại trang web.`
                            : `CONFIRM PERMANENT DELETION:\n\nAre you sure you want to permanently delete "${proj.name}"?\n\nThis project will NOT automatically restore.`;
                          if (window.confirm(confirmMsg)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded transition-colors"
                        title={lang === 'vi' ? 'Xóa vĩnh viễn dự án này (Không tự động khôi phục)' : 'Permanently delete this project (Never restores)'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-slate-950/70 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto my-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            {projects.length === 0 ? (
              <>
                <h4 className="text-lg font-bold text-white mb-2">
                  {lang === 'vi' 
                    ? 'Danh Sách Dự Án Đã Thực Hiện Đang Được Làm Mới' 
                    : 'Project Portfolio Is Being Updated'}
                </h4>
                <p className="text-sm text-slate-400 mb-6 max-w-lg mx-auto leading-relaxed">
                  {lang === 'vi'
                    ? 'Toàn bộ danh sách dự án cũ đã được xóa khỏi hệ thống theo yêu cầu. Quản trị viên (Admin) sẽ sớm cập nhật và bổ sung danh sách công trình mới.'
                    : 'All previous project records have been cleared. Administrator will add and update official project references shortly.'}
                </p>
                {isAdminMode && (
                  <button
                    type="button"
                    onClick={() => setIsAiGenModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 border border-amber-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'vi' ? '➕ Bổ Sung Dự Án Mới Ngay' : '➕ Add First Project Now'}</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <h4 className="text-base font-bold text-slate-300">
                  {lang === 'vi' ? 'Không tìm thấy dự án phù hợp tiêu chí' : 'No projects matched the selected filters'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {lang === 'vi'
                    ? 'Hãy thử xóa các điều kiện lọc hoặc nhập tên dự án mới để hệ thống tự động tìm kiếm thông tin và đăng bài lên hệ thống.'
                    : 'Try clearing the filters or use the project tool to generate a new case study instantly.'}
                </p>
              </>
            )}
          </div>
        )}

      </div>

      {/* ===================================================================== */}
      {/* 1. Modal: Full Case Study & Technical Story Reader                    */}
      {/* ===================================================================== */}
      {activeProjectForReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-blue-950 text-blue-300 border border-blue-600/50">
                  {activeProjectForReading.year >= currentYear 
                    ? `🔥 ${activeProjectForReading.year} HIỆN TẠI` 
                    : `NĂM ${activeProjectForReading.year}`}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {activeProjectForReading.contractValueVnd}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveProjectForReading(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {lang === 'vi' ? activeProjectForReading.name : activeProjectForReading.nameEn}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>📍 {activeProjectForReading.location}</span>
                  <span>•</span>
                  <span>🏢 {activeProjectForReading.clientInvestor}</span>
                  <span>•</span>
                  <span>📅 {activeProjectForReading.completionDate}</span>
                </div>
              </div>

              {/* Photo */}
              <div className="rounded-xl overflow-hidden border border-slate-800 h-64 bg-slate-950">
                <img
                  src={resolveProductImageUrl(activeProjectForReading.imageUrl || '/uploads/project_refinery_plant.jpg')}
                  alt={activeProjectForReading.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                  }}
                />
              </div>

              {/* Technical Article */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5">
                <h4 className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider mb-2">
                  {lang === 'vi' ? 'BÀI VIẾT KỸ THUẬT & HỒ SƠ NĂNG LỰC CÔNG TRÌNH' : 'ENGINEERING CASE STUDY & PERFORMANCE REPORT'}
                </h4>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                  {lang === 'vi' ? activeProjectForReading.articleContent : activeProjectForReading.articleContentEn}
                </div>
              </div>

              {/* Supplied Valves Breakdown Table */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'vi' ? 'Bảng Thống Kê Thiết Bị Van Đã Cung Cấp' : 'Bill of Materials & Valve Breakdown'}</span>
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Hãng</th>
                        <th className="py-2.5 px-3">Chủng Loại Van</th>
                        <th className="py-2.5 px-3">Quy Cách & Tiêu Chuẩn</th>
                        <th className="py-2.5 px-3 text-right">Số Lượng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 text-slate-300">
                      {activeProjectForReading.suppliedValves.map((sv, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-400">{sv.brand}</td>
                          <td className="py-2.5 px-3">{sv.valveType}</td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{sv.specs}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">{sv.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span>Hồ sơ lưu trữ chính thức Industracorp</span>
              <button
                type="button"
                onClick={() => setActiveProjectForReading(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. Modal: Admin Add Project Form (Admin Only - AI Never Auto-Adds)   */}
      {/* ===================================================================== */}
      {isAiGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    {lang === 'vi' 
                      ? 'Thêm Dự Án Mới Vào Hồ Sơ Công Trình (Admin Only)' 
                      : 'Add New Project Reference (Admin Only)'}
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded font-mono">
                      Admin Mode
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'vi' 
                      ? 'Dự án do Admin trực tiếp quản lý và thêm vào. AI không được tự thêm và khi xóa sẽ không tự động khôi phục.' 
                      : 'Projects managed strictly by Admin. AI cannot auto-add and deleted projects never auto-restore.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiGenModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-6 space-y-3.5 text-xs overflow-y-auto flex-1">
              {/* Row 1: Name VI & Name EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {lang === 'vi' ? 'Tên Dự Án (Tiếng Việt) (*):' : 'Project Name (Vietnamese) (*):'}
                  </label>
                  <input
                    type="text"
                    value={inputProjectName}
                    onChange={(e) => setInputProjectName(e.target.value)}
                    placeholder="VD: Nhà Máy Nhiệt Điện Ô Môn..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    {lang === 'vi' ? 'Tên Dự Án (Tiếng Anh):' : 'Project Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={inputProjectNameEn}
                    onChange={(e) => setInputProjectNameEn(e.target.value)}
                    placeholder="e.g. O Mon Thermal Power Plant..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Year & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {lang === 'vi' ? 'Năm Hoàn Thành / Thực Hiện (*):' : 'Execution / Completion Year (*):'}
                  </label>
                  <input
                    type="number"
                    min="2009"
                    max={currentYear + 2}
                    value={inputYear}
                    onChange={(e) => setInputYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {lang === 'vi' ? 'Ngành Công Nghiệp / Lĩnh Vực:' : 'Industry Domain:'}
                  </label>
                  <select
                    value={inputIndustry}
                    onChange={(e) => setInputIndustry(e.target.value as ProjectRecord['industry'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400 text-xs font-medium cursor-pointer"
                  >
                    <option value="oil_gas">Dầu khí & Hóa chất (Oil & Gas)</option>
                    <option value="power_energy">Nhiệt điện & Năng lượng (Power & Energy)</option>
                    <option value="steel_metal">Thép & Luyện kim (Steel & Metallurgical)</option>
                    <option value="hvac_bldg">Tòa nhà cao tầng & HVAC Chiller</option>
                    <option value="data_center">Trung tâm dữ liệu (Data Center)</option>
                    <option value="water_infra">Cấp thoát nước & Môi trường</option>
                    <option value="other">Công nghiệp & Sản xuất khác</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Client & EPC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    {lang === 'vi' ? 'Chủ Đầu Tư / Khách Hàng:' : 'Client / Project Investor:'}
                  </label>
                  <input
                    type="text"
                    value={inputCustomer}
                    onChange={(e) => setInputCustomer(e.target.value)}
                    placeholder="VD: Tập Đoàn Dầu Khí PVN, EVN..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    {lang === 'vi' ? 'Tổng Thầu EPC:' : 'EPC General Contractor:'}
                  </label>
                  <input
                    type="text"
                    value={inputContractor}
                    onChange={(e) => setInputContractor(e.target.value)}
                    placeholder="VD: PTSC, Samsung C&T, Hawee M&E..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Row 4: Location & Contract Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    {lang === 'vi' ? 'Địa Điểm Công Trình:' : 'Site Location:'}
                  </label>
                  <input
                    type="text"
                    value={inputLocation}
                    onChange={(e) => setInputLocation(e.target.value)}
                    placeholder="VD: Vũng Tàu, Hà Nội, Quảng Ngãi..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    {lang === 'vi' ? 'Giá Trị Hợp Đồng Cung Cấp:' : 'Contract Supply Value:'}
                  </label>
                  <input
                    type="text"
                    value={inputContractValue}
                    onChange={(e) => setInputContractValue(e.target.value)}
                    placeholder="VD: 35.8 Tỷ VNĐ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Row 5: Supplied Valves */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {lang === 'vi' ? 'Chủng Loại Van Cung Cấp:' : 'Supplied Valve Scope:'}
                </label>
                <input
                  type="text"
                  value={inputSuppliedValves}
                  onChange={(e) => setInputSuppliedValves(e.target.value)}
                  placeholder="VD: Van bi Inox 316 Class 600, Van an toàn VYC Model 096, Van bướm Shield UK DN200..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Row 6: Image URL */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {lang === 'vi' ? 'Đường Dẫn Ảnh Công Trình / Nhà Máy (/uploads/... hoặc URL):' : 'Project Image URL:'}
                </label>
                <input
                  type="text"
                  value={inputImageUrl}
                  onChange={(e) => setInputImageUrl(e.target.value)}
                  placeholder="/uploads/project_refinery_plant.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs font-mono"
                />
              </div>

              {/* Row 7: Article Content */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {lang === 'vi' ? 'Mô Tả & Bài Viết Giới Thiệu Dự Án:' : 'Project Case Study & Technical Summary:'}
                </label>
                <textarea
                  rows={3}
                  value={inputArticleContent}
                  onChange={(e) => setInputArticleContent(e.target.value)}
                  placeholder="Mô tả kỹ thuật gói thầu, tiêu chuẩn áp lực, xuất xứ CO/CQ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs leading-relaxed"
                />
              </div>

              {/* Optional AI Assistant Draft Helper Callout */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2 text-[11px] text-slate-400">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'vi'
                      ? 'Cần gợi ý? Nhấn "AI Gợi Ý Soạn Thảo Nháp" để AI tự điền thông số mẫu vào các ô trên (AI không tự ý lưu).'
                      : 'Need help? Click "AI Draft Helper" to populate draft fields for your review.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAiDraftHelper}
                  disabled={isDraftingWithAi || !inputProjectName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 text-xs font-bold whitespace-nowrap self-end sm:self-auto disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDraftingWithAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{lang === 'vi' ? 'AI Gợi Ý Soạn Thảo Nháp' : 'AI Draft Helper'}</span>
                </button>
              </div>
            </div>

            {/* Footer Buttons - Explicit Admin Save */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                🔒 {lang === 'vi' ? 'Chỉ lưu vào hệ thống khi Admin bấm nút Lưu bên phải' : 'Saved only upon explicit Admin approval'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiGenModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-800"
                >
                  {lang === 'vi' ? 'Hủy Bỏ' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleAdminSaveProject}
                  disabled={!inputProjectName.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 text-white shadow-lg transition-all ${
                    !inputProjectName.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40 active:scale-95'
                  }`}
                >
                  <Plus className="w-4 h-4 text-emerald-200" />
                  <span>{lang === 'vi' ? 'Lưu & Xuất Bản Dự Án (Bởi Admin)' : 'Save & Publish Project'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. Modal: Project Photo & AI Placeholder Generator Studio            */}
      {/* ===================================================================== */}
      <ProjectPhotoManagerModal
        isOpen={isPhotoStudioOpen}
        onClose={() => setIsPhotoStudioOpen(false)}
        projects={projects}
        initialProjectId={targetPhotoProjectId}
        onUpdateProjectPhoto={handleUpdateProjectPhoto}
        lang={lang}
      />

    </section>
  );
};
