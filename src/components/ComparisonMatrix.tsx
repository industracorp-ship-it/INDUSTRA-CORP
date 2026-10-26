import React, { useState } from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  CircleDot, 
  Disc, 
  ArrowDownUp, 
  Activity, 
  GitCommit,
  ArrowRightLeft,
  Scale,
  ShieldCheck,
  Zap,
  Award,
  Layers,
  Thermometer,
  Gauge,
  Check,
  SlidersHorizontal,
  BookmarkCheck,
  Flame,
  Droplet,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { 
  ADVANCED_COMPARISON_GROUPS, 
  DetailedComparisonItem,
  CUSTOM_VALVE_TYPES,
  CUSTOM_BODY_MATERIALS,
  CUSTOM_DISC_SEALS,
  CUSTOM_CONNECTIONS,
  CUSTOM_MEDIA_LIST
} from '../data/advancedValveComparisonData';
import { SupportedLanguage } from '../types/valve';
import { translateTechString } from '../utils/engineeringTranslator';
import { TRANSLATIONS } from '../data/translations';

interface ComparisonMatrixProps {
  lang: SupportedLanguage;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<
    'butterfly_offsets' | 'seating_tech' | 'globe_patterns' | 'disc_types' | 'globe_vs_butterfly' | 'custom_builder'
  >('butterfly_offsets');

  // Custom Valve Builder State (Valve 1 vs Valve 2)
  const [v1Type, setV1Type] = useState('butterfly_concentric');
  const [v1Body, setV1Body] = useState('ductile_iron');
  const [v1Disc, setV1Disc] = useState('epdm_soft');
  const [v1Conn, setV1Conn] = useState('wafer_multi');
  const [v1Pressure, setV1Pressure] = useState('PN16');
  const [v1Media, setV1Media] = useState('clean_water');

  const [v2Type, setV2Type] = useState('butterfly_hp');
  const [v2Body, setV2Body] = useState('cast_steel_wcb');
  const [v2Disc, setV2Disc] = useState('rptfe_reinforced');
  const [v2Conn, setV2Conn] = useState('lug_threaded');
  const [v2Pressure, setV2Pressure] = useState('flange_ansi150');
  const [v2Media, setV2Media] = useState('chilled_water');

  const activeGroup = ADVANCED_COMPARISON_GROUPS.find(g => g.tabKey === activeTab);

  const getCustomComparisonAnalysis = () => {
    const t1 = CUSTOM_VALVE_TYPES.find(t => t.id === v1Type);
    const t2 = CUSTOM_VALVE_TYPES.find(t => t.id === v2Type);
    const b1 = CUSTOM_BODY_MATERIALS.find(b => b.id === v1Body);
    const b2 = CUSTOM_BODY_MATERIALS.find(b => b.id === v2Body);
    const d1 = CUSTOM_DISC_SEALS.find(d => d.id === v1Disc);
    const d2 = CUSTOM_DISC_SEALS.find(d => d.id === v2Disc);

    const isMetalV1 = v1Disc.includes('metal') || v1Disc.includes('stellite');
    const isMetalV2 = v2Disc.includes('metal') || v2Disc.includes('stellite');

    return {
      t1Name: lang === 'vi' ? t1?.nameVi : t1?.nameEn,
      t2Name: lang === 'vi' ? t2?.nameVi : t2?.nameEn,
      b1Name: lang === 'vi' ? b1?.nameVi : b1?.nameEn,
      b2Name: lang === 'vi' ? b2?.nameVi : b2?.nameEn,
      d1Name: lang === 'vi' ? d1?.nameVi : d1?.nameEn,
      d2Name: lang === 'vi' ? d2?.nameVi : d2?.nameEn,
      isMetalV1,
      isMetalV2,
      recommendationVi: `Khi so sánh ${t1?.nameVi} (${b1?.nameVi}) với ${t2?.nameVi} (${b2?.nameVi}): Van 1 tối ưu chi phí đầu tư ban đầu (CAPEX) cho điều kiện vận hành phổ thông; trong khi Van 2 vượt trội về khả năng chịu tải trọng xung lực dòng chảy và tuổi thọ chu trình vận hành dài hạn.`,
      recommendationEn: `Comparing ${t1?.nameEn} against ${t2?.nameEn}: Valve 1 minimizes initial capital expense for standard loops; Valve 2 delivers superior endurance under high-cycle mechanical stress and extended operating life.`
    };
  };

  const customAnalysis = getCustomComparisonAnalysis();

  return (
    <section id="comparison" className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono uppercase mb-2.5">
            <Scale className="w-3.5 h-3.5" />
            <span>{t.compareToolBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.comparisonTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {t.comparisonSubtitle}
          </p>

          {/* 6 Modular Navigation Tabs */}
          <div className="mt-8 flex items-center justify-center gap-1.5 flex-wrap p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl mx-auto">
            {[
              { key: 'butterfly_offsets', labelVi: '🦋 Lệch Tâm Van Bướm (1/2/3 Offset)', labelEn: 'Butterfly Offsets', labelZh: '🦋 蝶阀偏心形式 (同心/双偏心/三偏心)' },
              { key: 'seating_tech', labelVi: '🛡️ Đệm Mềm vs Đệm Kim Loại', labelEn: 'Soft vs Metal Seated', labelZh: '🛡️ 软密封 vs 金属硬密封技术' },
              { key: 'globe_patterns', labelVi: '🌐 Thân Van Cầu (T vs Y vs Angle vs 3-Way)', labelEn: 'Globe Body Paths', labelZh: '🌐 截止阀流道 (T型/Y型/角式/三通)' },
              { key: 'disc_types', labelVi: '⚙️ Thiết Kế Đĩa Van (Phẳng / Côn / Kim / Bi)', labelEn: 'Disc & Plug Types', labelZh: '⚙️ 阀瓣与阀芯 (平面/锥形/针形/球端)' },
              { key: 'globe_vs_butterfly', labelVi: '⚖️ Van Cầu vs Van Bướm', labelEn: 'Globe vs Butterfly', labelZh: '⚖️ 截止阀 vs 蝶阀全方位对比' },
              { key: 'custom_builder', labelVi: '🎯 Bảng Tự Chọn Đối Soát Tùy Biến', labelEn: 'Custom Valve Builder', labelZh: '🎯 多维自选阀门对比系统' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === tab.key
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{lang === 'vi' ? tab.labelVi : (lang === 'zh' ? tab.labelZh : tab.labelEn)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1 to 5: STRUCTURED COMPARISON GROUPS */}
        {activeGroup && (
          <div className="space-y-8 animate-fade-in">
            {/* Group Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-amber-400" />
                    <span>{translateTechString(activeGroup.titleVi, activeGroup.titleEn, lang)}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {translateTechString(activeGroup.descriptionVi, activeGroup.descriptionEn, lang)}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {activeGroup.items.length} {lang === 'vi' ? 'cấu hình so sánh' : 'configurations'}
                  </span>
                </div>
              </div>

              {/* Engineering Verdict Banner */}
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs sm:text-sm text-blue-100 flex items-start gap-3 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-blue-300 font-bold mb-0.5 font-mono uppercase text-[11px]">
                    {lang === 'vi' ? 'ĐÁNH GIÁ KỸ THUẬT & KHUYẾN CÁO LỰA CHỌN TIÊU CHUẨN:' : 'ENGINEERING VERDICT & SPECIFICATION GUIDELINE:'}
                  </strong>
                  <span>{translateTechString(activeGroup.engineeringSummaryVi, activeGroup.engineeringSummaryEn, lang)}</span>
                </div>
              </div>
            </div>

            {/* Comparison Cards Grid */}
            <div className={`grid grid-cols-1 ${activeGroup.items.length === 2 ? 'md:grid-cols-2' : (activeGroup.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4')} gap-6`}>
              {activeGroup.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/20"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Item Title & Cost Index */}
                    <div className="space-y-1 pb-3 border-b border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>#0{idx + 1}</span>
                        <span className="text-amber-400 font-bold">
                          CAPEX Index: {'★'.repeat(item.costIndex)}{'☆'.repeat(5 - item.costIndex)}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-white leading-snug">
                        {translateTechString(item.nameVi, item.nameEn, lang)}
                      </h4>
                    </div>

                    {/* Design Principle */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                        {lang === 'vi' ? 'Nguyên Lý Cơ Học:' : 'Mechanical Principle:'}
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        {translateTechString(item.designPrincipleVi, item.designPrincipleEn, lang)}
                      </p>
                    </div>

                    {/* Quick Specs Table */}
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg border border-slate-800/60">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                          {lang === 'vi' ? 'Nhiệt độ:' : 'Temp:'}
                        </span>
                        <span className="text-white font-bold text-[11px]">{item.tempLimit}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg border border-slate-800/60">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-sky-400" />
                          {lang === 'vi' ? 'Cấp áp lực:' : 'Pressure:'}
                        </span>
                        <span className="text-white font-bold text-[11px]">{item.pressureLimit}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg border border-slate-800/60">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {lang === 'vi' ? 'Độ kín khít:' : 'Sealing:'}
                        </span>
                        <span className="text-emerald-400 font-bold text-[11px]">{item.sealingGrade}</span>
                      </div>

                      <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/60 text-[11px]">
                        <span className="text-slate-400 block mb-0.5">{lang === 'vi' ? 'Tổn thất áp (Trở lực):' : 'Pressure Loss:'}</span>
                        <span className="text-amber-300 font-bold">{translateTechString(item.headLossFactorCvVi, item.headLossFactorCv, lang)}</span>
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase block">
                        {lang === 'vi' ? '✓ Ưu Điểm Vượt Trội:' : '✓ Key Advantages:'}
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {(lang === 'vi' ? item.strengthsVi : (lang === 'zh' ? item.strengthsVi.map(s => translateTechString(s, undefined, 'zh')) : item.strengthsEn)).map((st, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 shrink-0 font-bold">✔</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[11px] font-mono font-bold text-rose-400 uppercase block">
                        {lang === 'vi' ? '⚠ Hạn Chế Cần Lưu Ý:' : '⚠ Operational Constraints:'}
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-400">
                        {(lang === 'vi' ? item.limitationsVi : (lang === 'zh' ? item.limitationsVi.map(l => translateTechString(l, undefined, 'zh')) : item.limitationsEn)).map((lm, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-400 shrink-0">•</span>
                            <span>{lm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer Application */}
                  <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px]">
                    <span className="font-bold text-slate-400 block mb-0.5 font-mono uppercase">
                      {lang === 'vi' ? 'Ứng Dụng Khuyến Nghị:' : 'Recommended Application:'}
                    </span>
                    <p className="text-slate-200 leading-snug">
                      {translateTechString(item.recommendedApplicationsVi, item.recommendedApplicationsEn, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOM INTERACTIVE VALVE COMPARATOR */}
        {activeTab === 'custom_builder' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                    <span>{lang === 'vi' ? 'Bảng Tự Chọn Đối Soát Tùy Biến (Custom Interactive Valve Comparator)' : 'Custom Interactive Valve Sizing & Metallurgy Comparator'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'vi'
                      ? 'Lựa chọn bất kỳ 2 cấu hình van để đối soát tương tác: Chủng loại van, vật liệu thân, đĩa/đệm làm kín, kiểu kết nối và môi chất sử dụng.'
                      : 'Select any two valve configurations to evaluate metallurgy, seating mechanism, connection type, and fluid compatibility.'}
                  </p>
                </div>
              </div>

              {/* Two Column Valve Builder Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* VALVE 1 BUILDER */}
                <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-mono font-bold text-xs text-blue-400 uppercase flex items-center gap-1.5">
                      <CircleDot className="w-4 h-4 text-blue-400" />
                      {lang === 'vi' ? 'Cấu Hình Van #1 (Phương Án A)' : 'Valve Configuration #1 (Option A)'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Option A</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Loại van (Valve Type):</label>
                      <select
                        value={v1Type}
                        onChange={(e) => setV1Type(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_VALVE_TYPES.map(t => (
                          <option key={t.id} value={t.id}>{lang === 'vi' ? t.nameVi : t.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Vật liệu thân van (Body Material):</label>
                      <select
                        value={v1Body}
                        onChange={(e) => setV1Body(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_BODY_MATERIALS.map(b => (
                          <option key={b.id} value={b.id}>{lang === 'vi' ? b.nameVi : b.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Đĩa van & Đệm làm kín (Seat & Disc):</label>
                      <select
                        value={v1Disc}
                        onChange={(e) => setV1Disc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_DISC_SEALS.map(d => (
                          <option key={d.id} value={d.id}>{lang === 'vi' ? d.nameVi : d.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Kiểu kết nối (Connection):</label>
                      <select
                        value={v1Conn}
                        onChange={(e) => setV1Conn(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_CONNECTIONS.map(c => (
                          <option key={c.id} value={c.id}>{lang === 'vi' ? c.nameVi : c.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Môi chất làm việc (Fluid Application):</label>
                      <select
                        value={v1Media}
                        onChange={(e) => setV1Media(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_MEDIA_LIST.map(m => (
                          <option key={m.id} value={m.id}>{lang === 'vi' ? m.nameVi : m.nameEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* VALVE 2 BUILDER */}
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-mono font-bold text-xs text-amber-400 uppercase flex items-center gap-1.5">
                      <Disc className="w-4 h-4 text-amber-400" />
                      {lang === 'vi' ? 'Cấu Hình Van #2 (Phương Án B)' : 'Valve Configuration #2 (Option B)'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Option B</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Loại van (Valve Type):</label>
                      <select
                        value={v2Type}
                        onChange={(e) => setV2Type(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_VALVE_TYPES.map(t => (
                          <option key={t.id} value={t.id}>{lang === 'vi' ? t.nameVi : t.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Vật liệu thân van (Body Material):</label>
                      <select
                        value={v2Body}
                        onChange={(e) => setV2Body(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_BODY_MATERIALS.map(b => (
                          <option key={b.id} value={b.id}>{lang === 'vi' ? b.nameVi : b.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Đĩa van & Đệm làm kín (Seat & Disc):</label>
                      <select
                        value={v2Disc}
                        onChange={(e) => setV2Disc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_DISC_SEALS.map(d => (
                          <option key={d.id} value={d.id}>{lang === 'vi' ? d.nameVi : d.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Kiểu kết nối (Connection):</label>
                      <select
                        value={v2Conn}
                        onChange={(e) => setV2Conn(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_CONNECTIONS.map(c => (
                          <option key={c.id} value={c.id}>{lang === 'vi' ? c.nameVi : c.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Môi chất làm việc (Fluid Application):</label>
                      <select
                        value={v2Media}
                        onChange={(e) => setV2Media(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        {CUSTOM_MEDIA_LIST.map(m => (
                          <option key={m.id} value={m.id}>{lang === 'vi' ? m.nameVi : m.nameEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Head-to-Head Synthesis Result */}
              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>{lang === 'vi' ? 'Kết Quả Đối Soát Kỹ Thuật (Engineering Synthesis):' : 'Engineering Synthesis & Analysis:'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <strong className="text-blue-300 block font-mono">Phương án A: {customAnalysis.t1Name}</strong>
                    <p className="text-slate-300">• Vật liệu: {customAnalysis.b1Name}</p>
                    <p className="text-slate-300">• Làm kín: {customAnalysis.d1Name}</p>
                    <p className="text-slate-400 text-[11px]">
                      {customAnalysis.isMetalV1 
                        ? '✓ Làm kín kim loại tôi cứng, chịu nhiệt độ cao và kháng xói lở tốt.' 
                        : '✓ Đệm mềm đàn hồi cao, đạt cấp độ kín bọt khí tuyệt đối ISO 5208 Rate A.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <strong className="text-amber-300 block font-mono">Phương án B: {customAnalysis.t2Name}</strong>
                    <p className="text-slate-300">• Vật liệu: {customAnalysis.b2Name}</p>
                    <p className="text-slate-300">• Làm kín: {customAnalysis.d2Name}</p>
                    <p className="text-slate-400 text-[11px]">
                      {customAnalysis.isMetalV2 
                        ? '✓ Làm kín kim loại tôi cứng, chịu nhiệt độ cao và kháng xói lở tốt.' 
                        : '✓ Đệm mềm đàn hồi cao, đạt cấp độ kín bọt khí tuyệt đối ISO 5208 Rate A.'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800/80 leading-relaxed">
                  {lang === 'vi' ? customAnalysis.recommendationVi : customAnalysis.recommendationEn}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
