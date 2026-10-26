import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  ShieldAlert, 
  Wind, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  Sliders, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Gauge, 
  Building2,
  ExternalLink,
  Copy,
  Check,
  Wrench,
  AlertTriangle,
  RotateCw,
  Droplet,
  Compass,
  Download
} from 'lucide-react';
import { 
  FIRE_FIGHTING_KNOWLEDGE, 
  STEAM_KNOWLEDGE, 
  CROSS_REFERENCE_INTELLIGENCE, 
  HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE 
} from '../data/knowledgeData';
import { SupportedLanguage } from '../types/valve';

interface KnowledgeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly';
  lang: SupportedLanguage;
}

type HpSubTab = 'overview' | 'media' | 'installation' | 'operation' | 'troubleshooting';

export const KnowledgeHubModal: React.FC<KnowledgeHubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'pccc',
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly'>(initialTab);
  const [hpSubTab, setHpSubTab] = useState<HpSubTab>('installation');
  const [copiedToast, setCopiedToast] = useState(false);

  if (!isOpen) return null;

  const handleCopyHpDocumentation = () => {
    const text = `=== ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.title} ===
Nguồn tham chiếu: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.sourceCredit} (${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.sourceUrl})

1. TỔNG QUAN HÌNH HỌC LỆCH TÂM BA (TRIPLE OFFSET):
${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.offsetExplanation.map(o => `- ${o.title} ${o.detail}`).join('\n')}

2. MÔI CHẤT & ỨNG DỤNG CÔNG NGHIỆP:
${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.industrialApplications.map(a => `* ${a.sectorVi}:\n  Môi chất: ${a.suitableMedia.join(', ')}\n  Khuyến nghị: ${a.recommendedTrimVi}\n  Ghi chú: ${a.valmetNoteVi}`).join('\n\n')}

3. QUY TRÌNH LẮP ĐẶT CHUẨN UTDCORP IOM:
- Nâng hạ: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.safetyAndHandling[0].detailVi}
- Hướng trục van: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.orientationGuidelines[0].detailVi}
- Cảnh báo vị trí: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.orientationGuidelines[1].detailVi}
- Đoạn ống thẳng: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.orientationGuidelines[2].detailVi}
- Cảnh báo hàn: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.weldingPrecautions.join('\n')}
- Thứ tự siết bu lông: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.boltTorqueSequence.stepsVi.join('\n')}

4. VẬN HÀNH & CHẠY THỬ:
- Cân chỉnh cữ chặn: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.actuatorStopsCalibration}
- Chiều quay: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.rotationDirection}
- Thổi rửa đường ống: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.pipelineFlushing}
- Thử áp lực: ${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.hydrotestPrecautions}

5. MA TRẬN KHẮC PHỤC SỰ CỐ:
${HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.troubleshootingMatrix.map(t => `* ${t.problemVi}:\n  Nguyên nhân: ${t.causesVi.join('; ')}\n  Khắc phục: ${t.solutionsVi.join('; ')}`).join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                  {lang === 'vi' ? 'TRUNG TÂM TRI THỨC KỸ THUẬT & TRA CỨU QUỐC TẾ UTD' : 'UTD GLOBAL VALVE ENGINEERING & KNOWLEDGE HUB'}
                </h2>
                <span className="bg-emerald-900/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700">
                  UTDCORP IOM Standards
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'vi' 
                  ? 'Cẩm nang PCCC • Kỹ thuật Steam Lò Hơi • Bảng Tra Tương Đương • Tài Liệu Chuẩn UTDCORP IOM Cho Van Bướm Hiệu Suất Cao' 
                  : 'Fire Protection • Steam Systems • Cross-Reference • UTDCORP IOM Standard High Performance Butterfly Manual'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveTab('pccc')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pccc'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>{lang === 'vi' ? '1. Van PCCC & Hệ Chữa Cháy Khí' : '1. Fire Protection Valves'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steam')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'steam'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>{lang === 'vi' ? '2. Kỹ Thuật Hệ Steam Lò Hơi & Bẫy Hơi' : '2. Steam Boiler Systems'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cross_ref')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cross_ref'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{lang === 'vi' ? '3. Bảng Tra Tương Đương Quốc Tế (UTDCORP / JC / Spirax)' : '3. Cross-Reference Matrix (UTDCORP / JC / Spirax)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hp_butterfly')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hp_butterfly'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'vi' ? '4. Cẩm Nang UTDCORP IOM: Van Bướm Hiệu Suất Cao UTD' : '4. UTDCORP IOM Manual: High Performance Butterfly'}</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">UTDCORP</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* TAB 1: PCCC & FIRE FIGHTING */}
          {activeTab === 'pccc' && (
            <div className="space-y-6">
              {FIRE_FIGHTING_KNOWLEDGE.map((topic) => (
                <div key={topic.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider font-mono">
                        {topic.badge}
                      </span>
                      <h3 className="text-sm font-black text-white mt-0.5">
                        {lang === 'vi' ? topic.title : topic.titleEn}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{topic.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                    {topic.summary}
                  </p>
                  <div className="space-y-4 pt-2">
                    {topic.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>{sec.heading}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed pl-5">{sec.content}</p>
                        {sec.specsOrSteps && (
                          <div className="pl-5 pt-1">
                            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                              {sec.specsOrSteps.map((item, iIdx) => (
                                <li key={iIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: STEAM & BOILER SYSTEMS */}
          {activeTab === 'steam' && (
            <div className="space-y-6">
              {STEAM_KNOWLEDGE.map((topic) => (
                <div key={topic.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                        {topic.badge}
                      </span>
                      <h3 className="text-sm font-black text-white mt-0.5">
                        {lang === 'vi' ? topic.title : topic.titleEn}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{topic.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                    {topic.summary}
                  </p>
                  <div className="space-y-4 pt-2">
                    {topic.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>{sec.heading}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed pl-5">{sec.content}</p>
                        {sec.specsOrSteps && (
                          <div className="pl-5 pt-1">
                            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                              {sec.specsOrSteps.map((item, iIdx) => (
                                <li key={iIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CROSS REFERENCE MATRIX */}
          {activeTab === 'cross_ref' && (
            <div className="space-y-6">
              <div className="space-y-6">
                {CROSS_REFERENCE_INTELLIGENCE.map((brandItem, bIdx) => (
                  <div key={bIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <h4 className="text-sm font-extrabold text-white uppercase font-mono">
                          {lang === 'vi' ? 'So Sánh Đối Ứng Với Hãng: ' : 'Benchmarking Against: '}<span className="text-amber-400">{brandItem.brand}</span> ({brandItem.brandOrigin})
                        </h4>
                      </div>
                      <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                        {brandItem.equivalentProducts.length} Models Mapped
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {brandItem.equivalentProducts.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-colors"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">
                                {lang === 'vi' ? 'Mã Hiệu Hãng Khác:' : 'Manufacturer / Reference Model:'}
                              </span>
                              <strong className="text-xs text-rose-300 block mt-0.5">
                                {p.competitorModel}
                              </strong>
                            </div>

                            <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/80">
                              <span className="text-[10px] font-bold text-amber-400 uppercase block font-mono">
                                {lang === 'vi' ? 'Sản Phẩm Tương Đương Thay Thế:' : 'Equivalent Solution Model:'}
                              </span>
                              <strong className="text-xs text-white block mt-0.5 font-mono">
                                {p.utdModel}
                              </strong>
                            </div>
                          </div>

                          <div className="pt-2 text-xs text-slate-300 space-y-1">
                            <p><strong className="text-emerald-400">{lang === 'vi' ? '✓ Lợi thế kỹ thuật & chi phí:' : '✓ Technical & Cost Advantage:'}</strong> {p.advantage}</p>
                            <p><strong className="text-slate-400">{lang === 'vi' ? 'Ứng dụng khuyến nghị:' : 'Recommended Applications:'}</strong> {p.suitableApps}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HIGH PERFORMANCE BUTTERFLY VALVE - FULL VALMET BENCHMARKED IOM MANUAL */}
          {activeTab === 'hp_butterfly' && (
            <div className="space-y-6">
              {/* Header Hero Banner with UTDCORP Attribution */}
              <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/40 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/70 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                      <Wind className="w-3 h-3 text-emerald-400" />
                      TÀI LIỆU KỸ THUẬT UTDCORP IOM
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      UTDCORP Heavy-Duty Series (utdcorp.com)
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.summary}
                  </p>
                  <p className="text-[11px] text-emerald-400/90 font-mono">
                    📚 {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.sourceCredit}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopyHpDocumentation}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shadow"
                    title="Sao chép toàn bộ cẩm nang kỹ thuật vào bộ nhớ tạm"
                  >
                    {copiedToast ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-300" />
                        <span>Sao chép cẩm nang</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://utdcorp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all"
                  >
                    <span>Nguồn UTDCORP.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Sub-tab Pill Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
                {[
                  { key: 'installation' as HpSubTab, label: '🛠️ Hướng Dẫn Lắp Đặt Chuẩn UTDCORP IOM', badge: 'Quy trình 5 bước' },
                  { key: 'media' as HpSubTab, label: '💧 Môi Chất & Ứng Dụng (Pulp, Steam, Chem, Cryo)', badge: '5 Ngành cốt lõi' },
                  { key: 'operation' as HpSubTab, label: '⚙️ Vận Hành & Hiệu Chuẩn Hành Trình', badge: 'Cữ chặn 90°' },
                  { key: 'troubleshooting' as HpSubTab, label: '🔧 Ma Trận Bảo Trì & Xử Lý Sự Cố', badge: 'Chẩn đoán 4 lỗi' },
                  { key: 'overview' as HpSubTab, label: '📐 Cấu Tạo & Hình Học Lệch Tâm Ba', badge: 'Cơ chế Camming' }
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setHpSubTab(st.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                      hpSubTab === st.key
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${hpSubTab === st.key ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {st.badge}
                    </span>
                  </button>
                ))}
              </div>

              {/* 4 Global Stats KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.keyStats.map((kpi, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-center">
                    <span className="text-lg sm:text-xl font-black text-amber-400 font-mono block">
                      {kpi.value}
                    </span>
                    <h5 className="text-xs font-bold text-slate-200 mt-1">{kpi.label}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{kpi.desc}</p>
                  </div>
                ))}
              </div>

              {/* SUB-TAB: INSTALLATION GUIDELINES (Chuẩn UTDCORP IOM) */}
              {hpSubTab === 'installation' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Safety & Rigging */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>1. QUY TẮC NÂNG HẠ AN TOÀN & BẢO QUẢN KHO (RIGGING & STORAGE)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.safetyAndHandling.map((item, i) => (
                        <div key={i} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                          <strong className="text-white text-xs font-bold block">{item.ruleVi}</strong>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{item.detailVi}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Orientation Guidelines */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400" />
                      <span>2. HƯỚNG LẮP ĐẶT TRỤC VAN & ĐOẠN ỐNG THẲNG (SHAFT ORIENTATION & PIPE RUNS)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.orientationGuidelines.map((item, i) => (
                        <div key={i} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                          <strong className="text-emerald-300 text-xs font-bold block">{item.ruleVi}</strong>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{item.detailVi}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Flow Direction Protocol */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 font-mono flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span>3. QUY CHUẨN HƯỚNG DÒNG CHẢY ƯU TIÊN (PREFERRED FLOW DIRECTION PROTOCOL)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.flowDirectionProtocol.map((item, i) => (
                        <div key={i} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                          <strong className="text-blue-300 text-xs font-bold block">{item.ruleVi}</strong>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{item.detailVi}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Welding Warning & 4-Step Welding Protocol */}
                  <div className="bg-rose-950/20 border border-rose-600/40 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <span>4. CẢNH BÁO QUAN TRỌNG VỀ HÀN MẶT BÍCH (WELDING PRECAUTIONS)</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.weldingPrecautions.map((p, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-rose-900/40">
                          <span className="font-mono text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                          <span className="text-slate-200 text-[11px] leading-relaxed">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Star Pattern Bolting Torque Sequence */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                      <RotateCw className="w-4 h-4 text-amber-400" />
                      <span>5. TRÌNH TỰ SIẾT BULONG MẶT BÍCH HÌNH SAO 5 BƯỚC (BOLT TORQUE SEQUENCE)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.installationIOM.boltTorqueSequence.stepsVi.map((step, idx) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-center space-y-1">
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center justify-center mx-auto">
                            {idx + 1}
                          </span>
                          <p className="text-[10px] text-slate-300 leading-tight">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: MEDIA & INDUSTRIAL APPLICATIONS */}
              {hpSubTab === 'media' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 font-mono mb-2">
                      BẢNG HƯỚNG DẪN MÔI CHẤT & TIÊU CHUẨN LỰA CHỌN VẬT LIỆU (UTDCORP COMPATIBILITY MATRIX)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Tổng hợp môi chất công nghiệp khắt khe nhất do UTDCORP kiểm chứng và cung cấp độc quyền, áp dụng đồng nhất cho dòng van bướm UTD Fig. H401/H402 (utdcorp.com).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.industrialApplications.map((app, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <h5 className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-blue-400" />
                            <span>{app.sectorVi}</span>
                          </h5>
                          <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                            Verified
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block">
                            Danh sách môi chất vận hành tương thích:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {app.suitableMedia.map((m, mIdx) => (
                              <div key={mIdx} className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-emerald-400 font-bold block">✓ Cấu hình vật liệu khuyến nghị (Trim):</span>
                            <span className="text-slate-300 mt-0.5 block">{app.recommendedTrimVi}</span>
                          </div>
                          <div className="bg-blue-950/40 p-2.5 rounded-lg border border-blue-900/40">
                            <span className="text-blue-300 font-bold block">📘 Tiêu chuẩn kỹ thuật UTDCORP:</span>
                            <span className="text-slate-300 mt-0.5 block">{app.valmetNoteVi}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB: OPERATION & COMMISSIONING */}
              {hpSubTab === 'operation' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>QUY TRÌNH VẬN HÀNH & CHẠY THỬ ĐƯỜNG ỐNG (COMMISSIONING PROTOCOL)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                        <strong className="text-white text-xs font-bold block flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>1. Cân Chỉnh Cữ Chặn Hành Trình (Mechanical Stops)</span>
                        </strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.actuatorStopsCalibration}
                        </p>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                        <strong className="text-white text-xs font-bold block flex items-center gap-1.5">
                          <RotateCw className="w-4 h-4 text-blue-400" />
                          <span>2. Chiều Quay Vận Hành Chuẩn Quốc Tế</span>
                        </strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.rotationDirection}
                        </p>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                        <strong className="text-white text-xs font-bold block flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>3. Thổi Rửa Đường Ống (Flushing at 100% Full Open)</span>
                        </strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.pipelineFlushing}
                        </p>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                        <strong className="text-white text-xs font-bold block flex items-center gap-1.5">
                          <Gauge className="w-4 h-4 text-purple-400" />
                          <span>4. Thử Áp Lực Thủy Tĩnh Tuyến Ống (Hydrotest)</span>
                        </strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.operationIOM.hydrotestPrecautions}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: TROUBLESHOOTING MATRIX */}
              {hpSubTab === 'troubleshooting' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 font-mono mb-1">
                      MA TRẬN CHẨN ĐOÁN SỰ CỐ & BIỆN PHÁP KHẮC PHỤC HIỆN TRƯỜNG (FIELD TROUBLESHOOTING MATRIX)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Bảng tra cứu xử lý 4 sự cố phổ biến nhất tại công trường theo quy trình kỹ thuật van bướm công nghiệp do UTDCORP cung cấp (utdcorp.com).
                    </p>
                  </div>

                  <div className="space-y-3">
                    {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.troubleshootingMatrix.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                          <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 font-mono text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h5 className="font-bold text-white text-xs">
                            {item.problemVi}
                          </h5>
                          <span className="text-[9px] font-mono text-slate-500 hidden sm:inline">({item.problemEn})</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                          <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                            <span className="text-amber-400 font-bold block">⚠️ Nguyên nhân có thể xảy ra:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-300">
                              {item.causesVi.map((c, cIdx) => (
                                <li key={cIdx}>{c}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30 space-y-1">
                            <span className="text-emerald-400 font-bold block">✓ Biện pháp xử lý & Khắc phục:</span>
                            <ul className="list-disc pl-4 space-y-1 text-emerald-200/90">
                              {item.solutionsVi.map((s, sIdx) => (
                                <li key={sIdx}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB: OVERVIEW & OFFSET ARCHITECTURE */}
              {hpSubTab === 'overview' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 font-mono">
                      GIẢI PHÁP HÌNH HỌC LỆCH TÂM BA (TRIPLE OFFSET ARCHITECTURE)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {HIGH_PERFORMANCE_BUTTERFLY_KNOWLEDGE.offsetExplanation.map((off, i) => (
                        <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-1.5">
                          <strong className="text-emerald-400 font-bold block">{off.title}</strong>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{off.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">Hỗ trợ kỹ thuật & IOM Manual UTD:</span> hotline <strong className="text-amber-400 font-bold text-sm">0932790928</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors"
          >
            Đóng Cẩm Nang Kỹ Thuật
          </button>
        </div>
      </div>
    </div>
  );
};
