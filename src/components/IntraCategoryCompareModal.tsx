import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Clock, 
  Thermometer, 
  Gauge, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle,
  ChevronRight,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { VALVE_FAMILY_COMPARISONS } from '../data/valveFamilyComparisons';
import { ValveFamilyComparisonItem, SupportedLanguage } from '../types/valve';
import { translateTechString } from '../utils/engineeringTranslator';

interface IntraCategoryCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFamily?: string;
  lang: SupportedLanguage;
}

export const IntraCategoryCompareModal: React.FC<IntraCategoryCompareModalProps> = ({
  isOpen,
  onClose,
  initialFamily = 'butterfly',
  lang,
}) => {
  if (!isOpen) return null;

  const [activeFamily, setActiveFamily] = useState<string>(
    initialFamily === 'ball' ? 'ball' : 'butterfly'
  );

  const t = (vi?: string, en?: string) => translateTechString(vi, en, lang);

  const comparisonItems: ValveFamilyComparisonItem[] = 
    VALVE_FAMILY_COMPARISONS[activeFamily] || VALVE_FAMILY_COMPARISONS.butterfly;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  {t('So Sánh Kỹ Thuật Chuyên Sâu Trong Cùng Dòng Van', 'Intra-Family Valve Engineering Comparison Matrix')}
                </h3>
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  DECISION ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t(
                  'Phân tích ma sát, tuổi thọ chu trình, cấp độ kín và bài toán kinh tế TCO giữa các thế hệ van cơ điện.',
                  'Deep technical analysis of friction, cycle life, sealing classes and Total Cost of Ownership (TCO).'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Family Selector Tabs */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">{t('Chọn dòng van so sánh:', 'Select Valve Family:')}</span>
            <div className="inline-flex rounded-lg p-1 bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveFamily('butterfly')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  activeFamily === 'butterfly'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('🦋 Dòng Van Bướm (Đồng tâm vs Lệch tâm)', '🦋 Butterfly Valves (Concentric vs Offset)')}
              </button>
              <button
                type="button"
                onClick={() => setActiveFamily('ball')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  activeFamily === 'ball'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('⚽ Dòng Van Bi (Floating vs Trunnion)', '⚽ Ball Valves (Floating vs Trunnion)')}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{t('Đề xuất giải pháp kỹ thuật tối ưu theo tiêu chuẩn quốc tế', 'Grounded on ASME B16.34 & API 607 standards')}</span>
          </div>
        </div>

        {/* Comparison Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Multi-Column Side-by-Side Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-${comparisonItems.length} gap-4`}>
            {comparisonItems.map((item, idx) => (
              <div
                key={item.id}
                className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  item.relativeCostScore >= 4
                    ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border-blue-500/50 shadow-xl'
                    : item.relativeCostScore === 3
                    ? 'bg-slate-950/80 border-slate-700/80'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  {/* Badge & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-slate-900 border border-slate-800 text-amber-400">
                      THẾ HỆ #{idx + 1}
                    </span>
                    <div className="flex items-center text-amber-400 text-xs font-mono font-bold" title="Mức chi phí đầu tư">
                      {Array.from({ length: item.relativeCostScore }).map((_, i) => (
                        <span key={i}>$</span>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-white leading-tight">
                    {t(item.title, item.titleEn)}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {t(item.subtitle, item.subtitleEn)}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-4 space-y-2.5 text-xs">
                    
                    {/* Design Principle */}
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                        {t('Nguyên Lý Chuyển Động:', 'Kinematic Principle:')}
                      </span>
                      <p className="text-slate-200 text-[11px] leading-relaxed">
                        {t(item.designPrinciple, item.designPrincipleEn)}
                      </p>
                    </div>

                    {/* Cycle Life */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {t('Tuổi Thọ Chu Trình:', 'Cycle Life:')}
                      </span>
                      <strong className="text-white text-[11px] font-mono text-right">
                        {t(item.cycleLife, item.cycleLifeEn)}
                      </strong>
                    </div>

                    {/* Temperature & Pressure */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Thermometer className="w-3.5 h-3.5 text-red-400" />
                        {t('Dải Nhiệt Độ:', 'Temp Range:')}
                      </span>
                      <strong className="text-amber-200 text-[11px] font-mono">
                        {t(item.tempRange, item.tempRange)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Gauge className="w-3.5 h-3.5 text-blue-400" />
                        {t('Áp Suất Tối Đa:', 'Max Pressure:')}
                      </span>
                      <strong className="text-blue-300 text-[11px] font-mono">
                        {t(item.pressureLimit, item.pressureLimit)}
                      </strong>
                    </div>

                    {/* Sealing & Leakage */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {t('Cấp Độ Kín:', 'Sealing Class:')}
                      </span>
                      <strong className="text-emerald-300 text-[11px] font-mono text-right truncate max-w-[150px]">
                        {t(item.leakageIntegrity, item.leakageIntegrityEn)}
                      </strong>
                    </div>

                    {/* Pros */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                        {t('Ưu Điểm Nổi Bật:', 'Key Advantages:')}
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {item.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{t(pro, item.prosEn?.[i] || pro)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="pt-1">
                      <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">
                        {t('Hạn Chế Cần Lưu Ý:', 'Design Limitations:')}
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-400">
                        {item.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-400 text-xs flex-shrink-0">•</span>
                            <span>{t(con, item.consEn?.[i] || con)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>

                {/* Recommended Use Cases */}
                <div className="mt-5 pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                    {t('Khuyến Nghị Kỹ Sư Sử Dụng Khi:', 'Recommended Applications:')}
                  </span>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    {item.recommendedApplications.map((app, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span className="line-clamp-1">{t(app, item.recommendedApplicationsEn?.[i] || app)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Representative Models */}
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span>{t('Mã van tiêu biểu:', 'Models:')}</span>
                    <strong className="text-white">{item.exampleModels.join(', ')}</strong>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Expert Summary Recommendation Note */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-amber-300 uppercase font-mono text-[11px] mb-1">
                {t(
                  'KẾT LUẬN TƯ VẤN THIẾT KẾ CƠ ĐIỆN TỪ CHUYÊN GIA INDUSTRA',
                  'INDUSTACORP LEAD MECHANICAL CONSULTANT RECOMMENDATION'
                )}
              </h5>
              <p className="leading-relaxed text-slate-300">
                {activeFamily === 'butterfly'
                  ? t(
                      'Với hệ thống nước lạnh HVAC và cấp nước sạch dưới 120°C, Van Bướm Đồng Tâm (Concentric) là lựa chọn tối ưu chi phí. Tuy nhiên, với đường ống hơi nóng bão hòa, phòng cháy chữa cháy 300 PSI hoặc dự án đòi hỏi tuổi thọ > 15 năm, việc nâng cấp lên Van Bướm Lệch Tâm Kép (Double-Offset) hoặc Lệch Tâm 3 (Triple-Offset) sẽ giảm 90% chi phí dừng máy bảo dưỡng định kỳ và ngăn ngừa hoàn toàn nguy cơ rò rỉ.',
                      'For HVAC chilled water and general utilities under 120°C, concentric rubber-seated valves offer maximum value. However, for steam headers, 300 PSI fire lines, or critical plants targeting >15 years life, upgrading to double or triple-offset butterfly valves eliminates 90% of maintenance downtime and delivers guaranteed zero leakage.'
                    )
                  : t(
                      'Đối với đường ống công nghệ dưới DN150 và áp lực dưới 40 bar, van bi nổi (Floating Ball) cung cấp khả năng đóng ngắt xuất sắc. Với đường kính lớn từ DN200 hoặc các tuyến ống dẫn dầu khí, hydrocarbon và khí thiên nhiên áp suất Class 600 - 1500, van bi Trunnion Mounted là bắt buộc theo chuẩn API 6D để đảm bảo an toàn vận hành nhẹ nhàng và chống cháy nổ tuyệt đối.',
                      'For process piping up to DN150 and under 40 bar, floating ball valves provide superb shutoff at modest cost. For larger sizes or high pressure Class 600-1500 hydrocarbon transport, Trunnion Mounted ball valves are mandatory under API 6D for low operating torque and dual sealing integrity.'
                    )
                }
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>{t('Hệ thống dữ liệu kiểm định cơ khí ASME B16.34 / API 598', 'ASME B16.34 / API 598 Engineering Database')}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            {t('Đóng Bảng So Sánh', 'Close Comparison')}
          </button>
        </div>

      </div>
    </div>
  );
};
